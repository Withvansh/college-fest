export const jobsApi = {
  async getJobs(filters = {}) {
    return [];
  },
  async getAllJobs() {
    return [];
  },
  async getJobById(id: string) {
    return null;
  },
  async createJob(job: any) {
    return { id: 'mock-' + Date.now(), ...job };
  },
  async updateJob(id: string, updates: any) {
    return { id, ...updates };
  },
  async deleteJob(id: string) {
    return { id };
  },
  async getRecruiterJobs(recruiterId: string) {
    return [];
  }
};