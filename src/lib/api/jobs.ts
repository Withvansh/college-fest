
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];

export const jobsApi = {
  async getJobs(filters: {
    location?: string;
    jobType?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
    skills?: string[];
    salaryMin?: number;
    salaryMax?: number;
  } = {}) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_recruiter_id_fkey(full_name, company_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.jobType) {
      query = query.eq('job_type', filters.jobType);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills_required', filters.skills);
    }
    
    if (filters.salaryMin) {
      query = query.gte('min_salary', filters.salaryMin);
    }
    
    if (filters.salaryMax) {
      query = query.lte('max_salary', filters.salaryMax);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getAllJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_recruiter_id_fkey(full_name, company_name),
        job_applications(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_recruiter_id_fkey(full_name, company_name, avatar_url),
        job_applications(count)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createJob(job: JobInsert) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJob(id: string, updates: Partial<JobInsert>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJob(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRecruiterJobs(recruiterId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        job_applications(count)
      `)
      .eq('recruiter_id', recruiterId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
