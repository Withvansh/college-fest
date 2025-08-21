// Supabase integration removed - using mock data

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
    
    // Mock data - replace with actual API calls when backend is ready
    return {
      totalEmployees: 25,
      todayAttendance: {
        present: 22,
        absent: 2,
        onLeave: 1,
        percentage: 88
      },
      pendingLeaveApprovals: 3,
      openPositions: 2,
      trainingHours: 120,
      employees: [],
      positions: [],
      trainingSessions: []
    };
  },

  // Company Management
  async createCompany(company: Omit<Company, 'id' | 'created_at'>) {
    console.log('Creating company:', company);
    return {
      id: 'mock-' + Date.now(),
      ...company,
      created_at: new Date().toISOString()
    };
  },

  async getCompanies() {
    return [];
  },

  // Employee Management
  async getEmployees(userId: string) {
    console.log('Getting employees for user:', userId);
    return [];
  },

  async createEmployee(employee: any) {
    console.log('Creating employee with data:', employee);
    return {
      id: 'mock-' + Date.now(),
      ...employee,
      created_at: new Date().toISOString()
    };
  },

  async updateEmployee(id: string, updates: Partial<EmployeeInsert>) {
    console.log('Updating employee:', id, updates);
    return {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    };
  },

  // Attendance Management
  async punchIn(employeeId: string, location?: { lat: number; lng: number }) {
    console.log('Punching in employee:', employeeId, location);
    return {
      id: 'mock-' + Date.now(),
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      check_in_time: new Date().toISOString(),
      location,
      status: 'present',
      created_at: new Date().toISOString()
    };
  },

  async punchOut(recordId: string) {
    console.log('Punching out record:', recordId);
    return {
      id: recordId,
      check_out_time: new Date().toISOString()
    };
  },

  async getAttendanceRecords(employeeId: string, month?: string) {
    console.log('Getting attendance records for:', employeeId, month);
    return [];
  },

  // Leave Management
  async applyLeave(leave: Omit<LeaveApplication, 'id' | 'created_at' | 'updated_at'>) {
    console.log('Applying leave:', leave);
    return {
      id: 'mock-' + Date.now(),
      ...leave,
      status: 'pending' as const,
      applied_date: new Date().toISOString()
    };
  },

  async getLeaveApplications(employeeId: string) {
    console.log('Getting leave applications for:', employeeId);
    return [];
  },

  async approveLeave(leaveId: string, approverId: string, comments?: string) {
    console.log('Approving leave:', leaveId, approverId, comments);
    return {
      id: leaveId,
      status: 'approved',
      approved_by: approverId,
      approved_date: new Date().toISOString(),
      approver_comments: comments
    };
  },

  async rejectLeave(leaveId: string, approverId: string, comments: string) {
    console.log('Rejecting leave:', leaveId, approverId, comments);
    return {
      id: leaveId,
      status: 'rejected',
      approved_by: approverId,
      approved_date: new Date().toISOString(),
      approver_comments: comments
    };
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
