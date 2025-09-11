import BackendAPI from './backend';

export interface StudentProfile {
  _id: string;
  full_name: string;
  email: string;
  enrollment_no: string;
  verifiedByCollege:string;
  course: string;
  year: number;
  department?: string;
  college_id: string;
  phone?: string;
  cgpa?: number;
  resume_url?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  father_name?: string;
  mother_name?: string;
  emergency_contact?: string;
  blood_group?: string;
  profile_complete?: boolean;
  tenth_percentage?: number;
  twelfth_percentage?: number;
  graduation_percentage?: number;
}

export interface PlacementDrive {
  _id: string;
  title: string;
  company: string;
  role: string;
  description?: string;
  drive_date: string;
  drive_time: string;
  registration_deadline: string;
  eligibility_criteria: string;
  mode: "Online" | "Offline" | "Hybrid";
  location?: string;
  salary_package?: string;
  requirements?: string;
  positions_available: number;
  status: "Open" | "Closed" | "Upcoming";
}

export interface StudentApplication {
  _id: string;
  placement_drive_id: PlacementDrive;
  student_id: string;
  registration_date: string;
  student_name: string;
  roll_number: string;
  branch: string;
  cgpa: number;
  email: string;
  phone: string;
  resume_url?: string;
  status: "Registered" | "Selected" | "Rejected" | "Waitlisted";
}

export interface StudentNotification {
  _id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
  totalDrives: number;
  unreadNotifications: number;
}

export interface StudentDashboardData {
  student: StudentProfile;
  stats: DashboardStats;
  recentApplications: StudentApplication[];
  upcomingDrives: PlacementDrive[];
  notifications: StudentNotification[];
}

export interface StudentAnalytics {
  performanceData: {
    totalApplications: number;
    testsCompleted: number;
    averageScore: number;
    shortlisted: number;
    interviews: number;
    offers: number;
  };
  applicationOutcomes: Array<{
    status: string;
    company: string;
    package?: string;
    appliedDate: string;
  }>;
  monthlyProgress: Array<{
    _id: { year: number; month: number };
    applications: number;
    selected: number;
  }>;
  testHistory: Array<{
    company: string;
    date: string;
    score: number;
    status: string;
  }>;
}

 class StudentAPI extends BackendAPI {
  private baseUrl = '/student';

  // Get student dashboard data
 async getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  const response: { data: StudentDashboardData } = await this.get(
    `${this.baseUrl}/dashboard/${studentId}`
  );
  return response.data;
}


  // Get available placement drives
  async getAvailableDrives(
    studentId: string,
    filters?: {
      page?: number;
      limit?: number;
      search?: string;
    }
  ): Promise<{data:{
    drives: PlacementDrive[];
    total: number;
    page: number;
    totalPages: number;
  }}> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    return this.get(`${this.baseUrl}/${studentId}/drives/available?${params.toString()}`);
  }

  // Get student applications
  async getStudentApplications(
    studentId: string,
    filters?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<{data:{
    applications: StudentApplication[];
    total: number;
    page: number;
    totalPages: number;
  }}> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);

    return this.get(`${this.baseUrl}/${studentId}/applications?${params.toString()}`);
  }

  // Apply to placement drive
  async applyToPlacementDrive(
    studentId: string,
    driveId: string,
    resumeUrl?: string
  ): Promise<StudentApplication> {
    return this.post(`${this.baseUrl}/${studentId}/drives/${driveId}/apply`, {
      resume_url: resumeUrl
    });
  }
async getStudentProfile(studentId: string): Promise<StudentProfile> {
    const data:{data:StudentProfile}= await  this.get(`${this.baseUrl}/${studentId}/profile`);
    return data.data;
  }
  // Get student analytics
  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
    return this.get(`${this.baseUrl}/${studentId}/analytics`);
  }

  // Get student notifications
  async getStudentNotifications(
    studentId: string,
    filters?: {
      page?: number;
      limit?: number;
      type?: string;
    }
  ): Promise<{
    notifications: StudentNotification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);

    const data:{data:{
    notifications: StudentNotification[];
    total: number;
    page: number;
    totalPages: number;
  }}=await  this.get(`${this.baseUrl}/${studentId}/notifications?${params.toString()}`);
  return data.data;
  }

  // Mark notification as read
  async markNotificationAsRead(studentId: string, notificationId: string): Promise<StudentNotification> {
    return this.patch(`${this.baseUrl}/${studentId}/notifications/${notificationId}/read`);
  }

  // Update student profile
  async updateStudentProfile(studentId: string, updateData: Partial<StudentProfile>): Promise<StudentProfile> {
    return this.patch(`${this.baseUrl}/${studentId}/profile`, updateData);
  }

  // Helper methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Selected':
        return 'text-green-600 bg-green-100';
      case 'Registered':
        return 'text-blue-600 bg-blue-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      case 'Waitlisted':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Selected':
        return '✅';
      case 'Registered':
        return '📝';
      case 'Rejected':
        return '❌';
      case 'Waitlisted':
        return '⏳';
      default:
        return '📄';
    }
  }

  // Calculate days until deadline
  getDaysUntilDeadline(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if application deadline is urgent (less than 3 days)
  isDeadlineUrgent(deadline: string): boolean {
    return this.getDaysUntilDeadline(deadline) <= 3;
  }
}
const studentAPI = new StudentAPI();
export default studentAPI;
