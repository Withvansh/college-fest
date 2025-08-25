import BackendAPI from './backend';

type Employee = {
  _id: string;
  user_id: string | null;
  company_id: string | null;
  employee_id: string;
  department: string | null;
  designation: string | null;
  employment_status: 'probation' | 'active' | 'terminated' | 'resigned' | 'retired' | null;
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
  employment_status?: 'probation' | 'active' | 'terminated' | 'resigned' | 'retired' | null;
  joining_date?: string | null;
};

type AttendanceRecord = {
  _id: string;
  employee_id: string | null;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'early_departure' | null;
  created_at: string;
};

type LeaveApplication = {
  _id: string;
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
  _id: string;
  name: string;
  industry: string | null;
  company_size: string | null;
  created_at: string;
};

type TrainingSession = {
  _id: string;
  user_id: string;
  title: string;
  status: string;
  duration_hours: number;
  created_at: string;
};

type Position = {
  _id: string;
  user_id: string;
  title: string;
  status: string;
  created_at: string;
};

class HRMSApi extends BackendAPI {
  // Dashboard Analytics
  async getDashboardMetrics(userId: string) {
    console.log('Loading dashboard metrics for user:', userId);
    
    try {
      // Try to get real data from backend
      return await this.get(`/hrms-dashboard/${userId}/metrics`);
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      
      // Fallback to mock data if backend is not available
      return {
        totalEmployees: 25,
        activeEmployees: 23,
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
    }
  }

  async getOrCreateDashboard(userId: string) {
    try {
      return await this.get(`/hrms-dashboard/${userId}/init`);
    } catch (error) {
      console.warn('Backend not available for dashboard creation:', error);
      return null;
    }
  }

  async getHRAnalytics(userId: string) {
    try {
      return await this.get(`/hrms-dashboard/${userId}/analytics`);
    } catch (error) {
      console.warn('Backend not available for analytics:', error);
      return {
        departmentData: [],
        statusDistribution: [],
        attendanceData: []
      };
    }
  }

  // Company Management
  async createCompany(company: Omit<Company, '_id' | 'created_at'>) {
    console.log('Creating company:', company);
    // Mock implementation - replace with backend call
    return {
      _id: `company_${Date.now()}`,
      ...company,
      created_at: new Date().toISOString()
    };
  }

  async getCompanies() {
    console.log('Getting companies');
    // Mock implementation
    return [];
  }

  // Employee Management
  async getEmployees(userId?: string) {
    console.log('Getting employees for user:', userId);
    // Mock implementation
    return [];
  }

  async createEmployee(employee: EmployeeInsert) {
    console.log('Creating employee:', employee);
    // Mock implementation
    return {
      _id: `employee_${Date.now()}`,
      ...employee,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async updateEmployee(employeeId: string, updates: Partial<Employee>) {
    console.log('Updating employee:', employeeId, updates);
    // Mock implementation
    return null;
  }

  async deleteEmployee(employeeId: string) {
    console.log('Deleting employee:', employeeId);
    // Mock implementation
    return null;
  }

  // Attendance Management
  async getAttendanceRecords(employeeId?: string, date?: string) {
    console.log('Getting attendance records for:', employeeId, date);
    // Mock implementation
    return [];
  }

  async createAttendanceRecord(record: Omit<AttendanceRecord, '_id' | 'created_at'>) {
    console.log('Creating attendance record:', record);
    // Mock implementation
    return {
      _id: `attendance_${Date.now()}`,
      ...record,
      created_at: new Date().toISOString()
    };
  }

  async updateAttendanceRecord(recordId: string, updates: Partial<AttendanceRecord>) {
    console.log('Updating attendance record:', recordId, updates);
    // Mock implementation
    return null;
  }

  // Leave Management
  async getLeaveApplications(employeeId?: string) {
    console.log('Getting leave applications for:', employeeId);
    // Mock implementation
    return [];
  }

  async createLeaveApplication(application: Omit<LeaveApplication, '_id'>) {
    console.log('Creating leave application:', application);
    // Mock implementation
    return {
      _id: `leave_${Date.now()}`,
      ...application
    };
  }

  async updateLeaveApplication(applicationId: string, updates: Partial<LeaveApplication>) {
    console.log('Updating leave application:', applicationId, updates);
    // Mock implementation
    return null;
  }

  async approveLeaveApplication(applicationId: string) {
    console.log('Approving leave application:', applicationId);
    return this.updateLeaveApplication(applicationId, { status: 'approved' });
  }

  async rejectLeaveApplication(applicationId: string) {
    console.log('Rejecting leave application:', applicationId);
    return this.updateLeaveApplication(applicationId, { status: 'rejected' });
  }

  // Training Management
  async getTrainingSessions(userId?: string) {
    console.log('Getting training sessions for:', userId);
    // Mock implementation
    return [];
  }

  async createTrainingSession(session: Omit<TrainingSession, '_id' | 'created_at'>) {
    console.log('Creating training session:', session);
    // Mock implementation
    return {
      _id: `training_${Date.now()}`,
      ...session,
      created_at: new Date().toISOString()
    };
  }

  // Position Management
  async getPositions(userId?: string) {
    console.log('Getting positions for:', userId);
    // Mock implementation
    return [];
  }

  async createPosition(position: Omit<Position, '_id' | 'created_at'>) {
    console.log('Creating position:', position);
    // Mock implementation
    return {
      _id: `position_${Date.now()}`,
      ...position,
      created_at: new Date().toISOString()
    };
  }
}

export const hrmsApi = new HRMSApi();
export default hrmsApi;
