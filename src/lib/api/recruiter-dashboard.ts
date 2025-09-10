import BackendAPI from './backend';
import axiosInstance from '../utils/axios';

export interface RecruiterDashboard {
  _id: string;
  recruiter_id: string;
  dashboard_name: string;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    interviewsScheduled: number;
    hiredCandidates: number;
  };
  recent_activities: Array<{
    action: string;
    timestamp: Date;
    type: string;
    job_id?: string;
    application_id?: string;
  }>;
  created_at?: Date;
  updated_at?: Date;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string; // Backend uses string, not array
  company_name: string;
  location: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  employment_type?: string;
  min_salary?: number;
  max_salary?: number;
  currency?: string;
  experience_required?: number;
  experience_level?: string;
  skills_required?: string[];
  education_requirements?: string[];
  certifications_required?: string[];
  benefits?: string[];
  department?: string;
  job_category?: string;
  travel_required?: string;
  urgency_level?: string;
  remote_allowed?: boolean;
  application_deadline?: Date;
  recruiter_id: string;
  company_id?: string;
  hiring_manager_id?: string;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'expired';
  budget_min?: number;
  budget_max?: number;
  created_at: Date;
  updated_at: Date;
}

export interface JobRef {
  _id: string;
  title: string;
  company_name: string;
  location?: string;
  job_type?: string;
}

export interface ApplicantRef {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interviewed'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  _id: string;
  job_id: string | JobRef;
  applicant_id: string | ApplicantRef;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  expected_salary?: number;
  test_score?: number;
  interview_score?: number;
  interview_date?: Date;
  interview_notes?: string;
  rejection_reason?: string;
  notes?: string;
  applied_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AssessmentTest {
  _id: string;
  title: string;
  description: string;
  role: string;
  level: 'junior' | 'mid' | 'senior';
  duration: number; // in minutes
  total_questions: number;
  passing_score: number;
  questions: Array<{
    question: string;
    type: 'multiple_choice' | 'coding' | 'essay';
    options?: string[];
    correct_answer?: string;
    points: number;
  }>;
  status: 'draft' | 'published' | 'archived';
  recruiter_id: string;
  created_at: Date;
  updated_at: Date;
}

class RecruiterDashboardAPI extends BackendAPI {
  // Dashboard endpoints
  async getDashboard(recruiterId: string): Promise<RecruiterDashboard> {
    return this.get<RecruiterDashboard>(`/recruiter-dashboard/${recruiterId}`);
  }

  async getOrCreateDashboard(recruiterId: string): Promise<RecruiterDashboard> {
    return this.get<RecruiterDashboard>(`/recruiter-dashboard/${recruiterId}/init`);
  }

  async updateDashboard(
    recruiterId: string,
    data: Partial<RecruiterDashboard>
  ): Promise<RecruiterDashboard> {
    return this.put<RecruiterDashboard>(`/recruiter-dashboard/${recruiterId}`, data);
  }

  async refreshDashboard(recruiterId: string): Promise<RecruiterDashboard> {
    return this.post<RecruiterDashboard>(`/recruiter-dashboard/${recruiterId}/refresh`);
  }

  async getDashboardStats(recruiterId: string): Promise<any> {
    return this.get(`/recruiter-dashboard/${recruiterId}/stats`);
  }

  // Job endpoints
  async createJob(jobData: Omit<Job, '_id' | 'created_at' | 'updated_at'>): Promise<Job> {
    return this.post<Job>('/jobs', jobData);
  }

