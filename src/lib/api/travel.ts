
import { supabase } from "@/integrations/supabase/client";

export interface TravelAllowance {
  id: string;
  employee_id: string;
  purpose: string;
  destination: string;
  start_date: string;
  end_date: string;
  advance_amount: number;
  claimed_amount: number;
  approved_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  receipts: string[];
  approver_id?: string;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const travelApi = {
  async getTravelAllowances() {
    // Temporarily disabled until Supabase types are updated
    console.log('Travel API temporarily disabled until types update');
    return [];
  },

  async createTravelAllowance(allowance: Omit<TravelAllowance, 'id' | 'created_at' | 'updated_at'>) {
    // Temporarily disabled until Supabase types are updated
    console.log('Travel API temporarily disabled until types update');
    return null;
  },

  async updateTravelAllowance(id: string, updates: Partial<TravelAllowance>) {
    // Temporarily disabled until Supabase types are updated
    console.log('Travel API temporarily disabled until types update');
    return null;
  },

  async approveTravelAllowance(id: string, approvedAmount: number) {
    // Temporarily disabled until Supabase types are updated
    console.log('Travel API temporarily disabled until types update');
    return null;
  },

  async rejectTravelAllowance(id: string) {
    // Temporarily disabled until Supabase types are updated
    console.log('Travel API temporarily disabled until types update');
    return null;
  }
};
