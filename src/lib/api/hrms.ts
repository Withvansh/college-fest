import { supabase } from '@/integrations/supabase/client';

type Employee = {
  id: string;
  user_id: string | null;
  company_id: string | null;
  employee_id: string;
  department: string | null;
  designation: string | null;
  employment_status: 'on_leave' | 'active' | 'inactive' | 'terminated' | 'probation' | null;
  joining_date: string | null;
  created_at: string;
  updated_at: string;
};

type EmployeeInsert = {
  user_id?: string | null;
  company_id?: string | null;
  employee_id: string;
  department?: string | null;
  designation?: string | null;
  employment_status?: 'on_leave' | 'active' | 'inactive' | 'terminated' | 'probation' | null;
  joining_date?: string | null;
};

type AttendanceRecord = {
  id: string;
  employee_id: string | null;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'half_day' | 'work_from_home' | 'on_leave' | null;
  created_at: string;
};

type LeaveApplication = {
  id: string;
  employee_id: string | null;
  leave_type: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'bereavement' | 'emergency';
  start_date: string;
  end_date: string;
  total_days: number;
  status: 'pending' | 'approved' | 'rejected' | null;
  reason: string;
  applied_date: string | null;
};

type Company = {
  id: string;
  name: string;
  industry: string | null;
  company_size: string | null;
  created_at: string;
};

// Simple types to avoid circular dependencies
type TrainingSession = {
  id: string;
  user_id: string;
  title: string;
  status: string;
  duration_hours: number;
  created_at: string;
};

type Position = {
  id: string;
  user_id: string;
  title: string;
  status: string;
  created_at: string;
};

