
import axios from '../utils/axios';

export interface CompanyInviteRequest {
  companyName: string;
  contactEmail: string;
  message: string;
  collegeId:string;
}

interface CompanyInviteResponse {
  message: string;
  remainingCredits: number;
}

export const companyInviteAPI = {
  sendInvite: async (data: CompanyInviteRequest): Promise<CompanyInviteResponse> => {
    const response = await axios.post(`/company/invite`, data);
    return response.data;
  }
};
