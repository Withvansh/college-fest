
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Test = Database['public']['Tables']['tests']['Row'];
type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestAttempt = Database['public']['Tables']['test_attempts']['Row'];
type TestAttemptInsert = Database['public']['Tables']['test_attempts']['Insert'];

export const testsApi = {
  async getTests(filters: { 
    type?: 'technical' | 'aptitude' | 'domain_specific' | 'ai_interview'; 
    isPublic?: boolean 
  } = {}) {
    let query = supabase
      .from('tests')
      .select(`
        *,
        profiles!tests_creator_id_fkey(full_name),
        test_attempts(count)
      `)
      .order('created_at', { ascending: false });

    if (filters.type) {
      query = query.eq('test_type', filters.type);
    }
    
    if (filters.isPublic !== undefined) {
      query = query.eq('is_public', filters.isPublic);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createTest(test: TestInsert) {
    const { data, error } = await supabase
      .from('tests')
      .insert(test)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTestById(id: string) {
    const { data, error } = await supabase
      .from('tests')
      .select(`
        *,
        profiles!tests_creator_id_fkey(full_name),
        test_attempts(
          id,
          score,
          percentage,
          completed_at,
          profiles!test_attempts_user_id_fkey(full_name, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async startTest(testAttempt: TestAttemptInsert) {
    const { data, error } = await supabase
      .from('test_attempts')
      .insert(testAttempt)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitTest(attemptId: string, answers: Record<string, any>, score: number, percentage: number) {
    const { data, error } = await supabase
      .from('test_attempts')
      .update({
        answers,
        score,
        percentage,
        completed_at: new Date().toISOString()
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTestAttempts(userId: string) {
    const { data, error } = await supabase
      .from('test_attempts')
      .select(`
        *,
        tests(title, test_type, total_questions, passing_score)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
