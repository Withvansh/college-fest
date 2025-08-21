export const applicationsApi = {
  async applyToJob(application: any) {
    return { id: 'mock-' + Date.now(), ...application };
  },
  async getApplications(userId: string) {
    return [];
  },
  async getApplicationById(id: string) {
    return null;
  },
  async updateApplicationStatus(id: string, status: string) {
    return { id, status };
  },
  async getJobApplications(jobId: string) {
    return [];
  }
};