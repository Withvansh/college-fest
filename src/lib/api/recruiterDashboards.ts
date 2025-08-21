export const recruiterDashboardsApi = {
  async getDashboard(userId: string) {
    return {
      totalJobs: 5,
      activeJobs: 3,
      totalApplications: 25,
      pendingApplications: 10
    };
  },
  async createDashboard(data: any) {
    return { id: 'mock-' + Date.now(), ...data };
  }
};