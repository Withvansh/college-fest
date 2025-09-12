import axios from "../utils/axios";

export interface CompanyInviteRequest {
  companyName: string;
  contactEmail: string;
  message: string;
  college_id: string;
  recruiter_id: string;
  students?: string[];
  job_role: string;
  package?: string;
  location?: string;
  drive_date: string; // ISO string
}

export interface UpdateInviteRequest {
  students?: string[];
  job_role?: string;
  package?: string;
  location?: string;
  drive_date?: string;
}

export interface CompanyInviteResponse {
  success: boolean;
  message: string;
  data?: any;
  remainingCredits?: number;
}

export const companyInviteAPI = {
  // ------------------ PLACEMENT REQUESTS ------------------

  // Send invite and create drive
  sendInviteAndCreateDrive: async (
    data: CompanyInviteRequest
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.post(`/company-invite/invite`, data);
    return response.data;
  },

  // Update invite / placement request
  updateInvite: async (
    requestId: string,
    data: UpdateInviteRequest
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.put(
      `/company-invite/invite/${requestId}`,
      data
    );
    return response.data;
  },

  // Get invite by ID
  getInviteById: async (id: string): Promise<CompanyInviteResponse> => {
    const response = await axios.get(`/company-invite/invite/${id}`);
    return response.data;
  },

  // Get all invites by recruiter
  getInvitesByRecruiter: async (id:string): Promise<CompanyInviteResponse> => {
    const response = await axios.get(`/company-invite/recruiter/${id}`);
    return response.data;
  },

  // Update placement status
  updateInviteStatus: async (
    requestId: string,
    status: string
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.put(
      `/company-invite/invite/${requestId}/status`,
      { status }
    );
    return response.data;
  },

  // Delete invite
  deleteInvite: async (requestId: string): Promise<CompanyInviteResponse> => {
    const response = await axios.delete(
      `/company-invite/invite/${requestId}`
    );
    return response.data;
  },

  // ------------------ COLLEGE CREDITS ------------------

  // Get remaining credits for a college
  getRemainingCredits: async (
    collegeId: string
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.get(
      `/company-invite/credits?collegeId=${collegeId}`
    );
    return response.data;
  },

  // Add credits (admin only)
  addCredits: async (
    collegeId: string,
    credits: number
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.post(`/company-invite/credits/add`, {
      collegeId,
      credits,
    });
    return response.data;
  },

  // Update credits (admin only)
  updateCredits: async (
    collegeId: string,
    credits: number
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.put(`/company-invite/credits/update`, {
      collegeId,
      credits,
    });
    return response.data;
  },

  // Get college details
  getCollegeDetails: async (
    collegeId: string
  ): Promise<CompanyInviteResponse> => {
    const response = await axios.get(
      `/company-invite/college?collegeId=${collegeId}`
    );
    return response.data;
  },
};
