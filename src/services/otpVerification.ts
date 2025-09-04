// OTP Verification Service
interface OTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

class OTPVerificationService {
  private readonly BASE_URL = 'http://localhost:3000/api/otp';

  async sendEmailVerificationOTP(email: string): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/send-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to send OTP',
          error: data.message,
        };
      }

      return {
        success: true,
        message: data.message || 'OTP sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyEmailOTP(email: string, otp: string): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to verify OTP',
          error: data.message,
        };
      }

      return {
        success: true,
        message: data.message || 'Email verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async resendOTP(email: string, type: 'email_verification' | 'password_reset'): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to resend OTP',
          error: data.message,
        };
      }

      return {
        success: true,
        message: data.message || 'OTP resent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendPasswordResetOTP(email: string): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/send-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to send password reset OTP',
          error: data.message,
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset OTP sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to reset password',
          error: data.message,
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const otpVerificationService = new OTPVerificationService();
export type { OTPResponse };
