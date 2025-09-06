import axiosInstance from '../lib/utils/axios';

export interface OTPResponse {
  success: boolean;
  message: string;
  email?: string;
  error?: string;
}

export class OTPService {
  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<OTPResponse> {
    try {
      let response;
      
      if (method === 'GET') {
        response = await axiosInstance.get(`/otp${endpoint}`);
      } else if (method === 'POST') {
        response = await axiosInstance.post(`/otp${endpoint}`, body);
      } else if (method === 'PUT') {
        response = await axiosInstance.put(`/otp${endpoint}`, body);
      } else if (method === 'DELETE') {
        response = await axiosInstance.delete(`/api/otp${endpoint}`);
      }

      return {
        success: true,
        message: response?.data.message,
        email: response?.data.email
      };
    } catch (error: any) {
      console.error('OTP Service Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error. Please try again.',
        error: error.response?.data?.message || error.message || 'Network error'
      };
    }
  }

  // Send email verification OTP
  async sendEmailVerificationOTP(email: string): Promise<void> {
    const response = await this.makeRequest('/send-email-verification', 'POST', { email });
    if (!response.success) {
      throw new Error(response.message || 'Failed to send OTP');
    }
  }

  // Verify email OTP
  async verifyEmailOTP(email: string, otp: string): Promise<void> {
    const response = await this.makeRequest('/verify-email', 'POST', { email, otp });
    if (!response.success) {
      throw new Error(response.message || 'Failed to verify OTP');
    }
  }

  // Send password reset OTP
  async sendPasswordResetOTP(email: string): Promise<OTPResponse> {
    return this.makeRequest('/send-password-reset', 'POST', { email });
  }

  // Reset password with OTP
  async resetPasswordWithOTP(email: string, otp: string, newPassword: string): Promise<OTPResponse> {
    return this.makeRequest('/reset-password', 'POST', { email, otp, newPassword });
  }

  // Resend OTP
  async resendOTP(email: string, type: 'email_verification' | 'password_reset'): Promise<OTPResponse> {
    return this.makeRequest('/resend', 'POST', { email, type });
  }

  // Get OTP status (for debugging)
  async getOTPStatus(email: string, type: 'email_verification' | 'password_reset'): Promise<OTPResponse> {
    return this.makeRequest(`/status?email=${encodeURIComponent(email)}&type=${type}`, 'GET');
  }
}

export const otpService = new OTPService();
