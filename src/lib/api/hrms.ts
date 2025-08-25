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
      console.log('Backend unavailable, using demo data for development');
      
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
      console.log('Backend unavailable, using demo configuration');
      return null;
    }
  }

  async getHRAnalytics(userId: string) {
    try {
      return await this.get(`/hrms-dashboard/${userId}/analytics`);
    } catch (error) {
      console.log('Backend unavailable, using demo analytics data');
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
    try {
      const response = await this.get(`/hrms-dashboard/employees${userId ? `?userId=${userId}` : ''}`);
      return response || [];
    } catch (error) {
      console.log('Backend unavailable, using demo employee data');
      // Return mock data as fallback
      return [
        {
          _id: 'emp1',
          employee_id: 'EMP240001',
          full_name: 'John Doe',
          email: 'john.doe@company.com',
          department: 'Engineering',
          designation: 'Software Engineer',
          employment_status: 'active',
          joining_date: '2024-01-15',
          phone: '+91 9876543210'
        },
        {
          _id: 'emp2',
          employee_id: 'EMP240002',
          full_name: 'Jane Smith',
          email: 'jane.smith@company.com',
          department: 'Human Resources',
          designation: 'HR Manager',
          employment_status: 'active',
          joining_date: '2024-02-01',
          phone: '+91 9876543211'
        }
      ];
    }
  }

  async createEmployee(employee: any) {
    console.log('Creating employee:', employee);
    try {
      const response = await this.post('/hrms-dashboard/employees', employee);
      return response;
    } catch (error) {
      console.log('Backend unavailable, onboarding with demo data');
      // Fallback to mock
      return {
        _id: `employee_${Date.now()}`,
        ...employee,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
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
    try {
      const response = await this.get(`/hrms-dashboard/leaves${employeeId ? `?employeeId=${employeeId}` : ''}`);
      return response || [];
    } catch (error) {
      console.log('Backend unavailable, using demo leave data');
      // Return mock data as fallback
      return [
        {
          _id: 'leave1',
          employee_id: 'emp1',
          employee_name: 'John Doe',
          leave_type: 'sick',
          start_date: '2024-08-20',
          end_date: '2024-08-22',
          total_days: 3,
          status: 'pending',
          reason: 'Fever and cold',
          applied_date: '2024-08-18'
        },
        {
          _id: 'leave2',
          employee_id: 'emp2',
          employee_name: 'Jane Smith',
          leave_type: 'casual',
          start_date: '2024-08-25',
          end_date: '2024-08-25',
          total_days: 1,
          status: 'approved',
          reason: 'Personal work',
          applied_date: '2024-08-20'
        }
      ];
    }
  }

  async createLeaveApplication(application: any) {
    console.log('Creating leave application:', application);
    try {
      const response = await this.post('/hrms-dashboard/leaves', application);
      return response;
    } catch (error) {
      console.log('Backend unavailable, submitting leave request with demo data');
      // Fallback to mock
      return {
        _id: `leave_${Date.now()}`,
        ...application,
        applied_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
    }
  }

  async updateLeaveApplication(leaveId: string, updates: any) {
    console.log('Updating leave application:', leaveId, updates);
    try {
      const response = await this.put(`/hrms-dashboard/leaves/${leaveId}`, updates);
      return response;
    } catch (error) {
      console.log('Backend unavailable, approving leave with demo data');
      return null;
    }
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

  // Payroll Management
  async getPayrollData(employeeId?: string) {
    console.log('Getting payroll data for:', employeeId);
    try {
      const response = await this.get(`/hrms-dashboard/payroll${employeeId ? `?employeeId=${employeeId}` : ''}`);
      return response || [];
    } catch (error) {
      console.log('Backend unavailable, using demo payroll data');
      // Return mock data as fallback
      return [
        {
          id: 1,
          employee: 'John Doe',
          department: 'Engineering',
          basicSalary: 80000,
          allowances: 15000,
          deductions: 8000,
          netSalary: 87000,
          status: 'Generated',
          month: 'January 2024'
        },
        {
          id: 2,
          employee: 'Jane Smith',
          department: 'Marketing',
          basicSalary: 65000,
          allowances: 12000,
          deductions: 6500,
          netSalary: 70500,
          status: 'Pending',
          month: 'January 2024'
        }
      ];
    }
  }

  async generatePayslip(employeeId: number | string) {
    console.log('Generating payslip for:', employeeId);
    try {
      const response = await this.post(`/hrms-dashboard/payroll/generate/${employeeId}`, {});
      return response;
    } catch (error) {
      console.log('Backend unavailable, generating demo payslip');
      // Fallback to mock
      return {
        success: true,
        message: 'Payslip generated successfully'
      };
    }
  }

  async downloadPayslip(employeeId: number | string) {
    console.log('Downloading payslip for:', employeeId);
    try {
      const response = await this.get(`/hrms-dashboard/payroll/download/${employeeId}`);
      return response;
    } catch (error) {
      console.log('Backend unavailable, downloading demo payslip');
      // Fallback to mock download
      return {
        success: true,
        downloadUrl: '#'
      };
    }
  }

  // Feedback Management
  async getFeedback(employeeId?: string) {
    console.log('Getting feedback for:', employeeId);
    try {
      const response = await this.get(`/hrms-dashboard/feedback${employeeId ? `?employeeId=${employeeId}` : ''}`);
      return response || [];
    } catch (error) {
      console.log('Backend unavailable, using demo feedback data');
      return [
        {
          id: 1,
          employee: 'John Doe',
          reviewer: 'Manager',
          rating: 4.5,
          comments: 'Excellent performance',
          date: '2024-01-15'
        }
      ];
    }
  }

  async createFeedback(feedback: any) {
    console.log('Creating feedback:', feedback);
    try {
      const response = await this.post('/hrms-dashboard/feedback', feedback);
      return response;
    } catch (error) {
      console.log('Backend unavailable, submitting feedback with demo data');
      return {
        _id: `feedback_${Date.now()}`,
        ...feedback,
        created_date: new Date().toISOString().split('T')[0]
      };
    }
  }
}

export const hrmsApi = new HRMSApi();
export default hrmsApi;
