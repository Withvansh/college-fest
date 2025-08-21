export const adminStatsService = {
  async getStats() {
    return {
      totalUsers: 100,
      activeJobs: 25,
      totalInterviews: 50,
      scheduledInterviews: 10,
      draftJobs: 5,
      totalEmployees: 75,
      totalApplications: 200,
      totalRevenue: 50000
    };
  }
};