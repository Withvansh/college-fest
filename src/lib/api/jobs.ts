import { recruiterDashboardsApi } from './recruiter-dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

// Create headers helper
const createHeaders = (requireAuth = false) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

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

      const response = await fetch(`${API_BASE_URL}/api/jobs/list?${queryParams}`, {
        method: 'GET',
        headers: createHeaders(false), // Jobs list might be public
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: JobsListResponse = await response.json();
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
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: 'GET',
        headers: createHeaders(false),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: JobResponse = await response.json();
      console.log('Fetched job by ID:', result.data);
      
      // Ensure consistent ID field
      const job = {
        ...result.data,
        id: result.data.id || (result.data as any)._id
      };
      
      return job;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      console.log('Creating job:', jobData);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: JobResponse = await response.json();
      console.log('Created job:', result.data);
      
      return {
        ...result.data,
        id: result.data.id || (result.data as any)._id
      };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    try {
      console.log('Updating job:', id, updates);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: JobResponse = await response.json();
      console.log('Updated job:', result.data);
      
      return {
        ...result.data,
        id: result.data.id || (result.data as any)._id
      };
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  async deleteJob(id: string): Promise<{ id: string }> {
    try {
      console.log('Deleting job:', id);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      console.log('Deleted job:', id);
      return { id };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  async getRecruiterJobs(recruiterId: string): Promise<Job[]> {
    try {
      console.log('Fetching recruiter jobs:', recruiterId);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/recruiter/${recruiterId}`, {
        method: 'GET',
        headers: createHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: JobsListResponse = await response.json();
      console.log('Fetched recruiter jobs:', result);
      
      // Transform data to ensure consistent ID field
      const transformedJobs = (result.data || []).map(job => ({
        ...job,
        id: job.id || (job as any)._id
      }));
      
      return transformedJobs;
    } catch (error) {
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