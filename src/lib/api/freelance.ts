
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FreelanceGig = Database['public']['Tables']['freelance_gigs']['Row'];
type FreelanceGigInsert = Database['public']['Tables']['freelance_gigs']['Insert'];
type FreelanceProposal = Database['public']['Tables']['freelance_proposals']['Row'];
type FreelanceProposalInsert = Database['public']['Tables']['freelance_proposals']['Insert'];

export const freelanceApi = {
  async getGigs(filters: {
    category?: string;
    skills?: string[];
    budgetMin?: number;
    budgetMax?: number;
  } = {}) {
    let query = supabase
      .from('freelance_gigs')
      .select(`
        *,
        profiles!freelance_gigs_client_id_fkey(full_name, company_name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills_required', filters.skills);
    }
    
    if (filters.budgetMin) {
      query = query.gte('budget_min', filters.budgetMin);
    }
    
    if (filters.budgetMax) {
      query = query.lte('budget_max', filters.budgetMax);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createGig(gig: FreelanceGigInsert) {
    const { data, error } = await supabase
      .from('freelance_gigs')
      .insert(gig)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitProposal(proposal: FreelanceProposalInsert) {
    const { data, error } = await supabase
      .from('freelance_proposals')
      .insert(proposal)
      .select(`
        *,
        freelance_gigs(title, budget_min, budget_max),
        profiles!freelance_proposals_freelancer_id_fkey(full_name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getGigProposals(gigId: string) {
    const { data, error } = await supabase
      .from('freelance_proposals')
      .select(`
        *,
        profiles!freelance_proposals_freelancer_id_fkey(full_name, email, avatar_url, skills)
      `)
      .eq('gig_id', gigId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateProposalStatus(proposalId: string, status: string) {
    const { data, error } = await supabase
      .from('freelance_proposals')
      .update({ status })
      .eq('id', proposalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
