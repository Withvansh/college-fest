
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobApplication = Database['public']['Tables']['job_applications']['Row'];
type JobType = Database['public']['Enums']['job_type'];

export const jobsService = {
  // Get all active jobs with performance optimization
  async getJobs(filters?: {
    location?: string;
    job_type?: JobType;
    skills?: string[];
    experience_min?: number;
    experience_max?: number;
  }) {
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          profiles:recruiter_id (
            full_name,
            company_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50); // Limit initial load for better performance

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.job_type) {
        query = query.eq('job_type', filters.job_type);
      }

      if (filters?.experience_min !== undefined) {
        query = query.gte('experience_required', filters.experience_min);
      }

      if (filters?.experience_max !== undefined) {
        query = query.lte('experience_required', filters.experience_max);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getJobs:', error);
      return [];
    }
  },

  // Get job by ID
  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles:recruiter_id (
          full_name,
          company_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }

    return data;
  },

  // Create new job
  async createJob(jobData: Omit<JobInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }

    return data;
  },

  // Update job
  async updateJob(id: string, updates: Partial<JobInsert>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }

    return data;
  },

  // Get jobs by recruiter
  async getJobsByRecruiter(recruiterId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('recruiter_id', recruiterId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recruiter jobs:', error);
      throw error;
    }

    return data;
  },

  // Apply to job
  async applyToJob(jobId: string, applicationData: {
    cover_letter?: string;
    resume_url?: string;
  }) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        applicant_id: (await supabase.auth.getUser()).data.user?.id,
        ...applicationData
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying to job:', error);
      throw error;
    }

    return data;
  },

  // Get applications for a job (for recruiters)
  async getJobApplications(jobId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles:applicant_id (
          full_name,
          email,
          phone,
          location,
          skills,
          experience_years,
          resume_url
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }

    return data;
  },

  // Get user's applications
  async getUserApplications(userId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs (
          title,
          company_name,
          location,
          job_type
        )
      `)
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }

    return data;
  },

  // Update application status (for recruiters)
  async updateApplicationStatus(
    applicationId: string, 
    status: 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected',
    notes?: string
  ) {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status, notes })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }

    return data;
  }
};
