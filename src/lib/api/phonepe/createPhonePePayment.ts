import { phonepeApi } from '../phonepe';

/**
 * Initiates a PhonePe payment for a digital product.
 * 
 * @param data - Payment and user details
 * @returns Redirect URL to PhonePe PayPage
 */
export async function createPhonePePayment(data: {
  amount: number;
  productId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  downloadLink: string;
}): Promise<string> {
  try {
    console.log('🚀 Initiating PhonePe payment for:', data.productId);

    const result = await phonepeApi.createPayment(data);

    if (!result || !result.url) {
      throw new Error('No payment URL returned from backend.');
    }

    console.log('✅ PhonePe redirect URL received:', result.url);
    return result.url;

  } catch (error: any) {
    console.error('❌ PhonePe payment error:', error?.message || error);
    throw new Error(error?.message || 'PhonePe payment initiation failed');
  }
}

{/*
import { phonepeApi } from '../phonepe';

export async function createPhonePePayment(data: {
  amount: number;
  productId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  downloadLink: string;
}) {
  try {
    console.log('🚀 Starting payment process for product:', data.productId);
    
    const result = await phonepeApi.createPayment(data);
    
    if (result.url) {
      console.log('✅ Payment URL received:', result.url);
      return result.url;
    } else {
      throw new Error('No payment URL received');
    }
  } catch (error: any) {
    console.error('❌ PhonePe payment error:', error.message);
    throw new Error(error.message || 'Payment failed');
  }
}
*/}
