
import { supabase } from "@/integrations/supabase/client";

export interface DigitalOrder {
  id: string;
  product_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  purchase_date: string;
  amount_paid: number;
  payment_status: string;
  download_link?: string;
  order_status: string;
}

export const ordersApi = {
  async createOrder(orderData: Omit<DigitalOrder, 'id' | 'purchase_date'>): Promise<DigitalOrder | null> {
    const { data, error } = await supabase
      .from('digital_orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data;
  },

  async getOrder(id: string): Promise<DigitalOrder | null> {
    const { data, error } = await supabase
      .from('digital_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  },

  async getAllOrders(): Promise<DigitalOrder[]> {
    const { data, error } = await supabase
      .from('digital_orders')
      .select('*')
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }
};
