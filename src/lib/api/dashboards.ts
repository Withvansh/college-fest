export const dashboardsApi = {
  async getDashboard(userId: string) {
    return {
      stats: {
        totalJobs: 0,
        applications: 0,
        interviews: 0
      }
    };
  },
  async updateDashboard(userId: string, data: any) {
    return { id: userId, ...data };
  }
};