import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  review_type: 'client_to_freelancer' | 'freelancer_to_client';
  created_at?: string;
}

export const reviewsApi = {
  async getReviews(userId?: string) {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url),
        reviewee:profiles!reviews_reviewee_id_fkey(full_name, avatar_url),
        contract:freelance_contracts(contract_amount, gig:freelance_gigs(title))
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`reviewer_id.eq.${userId},reviewee_id.eq.${userId}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getUserReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url),
        contract:freelance_contracts(contract_amount, gig:freelance_gigs(title))
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createReview(review: Omit<Review, 'id' | 'created_at'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        ...review,
        reviewer_id: user.user.id
      }])
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url),
        reviewee:profiles!reviews_reviewee_id_fkey(full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAverageRating(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', userId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const total = data.reduce((sum, review) => sum + review.rating, 0);
    const average = total / data.length;
    
    return { average: Math.round(average * 10) / 10, count: data.length };
  }
};
