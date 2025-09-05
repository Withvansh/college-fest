// lib/api/recruiterProfile.ts
import axiosInstance from "../utils/axios";

export interface RecruiterProfile {
  _id: string;
  company_name: string;
  full_name: string;
  email: string;
  company_website?: string;
  location?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  package_purchased?: string[];
  verify: boolean;
  created_at: string;
  industry:string;
}

export interface RecruiterProfileUpdateData {
  company_name?: string;
  full_name?: string;
  company_website?: string;
  location?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  package_purchased?: string[];
}

export const recruiterProfileAPI = {
  async getProfile(): Promise<RecruiterProfile> {
    try {
      const response = await axiosInstance.get('/recruiter/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recruiter profile:', error);
      throw error;
    }
  },

  async updateProfile(updates: RecruiterProfileUpdateData): Promise<RecruiterProfile> {
    try {
      const response = await axiosInstance.put('/recruiter/profile', updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating recruiter profile:', error);
      throw error;
    }
  },

  async getRecruiterById(id: string): Promise<RecruiterProfile> {
    try {
      const response = await axiosInstance.get(`/recruiter/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recruiter by ID:', error);
      throw error;
    }
  },

  async getRecruiterByEmail(email: string): Promise<RecruiterProfile> {
    try {
      const response = await axiosInstance.get(`/recruiter/email/${email}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recruiter by email:', error);
      throw error;
    }
  },

async searchRecruiters(query: string = "all"): Promise<RecruiterProfile[]> {
  try {
    const response = await axiosInstance.get('/recruiter/search', {
      params: { query }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching recruiters:', error);
    throw error;
  }
},

  async getRandomRecruiters(limit: number = 10): Promise<RecruiterProfile[]> {
    try {
      const response = await axiosInstance.get('/recruiter/random', {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching random recruiters:', error);
      throw error;
    }
  }
};