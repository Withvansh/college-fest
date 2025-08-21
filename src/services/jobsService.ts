export const jobsService = {
  async getJobs() {
    return [];
  },
  async getJobById(id: string) {
    return null;
  },
  async createJob(job: any) {
    return { id: 'mock-' + Date.now(), ...job };
  },
  async applyToJob(application: any) {
    return { id: 'mock-' + Date.now(), ...application };
  },
  async getApplications(userId: string) {
    return [];
  },
  async updateJob(id: string, updates: any) {
    return { id, ...updates };
  },
  async deleteJob(id: string) {
    return { id };
  }
};