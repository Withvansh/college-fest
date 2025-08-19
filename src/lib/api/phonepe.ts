
// PhonePe API integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://www.minutehire.com";

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
    console.log('📤 Sending payment request to:', `${API_BASE_URL}/api/phonepe/create-payment`);
    console.log('📤 Payment data:', paymentData);

    const response = await fetch(`${API_BASE_URL}/api/phonepe/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Payment API error:', errorText);
      throw new Error(`Payment failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📥 Payment response:', result);
    return result;
  },

  verifyPayment: async (verificationData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> => {
    console.log('📤 Verifying payment:', verificationData);

    const response = await fetch(`${API_BASE_URL}/api/phonepe/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Payment verification error:', errorText);
      throw new Error(`Payment verification failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📥 Payment verification response:', result);
    return result;
  },
};
