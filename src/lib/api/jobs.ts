import axiosInstance from '../utils/axios';
import { recruiterDashboardsApi } from './recruiter-dashboard';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  min_salary?: number;
  max_salary?: number;
  currency?: string;
  deadline?: string;
  description?: string;
  requirements?: string;
  recruiter_id: string;
  profiles?: {
    full_name?: string;
    company_name?: string;
  };
  job_applications?: { count: number }[];
}

export interface JobsListResponse {
  success: boolean;
  data: Job[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
  total: number;
  message?: string;
}

export interface JobResponse {
  success: boolean;
  data: Job;
  message?: string;
}

export const jobsApi = {
  // Get all jobs (admin view)
  async getAllJobs(page = 1, limit = 1000, filters = {}): Promise<Job[]> {
    try {
      console.log('Fetching all jobs from admin view...');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await axiosInstance.get(`/jobs/list?${queryParams}`);
      const result: JobsListResponse = response.data;
      console.log('Fetched all jobs:', result);
      
      // Transform data to ensure consistent ID field
      const transformedJobs = (result.data || []).map(job => ({
        ...job,
        id: job.id || (job as any)._id
      }));
      
      return transformedJobs;
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      return [];
    }
  },

  // Get jobs with filtering (backward compatibility)
  async getJobs(filters = {}) {
    return this.getAllJobs(1, 100, filters);
  },

  async getJobById(id: string): Promise<Job | null> {
    try {
      console.log('Fetching job by ID:', id);
      
      const response = await axiosInstance.get(`/jobs/${id}`);
      
      console.log('Fetched job by ID:', response.data.data);
      
      // Ensure consistent ID field
      const job = {
        ...response.data.data,
        id: response.data.data.id || response.data.data._id
      };
      
      return job;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching job by ID:', error);
      return null;
    }
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      console.log('Creating job:', jobData);
      
      const response = await axiosInstance.post('/api/jobs', jobData);
      
      console.log('Created job:', response.data.data);
      
      return {
        ...response.data.data,
        id: response.data.data.id || response.data.data._id
      };
    } catch (error: any) {
      console.error('Error creating job:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create job');
    }
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    try {
      console.log('Updating job:', id, updates);
      
      const response = await axiosInstance.put(`/api/jobs/${id}`, updates);
      
      console.log('Updated job:', response.data.data);
      
      return {
        ...response.data.data,
        id: response.data.data.id || response.data.data._id
      };
    } catch (error: any) {
      console.error('Error updating job:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update job');
    }
  },

  async deleteJob(id: string): Promise<{ id: string }> {
    try {
      console.log('Deleting job:', id);
      
      await axiosInstance.delete(`/api/jobs/${id}`);
      
      console.log('Deleted job:', id);
      return { id };
    } catch (error: any) {
      console.error('Error deleting job:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete job');
    }
  },

  async getRecruiterJobs(recruiterId: string): Promise<Job[]> {
    try {
      console.log('Fetching recruiter jobs:', recruiterId);
      
      const response = await axiosInstance.get(`/api/jobs/recruiter/${recruiterId}`);
      
      console.log('Fetched recruiter jobs:', response.data);
      
      // Transform data to ensure consistent ID field
      const transformedJobs = (response.data.data || []).map(job => ({
        ...job,
        id: job.id || job._id
      }));
      
      return transformedJobs;
    } catch (error: any) {
      console.error('Error fetching recruiter jobs:', error);
      
      // Fallback to existing API if needed
      try {
        const result = await recruiterDashboardsApi.getJobs(recruiterId);
        const transformedJobs = (result.jobs || []).map((job: any) => ({
          ...job,
          id: job.id || job._id
        }));
        return transformedJobs;
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return [];
      }
    }
  },

  // Get job statistics
  async getJobStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    closed: number;
    totalApplications: number;
  }> {
    try {
      const jobs = await this.getAllJobs(1, 1000);
      
      const stats = {
        total: jobs.length,
        active: jobs.filter(job => job.status === 'active').length,
        pending: jobs.filter(job => job.status === 'pending').length,
        closed: jobs.filter(job => job.status === 'closed').length,
        totalApplications: jobs.reduce((total, job) => {
          return total + (job.job_applications?.[0]?.count || 0);
        }, 0)
      };
      
      console.log('Job stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      return {
        total: 0,
        active: 0,
        pending: 0,
        closed: 0,
        totalApplications: 0
      };
    }
  }
};