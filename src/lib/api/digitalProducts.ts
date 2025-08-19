
import { supabase } from '@/integrations/supabase/client';

export interface DigitalProduct {
  id: string;
  title: string;
  short_description: string;
  benefits: string[];
  price: number;
  category: string;
  thumbnail_url: string;
  product_file_url: string;
  file_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DigitalOrder {
  id: string;
  product_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  amount_paid: number;
  payment_status: string;
  order_status: string;
  download_link: string;
  purchase_date: string;
  digital_products: {
    title: string;
    category: string;
  };
}

export const digitalProductsApi = {
  async getProducts(): Promise<DigitalProduct[]> {
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching digital products:', error);
      return [];
    }

    return data || [];
  },

  async getProduct(id: string): Promise<DigitalProduct | null> {
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching digital product:', error);
      return null;
    }

    return data;
  },

  async createProduct(productData: Omit<DigitalProduct, 'id' | 'created_at' | 'updated_at'>): Promise<DigitalProduct | null> {
    const { data, error } = await supabase
      .from('digital_products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating digital product:', error);
      return null;
    }

    return data;
  },

  async updateProduct(id: string, updates: Partial<DigitalProduct>): Promise<DigitalProduct | null> {
    const { data, error } = await supabase
      .from('digital_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating digital product:', error);
      return null;
    }

    return data;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('digital_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting digital product:', error);
      return false;
    }

    return true;
  },

  async createOrder(orderData: Omit<DigitalOrder, 'id' | 'digital_products'>): Promise<DigitalOrder | null> {
    const { data, error } = await supabase
      .from('digital_orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating digital order:', error);
      return null;
    }

    // Add digital_products info for return
    const orderWithProduct = {
      ...data,
      digital_products: {
        title: 'Product',
        category: 'Category'
      }
    };

    return orderWithProduct;
  },

  async getOrders(): Promise<DigitalOrder[]> {
    const { data, error } = await supabase
      .from('digital_orders')
      .select(`
        *,
        digital_products!digital_orders_product_id_fkey (
          title,
          category
        )
      `)
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Error fetching digital orders:', error);
      return [];
    }

    // Transform data to match DigitalOrder interface
    const transformedOrders: DigitalOrder[] = (data || []).map(order => ({
      id: order.id,
      product_id: order.product_id,
      buyer_name: order.buyer_name,
      buyer_email: order.buyer_email,
      buyer_phone: order.buyer_phone,
      amount_paid: order.amount_paid,
      payment_status: order.payment_status,
      order_status: order.order_status,
      download_link: order.download_link,
      purchase_date: order.purchase_date,
      digital_products: {
        title: order.digital_products?.title || 'Unknown Product',
        category: order.digital_products?.category || 'Unknown Category'
      }
    }));

    return transformedOrders;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('digital_orders')
      .update({ order_status: status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('digital_products')
      .select('category')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories;
  }
};
