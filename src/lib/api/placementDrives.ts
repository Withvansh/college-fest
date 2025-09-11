import BackendAPI from './backend';

export interface PlacementDrive {
  _id?: string;
  id?: string;
  title: string;
  company: string;
  role: string;
  description?: string;
  college_id: string;
  recruiter_id?: string;
  drive_date: string;
  drive_time: string;
  registration_deadline: string;
  eligibility_criteria: string;
  mode: "Online" | "Offline" | "Hybrid";
  location?: string;
  salary_package?: string;
  requirements?: string;
  positions_available: number;
  status: "Open" | "Closed" | "Upcoming" | "Completed";
  is_active: boolean;
  registrations?: number;
  offCampus:boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlacementRegistration {
  _id?: string;
  placement_drive_id: string;
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

export interface CreatePlacementDriveRequest {
  title: string;
  company: string;
  role: string;
  description?: string;
  college_id: string;
  recruiter_id?: string;
  drive_date: string;
  drive_time: string;
  registration_deadline: string;
  eligibility_criteria: string;
  mode: "Online" | "Offline" | "Hybrid";
  location?: string;
  salary_package?: string;
  requirements?: string;
  positions_available: number;
  offCampus:boolean
}

export interface DashboardStats {
  totalDrives: number;
  activeDrives: number;
  totalRegistrations: number;
  totalPlacements: number;
  averagePackage: number;
}

export interface Company {
  name: string;
  hires: number;
  package: string;
  totalDrives?: number;
}

class PlacementDriveAPI extends BackendAPI {
  private baseUrl = '/placement-drives';

  // College APIs
  async createPlacementDrive(collegeId: string, driveData: CreatePlacementDriveRequest): Promise<PlacementDrive> {
    return this.post(`${this.baseUrl}/college/${collegeId}/drives`, driveData);
  }

  async getPlacementDrives(
    collegeId: string, 
    filters?: { 
      status?: string; 
      page?: number; 
      limit?: number; 
      search?: string 
    }
  ): Promise<{
    drives: PlacementDrive[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? 
      `${this.baseUrl}/college/${collegeId}/drives?${queryString}` : 
      `${this.baseUrl}/college/${collegeId}/drives`;

    const data:{data:{
    drives: PlacementDrive[];
    total: number;
    page: number;
    totalPages: number;
  }} =await this.get(url);
  return data.data
  }

  async getCollegeDashboardStats(collegeId: string): Promise<{
    stats: DashboardStats;
    upcomingDrives: PlacementDrive[];
    topCompanies: Company[];
  }> {
    const data:{data:{
    stats: DashboardStats;
    upcomingDrives: PlacementDrive[];
    topCompanies: Company[];
  }}= await this.get(`${this.baseUrl}/college/${collegeId}/dashboard`);
  return data.data;
  }

  // Drive-specific APIs
  async getPlacementDriveById(driveId: string): Promise<PlacementDrive> {
    const data:{data:PlacementDrive}=await this.get(`${this.baseUrl}/drives/${driveId}`);
    return data.data
  }
  

  async updatePlacementDrive(driveId: string, updateData: Partial<CreatePlacementDriveRequest>): Promise<PlacementDrive> {
    return this.put(`${this.baseUrl}/drives/${driveId}`, updateData);
  }

  async deletePlacementDrive(driveId: string): Promise<{ success: boolean; message: string }> {
    return this.delete(`${this.baseUrl}/drives/${driveId}`);
  }

async getDriveRegistrations(
  driveId: string,
  filters?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
  }
): Promise<{
  registrations: PlacementRegistration[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);

  const queryString = params.toString();
  const url = queryString
    ? `${this.baseUrl}/drives/${driveId}/registrations?${queryString}`
    : `${this.baseUrl}/drives/${driveId}/registrations`;

  const response: {
    data: {
      registrations: PlacementRegistration[];
      total: number;
      page: number;
      totalPages: number;
    };
  } = await this.get(url);

  return response.data;
}


  // Student APIs
  async getAllActivePlacementDrives(
    collegeId: string,
    filters?: { 
      page?: number; 
      limit?: number; 
      search?: string 
    }
  ): Promise<{
    drives: PlacementDrive[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    params.append('college_id', collegeId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    return this.get(`${this.baseUrl}/drives?${params.toString()}`);
  }

  async registerStudentForDrive(
    driveId: string, 
    registrationData: {
      student_id: string;
      student_name: string;
      roll_number: string;
      branch: string;
      cgpa: number;
      email: string;
      phone: string;
      resume_url?: string;
    }
  ): Promise<PlacementRegistration> {
    return this.post(`${this.baseUrl}/drives/${driveId}/register`, registrationData);
  }

  // Helper methods for frontend
  async exportRegistrations(driveId: string): Promise<Blob> {
    try {
      const result = await this.getDriveRegistrations(driveId, { limit: 1000 });
      const registrations = result.registrations;

      // Create CSV content
      const csvContent = [
        ['Name', 'Roll Number', 'Branch', 'CGPA', 'Email', 'Phone', 'Registration Date'],
        ...registrations.map(reg => [
          reg.student_name,
          reg.roll_number,
          reg.branch,
          reg.cgpa.toString(),
          reg.email,
          reg.phone,
          new Date(reg.registration_date).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');

      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      throw new Error(`Failed to export registrations: ${(error as Error).message}`);
    }
  }

  // Format helper methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      case 'Upcoming': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}

export const placementDriveAPI = new PlacementDriveAPI();