  async getJobs(
    recruiterId: string,
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<{ jobs: Job[]; total: number; pagination: any }> {
    let endpoint = `/jobs/recruiter/${recruiterId}?page=${page}&limit=${limit}`;

    // Add filter parameters
    if (filters.status) endpoint += `&status=${filters.status}`;
    if (filters.jobType) endpoint += `&job_type=${filters.jobType}`;
    if (filters.location) endpoint += `&location=${filters.location}`;
    if (filters.companyName) endpoint += `&company_name=${filters.companyName}`;
    if (filters.title) endpoint += `&title=${filters.title}`;
    if (filters.experienceLevel) endpoint += `&experience_level=${filters.experienceLevel}`;
    if (filters.department) endpoint += `&department=${filters.department}`;
    if (filters.remoteAllowed !== undefined) endpoint += `&remote_allowed=${filters.remoteAllowed}`;

    try {
      const response = await axiosInstance.get(`${endpoint}`);

      const data = response.data.data || response.data;

      return {
        jobs: data.data || data || [],
        total: data.total || 0,
        pagination: data.pagination || {},
      };
    } catch (error: any) {
      console.error(`API request failed: ${endpoint}`, error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch jobs');
    }
  }

  async getJobById(jobId: string): Promise<Job> {
    return this.get<Job>(`/jobs/${jobId}`);
  }

  async updateJob(jobId: string, data: Partial<Job>): Promise<Job> {
    return this.put<Job>(`/jobs/${jobId}`, data);
  }

  async deleteJob(jobId: string): Promise<void> {
    return this.delete(`/jobs/${jobId}`);
  }

  async updateJobStatus(jobId: string, status: Job['status']): Promise<Job> {
    return this.patch<Job>(`/jobs/${jobId}/status`, { status });
  }

  async getJobStats(recruiterId: string): Promise<any> {
    return this.get(`/jobs/recruiter/${recruiterId}/stats`);
  }

  // Job Application endpoints
  async getApplications(
    recruiterId: string,
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<{ applications: any[]; total: number; pagination: any }> {
    let endpoint = `/job-applications/recruiter/${recruiterId}?page=${page}&limit=${limit}`;

    // Add filter parameters
    if (filters.status) endpoint += `&status=${filters.status}`;
    if (filters.jobTitle) endpoint += `&job_title=${filters.jobTitle}`;
    if (filters.applicantName) endpoint += `&applicant_name=${filters.applicantName}`;
    if (filters.companyName) endpoint += `&company_name=${filters.companyName}`;
    if (filters.location) endpoint += `&location=${filters.location}`;
    if (filters.jobType) endpoint += `&job_type=${filters.jobType}`;

    try {
      const fullResponse: any = await this.get(endpoint);

      const data = fullResponse.data || fullResponse;

      return {
        applications: data.data || data || [],
        total: data.total || 0,
        pagination: data.pagination || {},
      };
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getApplicationsByJob(
    jobId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ applications: JobApplication[]; total: number; pagination: any }> {
    const endpoint = `/job-applications/job/${jobId}?page=${page}&limit=${limit}`;

    try {
      const fullResponse: any = await this.get(endpoint);
      console.log('.....................................................................');
      console.log('.....................................................................');
      console.log(fullResponse);
      console.log('..........................................................................');
      console.log('.....................................................................');
      return {
        applications: fullResponse || [],
        total: fullResponse.total || 0,
        pagination: fullResponse.pagination || {},
      };
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getApplicationById(applicationId: string): Promise<JobApplication> {
    return this.get<JobApplication>(`/job-applications/${applicationId}`);
  }

  async updateApplicationStatus(
    applicationId: string,
    status: JobApplication['status']
  ): Promise<JobApplication> {
    return this.patch<JobApplication>(`/job-applications/${applicationId}/status`, { status });
  }

  async scheduleInterview(
    applicationId: string,
    interviewDate: Date,
    notes?: string
  ): Promise<JobApplication> {
    return this.patch<JobApplication>(`/job-applications/${applicationId}/interview`, {
      interview_date: interviewDate,
      interview_notes: notes,
    });
  }

  async rejectApplication(applicationId: string, reason: string): Promise<JobApplication> {
    return this.patch<JobApplication>(`/job-applications/${applicationId}/reject`, {
      rejection_reason: reason,
    });
  }

  async hireCandidate(applicationId: string): Promise<JobApplication> {
    return this.patch<JobApplication>(`/job-applications/${applicationId}/hire`);
  }

  async getApplicationStats(recruiterId: string): Promise<any> {
    return this.get(`/job-applications/recruiter/${recruiterId}/stats`);
  }

  // Assessment Test endpoints
  async createTest(
    testData: Omit<AssessmentTest, '_id' | 'created_at' | 'updated_at'>
  ): Promise<AssessmentTest> {
    return this.post<AssessmentTest>('/assessment-tests', testData);
  }

  async getTests(
    recruiterId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ tests: AssessmentTest[]; total: number; pagination: any }> {
    return this.get(`/assessment-tests/recruiter/${recruiterId}?page=${page}&limit=${limit}`);
  }

  async getTestById(testId: string): Promise<AssessmentTest> {
    return this.get<AssessmentTest>(`/assessment-tests/${testId}`);
  }

  async updateTest(testId: string, data: Partial<AssessmentTest>): Promise<AssessmentTest> {
    return this.put<AssessmentTest>(`/assessment-tests/${testId}`, data);
  }

  async deleteTest(testId: string): Promise<void> {
    return this.delete(`/assessment-tests/${testId}`);
  }

  async publishTest(testId: string): Promise<AssessmentTest> {
    return this.patch<AssessmentTest>(`/assessment-tests/${testId}/publish`);
  }

  async archiveTest(testId: string): Promise<AssessmentTest> {
    return this.patch<AssessmentTest>(`/assessment-tests/${testId}/archive`);
  }

  async duplicateTest(testId: string, newTitle: string): Promise<AssessmentTest> {
    return this.post<AssessmentTest>(`/assessment-tests/${testId}/duplicate`, { title: newTitle });
  }

  async searchTests(
    query: string,
    filters?: any,
    page: number = 1,
    limit: number = 20
  ): Promise<{ tests: AssessmentTest[]; total: number; pagination: any }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.get(`/assessment-tests/search?${params}`);
  }
}

export const recruiterDashboardsApi = new RecruiterDashboardAPI();
export default recruiterDashboardsApi;
