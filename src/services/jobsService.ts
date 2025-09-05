import axiosInstance from "../lib/utils/axios";

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  posted_by: string; // recruiter ID
  posted_at: string;
  deadline?: string;
  skills_required: string[];
  benefits?: string[];
  remote_work: boolean;
  status: 'active' | 'inactive' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface JobCreateData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  deadline?: string;
  skills_required: string[];
  benefits?: string[];
  remote_work: boolean;
}

export interface JobUpdateData {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  requirements?: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
  deadline?: string;
  skills_required?: string[];
  benefits?: string[];
  remote_work?: boolean;
  status?: 'active' | 'inactive' | 'closed';
}

export interface JobApplication {
  _id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
  resume_url?: string;
  cover_letter?: string;
}

export interface JobApplicationCreateData {
  job_id: string;
  resume_url?: string;
  cover_letter?: string;
}

export const jobsService = {
  async getJobs(): Promise<Job[]> {
    try {
      const response = await axiosInstance.get('/jobs/list');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getJobById(id: string): Promise<Job> {
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  },

  async createJob(job: JobCreateData): Promise<Job> {
    try {
      const response = await axiosInstance.post('/jobs/create', job);
      return response.data.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async updateJob(id: string, updates: JobUpdateData): Promise<Job> {
    try {
      const response = await axiosInstance.put(`/jobs/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  async deleteJob(id: string): Promise<{ id: string }> {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      return { id };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  async searchJobs(query: string = "all"): Promise<Job[]> {
    try {
      const response = await axiosInstance.get('/jobs/search', {
        params: { query }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  async getJobsByRecruiter(recruiterId: string): Promise<Job[]> {
    try {
      const response = await axiosInstance.get(`/jobs/recruiter/${recruiterId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching jobs by recruiter:', error);
      throw error;
    }
  },

  async applyToJob(application: JobApplicationCreateData): Promise<JobApplication> {
    try {
      const response = await axiosInstance.post('/jobs/apply', application);
      return response.data.data;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  },

  async getApplications(userId: string): Promise<JobApplication[]> {
    try {
      const response = await axiosInstance.get(`/jobs/applications/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    try {
      const response = await axiosInstance.get(`/jobs/applications/job/${jobId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching applications by job:', error);
      throw error;
    }
  },

  async updateApplicationStatus(applicationId: string, status: JobApplication['status']): Promise<JobApplication> {
    try {
      const response = await axiosInstance.put(`/jobs/applications/${applicationId}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
};