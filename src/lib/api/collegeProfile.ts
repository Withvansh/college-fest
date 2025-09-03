// lib/api/collegeProfile.ts
import axiosInstance from "../utils/axios";

export interface CollegeProfile {
  _id: string;
  college_name: string;
  full_name: string;
  email: string;
  institute_code?: string;
  university_affiliation?: string;
  city?: string;
  state?: string;
  accreditation?: string;
  tpo_name?: string;
  tpo_email?: string;
  tpo_mobile?: string;
  course_branch?: string;
  total_students?: number;
  created_at: string;
}

export interface CollegeProfileUpdateData {
  college_name?: string;
  full_name?: string;
  institute_code?: string;
  university_affiliation?: string;
  city?: string;
  state?: string;
  accreditation?: string;
  tpo_name?: string;
  tpo_email?: string;
  tpo_mobile?: string;
  course_branch?: string;
  total_students?: number;
}

export const collegeProfileAPI = {
  async getProfile(): Promise<CollegeProfile> {
    try {
      const response = await axiosInstance.get('/college/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching college profile:', error);
      throw error;
    }
  },
async getStudentsByCollegeId(id:string){
const response= await axiosInstance.get(`/college/students/${id}`);
return response.data;

  },
  async updateProfile(updates: CollegeProfileUpdateData): Promise<CollegeProfile> {
    try {
      const response = await axiosInstance.put('/college/profile', updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating college profile:', error);
      throw error;
    }
  },
};