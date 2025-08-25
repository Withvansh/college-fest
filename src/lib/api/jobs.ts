import { recruiterDashboardsApi } from './recruiter-dashboard';

export const jobsApi = {
  async getJobs(filters = {}) {
    // For now, return empty array - can be implemented later for general job listings
    return [];
  },
  async getAllJobs() {
    // For now, return empty array - can be implemented later for general job listings
    return [];
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
  async updateJob(id: string, updates: any) {
    return await recruiterDashboardsApi.updateJob(id, updates);
  },
  async deleteJob(id: string) {
    await recruiterDashboardsApi.deleteJob(id);
    return { id };
  },
  async getRecruiterJobs(recruiterId: string) {
    try {
      const result = await recruiterDashboardsApi.getJobs(recruiterId);
      return result.jobs || [];
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error);
      return [];
    }
  }
};