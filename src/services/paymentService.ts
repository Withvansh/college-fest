import api from '../lib/utils/axios';

export interface PaymentData {
  paymentUrl: string;
  orderId: string;
  amount: number;
  productName?: string;
  planName?: string;
}

export interface PaymentStatus {
  orderId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  isCompleted: boolean;
  amount: number;
  currency: string;
  paymentMode?: string;
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: {
    product_type: 'DIGITAL_PRODUCT' | 'SUBSCRIPTION' | 'SERVICE';
    product_name?: string;
    plan_name?: string;
  };
}

export interface PaymentHistory {
  payments: PaymentStatus[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

class PaymentService {
  /**
   * Create payment for digital product
   */
  async createDigitalProductPayment(
    productId: string,
    redirectUrl?: string
  ): Promise<PaymentData> {
    try {
      const response = await api.post('/payments/digital-product', {
        productId,
        redirectUrl: redirectUrl || `${window.location.origin}/products`
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Payment creation failed');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to create payment'
      );
    }
  }

  /**
   * Create payment for subscription plan
   */
  async createSubscriptionPayment(
    planName: string,
    amount: number,
    redirectUrl?: string
  ): Promise<PaymentData> {
    try {
      const response = await api.post('/payments/subscription', {
        planName,
        amount,
        redirectUrl: redirectUrl || `${window.location.origin}/products`
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Subscription payment creation failed');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to create subscription payment'
      );
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await api.get(`/payments/status/${orderId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to get payment status');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get payment status'
      );
    }
  }

  /**
   * Verify payment (for frontend polling)
   */
  async verifyPayment(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await api.post(`/payments/verify/${orderId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Payment verification failed');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to verify payment'
      );
    }
  }

  /**
   * Get user payment history
   */
  async getPaymentHistory(page: number = 1, limit: number = 10): Promise<PaymentHistory> {
    try {
      const response = await api.get(`/payments/history?page=${page}&limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to get payment history');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get payment history'
      );
    }
  }

  /**
   * Open payment gateway
   */
  openPaymentGateway(paymentUrl: string): void {
    window.open(paymentUrl, '_self');
  }

  /**
   * Poll payment status until completion or timeout
   */
  async pollPaymentStatus(
    orderId: string,
    onStatusUpdate: (status: PaymentStatus) => void,
    maxAttempts: number = 30,
    interval: number = 3000
  ): Promise<PaymentStatus> {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const status = await this.verifyPayment(orderId);
          onStatusUpdate(status);

          if (status.isCompleted || status.status === 'FAILED' || status.status === 'CANCELLED') {
            resolve(status);
            return;
          }

          if (attempts >= maxAttempts) {
            reject(new Error('Payment verification timeout'));
            return;
          }

          setTimeout(poll, interval);
        } catch (error) {
          if (attempts >= maxAttempts) {
            reject(error);
          } else {
            setTimeout(poll, interval);
          }
        }
      };

      poll();
    });
  }
}

export const paymentService = new PaymentService();
