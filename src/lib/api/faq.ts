
import { supabase } from "@/integrations/supabase/client";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

export const faqApi = {
  async getAllFaqs(): Promise<FaqItem[]> {
    // Since the faqs table doesn't exist in the schema, let's use mock data for now
    const mockFaqs: FaqItem[] = [
      {
        id: "1",
        question: "How do I create an account?",
        answer: "Click on the 'Sign Up' button and fill out the registration form with your details.",
        created_at: new Date().toISOString()
      },
      {
        id: "2", 
        question: "How do I post a job?",
        answer: "After logging in as a recruiter, go to your dashboard and click 'Post Job'. Fill out the job details and submit.",
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        question: "How do I apply for jobs?",
        answer: "Browse available jobs and click 'Apply' on any job that interests you. Make sure your profile is complete.",
        created_at: new Date().toISOString()
      }
    ];
    
    return mockFaqs;
  }
};