export const hrmsApi = {
  // Dashboard Analytics
  async getDashboardMetrics(userId: string) {
    console.log('Loading dashboard metrics for user:', userId);
    
    try {
      // Get employees from the database
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*')
        .or(`user_id.eq.${userId},created_by.eq.${userId}`);

      if (empError) {
        console.error('Error fetching employees:', empError);
      }

      // Get attendance records for today
      const today = new Date().toISOString().split('T')[0];
      const { data: todayAttendance, error: attError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', today);

      if (attError) {
        console.error('Error fetching attendance:', attError);
      }

      // Get pending leave applications
      const { data: leaveApps, error: leaveError } = await supabase
        .from('leave_applications')
        .select('*')
        .eq('status', 'pending');

      if (leaveError) {
        console.error('Error fetching leave applications:', leaveError);
      }

      // Calculate metrics with fallbacks
      const totalEmployees = employees?.length || 0;
      const attendanceRecords = todayAttendance || [];
      const presentToday = attendanceRecords?.filter(att => att.status === 'present').length || 0;
      const absentToday = attendanceRecords?.filter(att => att.status === 'absent').length || 0;
      const onLeaveToday = attendanceRecords?.filter(att => att.status === 'on_leave').length || 0;
      const attendancePercentage = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;
      const pendingLeaveApprovals = leaveApps?.length || 0;

      // Mock data for features not yet implemented
      const openPositions = 0;
      const completedTrainingHours = 0;

      return {
        totalEmployees,
        todayAttendance: {
          present: presentToday,
          absent: absentToday,
          onLeave: onLeaveToday,
          percentage: attendancePercentage
        },
        pendingLeaveApprovals,
        openPositions,
        trainingHours: completedTrainingHours,
        employees: employees || [],
        positions: [],
        trainingSessions: []
      };
    } catch (error) {
      console.error('Error in getDashboardMetrics:', error);
      // Return default metrics in case of error
      return {
        totalEmployees: 0,
        todayAttendance: {
          present: 0,
          absent: 0,
          onLeave: 0,
          percentage: 0
        },
        pendingLeaveApprovals: 0,
        openPositions: 0,
        trainingHours: 0,
        employees: [],
        positions: [],
        trainingSessions: []
      };
    }
  },

  // Company Management
  async createCompany(company: Omit<Company, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        industry: company.industry,
        company_size: company.company_size
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Employee Management
  async getEmployees(userId: string) {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        profiles!employees_user_id_fkey(full_name, email, phone, avatar_url)
      `)
      .or(`user_id.eq.${userId},created_by.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createEmployee(employee: any) {
    console.log('Creating employee with data:', employee);
    
    try {
      // First, create the employee record
      const { data, error } = await supabase
        .from('employees')
        .insert({
          user_id: employee.user_id,
          created_by: employee.created_by,
          employee_id: employee.employee_id,
          department: employee.department,
          designation: employee.designation,
          employment_status: employee.employment_status || 'probation',
          joining_date: employee.joining_date,
          work_location: employee.work_location,
          salary_structure: employee.salary_structure,
          emergency_contact: employee.emergency_contact,
          employee_type: employee.employee_type || 'full_time'
        })
        .select(`
          *,
          profiles!employees_user_id_fkey(full_name, email, phone)
        `)
        .single();

      if (error) {
        console.error('Error creating employee:', error);
        throw error;
      }

      console.log('Employee created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createEmployee:', error);
      throw error;
    }
  },

  async updateEmployee(id: string, updates: Partial<EmployeeInsert>) {
    const updateData: any = {};
    
    if (updates.user_id !== undefined) updateData.user_id = updates.user_id;
    if (updates.company_id !== undefined) updateData.company_id = updates.company_id;
    if (updates.employee_id !== undefined) updateData.employee_id = updates.employee_id;
    if (updates.department !== undefined) updateData.department = updates.department;
    if (updates.designation !== undefined) updateData.designation = updates.designation;
    if (updates.employment_status !== undefined) updateData.employment_status = updates.employment_status;
    if (updates.joining_date !== undefined) updateData.joining_date = updates.joining_date;

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Attendance Management
  async punchIn(employeeId: string, location?: { lat: number; lng: number }) {
    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        employee_id: employeeId,
        date: new Date().toISOString().split('T')[0],
        check_in_time: new Date().toISOString(),
        location: location ? { lat: location.lat, lng: location.lng } : null,
        status: 'present'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async punchOut(recordId: string) {
    const { data, error } = await supabase
      .from('attendance_records')
      .update({
        check_out_time: new Date().toISOString()
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAttendanceRecords(employeeId: string, month?: string) {
    let query = supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });

    if (month) {
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Leave Management - Fixed type issues
  async applyLeave(leave: Omit<LeaveApplication, 'id' | 'created_at' | 'updated_at'>) {
    // Ensure leave_type is a valid enum value
    const validLeaveTypes = ['sick', 'casual', 'earned', 'maternity', 'paternity', 'bereavement', 'emergency'];
    const leaveType = validLeaveTypes.includes(leave.leave_type) ? leave.leave_type as any : 'casual';
    
    // Ensure status is a valid enum value
    const validStatuses = ['pending', 'approved', 'rejected'];
    const status = leave.status && validStatuses.includes(leave.status) ? leave.status as any : 'pending';

    const insertData: any = {
      employee_id: leave.employee_id,
      leave_type: leaveType,
      start_date: leave.start_date,
      end_date: leave.end_date,
      total_days: leave.total_days,
      status: status,
      reason: leave.reason,
      applied_date: leave.applied_date || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('leave_applications')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLeaveApplications(employeeId: string) {
    const { data, error } = await supabase
      .from('leave_applications')
      .select('*')
      .eq('employee_id', employeeId)
      .order('applied_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async approveLeave(leaveId: string, approverId: string, comments?: string) {
    const { data, error } = await supabase
      .from('leave_applications')
      .update({
        status: 'approved',
        approved_by: approverId,
        approved_date: new Date().toISOString(),
        approver_comments: comments
      })
      .eq('id', leaveId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rejectLeave(leaveId: string, approverId: string, comments: string) {
    const { data, error } = await supabase
      .from('leave_applications')
      .update({
        status: 'rejected',
        approved_by: approverId,
        approved_date: new Date().toISOString(),
        approver_comments: comments
      })
      .eq('id', leaveId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Training Sessions Management - temporarily mocked
  async createTrainingSession(session: Omit<TrainingSession, 'id' | 'created_at'> & { user_id: string }) {
    console.log('Training session creation temporarily disabled until types are updated:', session);
    return {
      id: 'temp-' + Date.now(),
      ...session,
      created_at: new Date().toISOString()
    };
  },

  async getTrainingSessions(userId: string) {
    console.log('Training sessions fetch temporarily disabled until types are updated for user:', userId);
    return [];
  },

  async updateTrainingSession(id: string, updates: Partial<TrainingSession>) {
    console.log('Training session update temporarily disabled until types are updated:', id, updates);
    return { id, ...updates };
  },

  async createPosition(position: Omit<Position, 'id' | 'created_at'> & { user_id: string }) {
    console.log('Position creation temporarily disabled until types are updated:', position);
    return {
      id: 'temp-' + Date.now(),
      ...position,
      created_at: new Date().toISOString()
    };
  },

  async getPositions(userId: string) {
    console.log('Positions fetch temporarily disabled until types are updated for user:', userId);
    return [];
  },

  async updatePosition(id: string, updates: Partial<Position>) {
    console.log('Position update temporarily disabled until types are updated:', id, updates);
    return { id, ...updates };
  }
};
