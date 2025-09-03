import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Timer, RefreshCw } from 'lucide-react';
import { otpVerificationService } from '@/services/otpVerification';

interface OTPVerificationProps {
  email: string;
  type: 'email_verification' | 'password_reset';
  onVerificationSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  type,
  onVerificationSuccess,
  onCancel,
  title,
  description,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const defaultTitle = type === 'email_verification' ? 'Verify Your Email' : 'Reset Your Password';
  const defaultDescription =
    type === 'email_verification'
      ? "We've sent a verification code to your email address. Please enter it below."
      : "We've sent a password reset code to your email address. Please enter it below.";

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await otpVerificationService.verifyEmailOTP(email, otpString);

      if (response.success) {
        toast.success(response.message || 'Verification successful!');
        onVerificationSuccess();
      } else {
        toast.error(response.error || 'Verification failed');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await otpVerificationService.resendOTP(email, type);

      if (response.success) {
        toast.success('New verification code sent!');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.error || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-3 p-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {title || defaultTitle}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">{description || defaultDescription}</p>
            <p className="text-xs text-gray-500 mt-1">
              Sent to: <span className="font-medium">{email}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInputChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </Button>

          {/* Resend Section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>

            {!canResend ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Timer className="w-4 h-4" />
                <span>Resend in {countdown}s</span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {resendLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  'Resend Code'
                )}
              </Button>
            )}
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
          )}

          {/* Help Text */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>The verification code will expire in 10 minutes.</p>
            <p>Check your spam folder if you don't see the email.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
