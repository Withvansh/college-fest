// OTP Verification Service
import axiosInstance from '../lib/utils/axios';

interface OTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

class OTPVerificationService {

  async sendEmailVerificationOTP(email: string): Promise<OTPResponse> {
    try {
      const response = await axiosInstance.post('/otp/send-email-verification', { email });
      
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async verifyEmailOTP(email: string, otp: string): Promise<OTPResponse> {
    try {
      const response = await axiosInstance.post('/api/otp/verify-email', { email, otp });
      
      return {
        success: true,
        message: response.data.message || 'Email verified successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify OTP',
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async resendOTP(email: string, type: 'email_verification' | 'password_reset'): Promise<OTPResponse> {
    try {
      const response = await axiosInstance.post('/api/otp/resend', { email, type });
      
      return {
        success: true,
        message: response.data.message || 'OTP resent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend OTP',
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async sendPasswordResetOTP(email: string): Promise<OTPResponse> {
    try {
      const response = await axiosInstance.post('/api/otp/send-password-reset', { email });
      
      return {
        success: true,
        message: response.data.message || 'Password reset OTP sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send password reset OTP',
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<OTPResponse> {
    try {
      const response = await axiosInstance.post('/api/otp/reset-password', { email, otp, newPassword });
      
      return {
        success: true,
        message: response.data.message || 'Password reset successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password',
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

export const otpVerificationService = new OTPVerificationService();
export type { OTPResponse };
