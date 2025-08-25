import BackendAPI from './backend';

class ApplicationsAPI extends BackendAPI {
  async applyToJob(application: any) {
    try {
      const response = await this.post('/job-applications', application);
      return response;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  }

  async getApplications(userId: string) {
    try {
      const response = await this.get(`/job-applications/applicant/${userId}`);
      return response || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getApplicationById(id: string) {
    try {
      const response = await this.get(`/job-applications/${id}`);
      return response || null;
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      throw error;
    }
  }

  async updateApplicationStatus(id: string, status: string) {
    try {
      const response = await this.patch(`/job-applications/${id}/status`, { status });
      return response || { id, status };
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  async getJobApplications(jobId: string) {
    try {
      const response = await this.get(`/job-applications/job/${jobId}`);
      return response || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  }

  async withdrawApplication(id: string) {
    try {
      const response = await this.delete(`/job-applications/${id}`);
      return response;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const applicationsApi = new ApplicationsAPI();