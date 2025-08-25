import { recruiterDashboardsApi } from '@/lib/api/recruiter-dashboard';

export const jobsService = {
  async getJobs() {
    try {
      // Use the backend API to fetch all jobs
      const response = await fetch('http://localhost:3000/api/jobs/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Jobs fetched:', data);
      
      // Return the jobs array from the response
      return data.data || data.jobs || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },
  async getJobById(id: string) {
    try {
      const job = await recruiterDashboardsApi.getJobById(id);
      return job;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  },
  async createJob(job: any) {
    return await recruiterDashboardsApi.createJob(job);
  },
  async applyToJob(application: any) {
    // This would need to be implemented with a proper application API
    return { id: 'mock-' + Date.now(), ...application };
  },
  async getApplications(userId: string) {
    // This would need to be implemented with a proper application API
    return [];
  },
  async updateJob(id: string, updates: any) {
    return await recruiterDashboardsApi.updateJob(id, updates);
  },
  async deleteJob(id: string) {
    await recruiterDashboardsApi.deleteJob(id);
    return { id };
  }
};