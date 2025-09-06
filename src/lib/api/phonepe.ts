
import axiosInstance from '../utils/axios';

// PhonePe API integration
export interface PaymentRequest {
  amount: number;
  productId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  downloadLink: string;
}

export interface PaymentResponse {
  url: string;
}

export interface PaymentVerificationRequest {
  transactionId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  productId: string;
  downloadLink: string;
  amount: number;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}

export const phonepeApi = {
  createPayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    console.log('📤 Sending payment request to: /api/phonepe/create-payment');
    console.log('📤 Payment data:', paymentData);

    try {
      const response = await axiosInstance.post('/phonepe/create-payment', paymentData);
      console.log('📥 Payment response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Payment API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Payment failed');
    }
  },

  verifyPayment: async (verificationData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> => {
    console.log('📤 Verifying payment:', verificationData);

    try {
      const response = await axiosInstance.post('/phonepe/verify-payment', verificationData);
      console.log('📥 Payment verification response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Payment verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Payment verification failed');
    }
  },
};
