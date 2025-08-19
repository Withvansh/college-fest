
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];
type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert'];

export const applicationsApi = {
  async applyToJob(application: JobApplicationInsert) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert(application)
      .select(`
        *,
        jobs(title, company_name),
        profiles!job_applications_applicant_id_fkey(full_name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserApplications(userId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs(title, company_name, location, job_type)
      `)
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getJobApplications(jobId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles!job_applications_applicant_id_fkey(full_name, email, phone, avatar_url, skills, experience_years)
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateApplicationStatus(id: string, status: 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected', notes?: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status, notes })
      .eq('id', id)
      .select(`
        *,
        profiles!job_applications_applicant_id_fkey(full_name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getApplicationById(id: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs(title, company_name, description, requirements),
        profiles!job_applications_applicant_id_fkey(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};
