const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface OTPResponse {
  success: boolean;
  message: string;
  email?: string;
  error?: string;
}

export class OTPService {
  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<OTPResponse> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}/api/otp${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          error: data.message || 'An error occurred'
        };
      }

      return {
        success: true,
        message: data.message,
        email: data.email
      };
    } catch (error) {
      console.error('OTP Service Error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: error instanceof Error ? error.message : 'Network error'
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
