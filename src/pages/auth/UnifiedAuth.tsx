import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, unifiedAuthService } from '@/services/unifiedAuth';
import { otpService } from '@/services/otpService';
import { toast } from 'sonner';
import {
  Eye,
  EyeOff,
  User,
  Briefcase,
  Code,
  Building2,
  School,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Mail,
  Shield,
  GraduationCap,
  Rocket,
} from 'lucide-react';

// Central toggle to enable/disable signup per role. Remove from set to enable later.
const DISABLED_SIGNUP_ROLES = new Set<UserRole>(['freelancer', 'client']);
const isRoleEnabled = (role: UserRole) => !DISABLED_SIGNUP_ROLES.has(role);

// Now includes student and startup roles for direct registration
const userTypes = [
  {
    id: 'jobseeker' as UserRole,
    label: 'Job Seeker',
    icon: User,
    color: 'from-blue-500 to-purple-600',
    description: 'Find your dream job',
  },
  {
    id: 'recruiter' as UserRole,
    label: 'Recruiter',
    icon: Briefcase,
    color: 'from-green-500 to-blue-600',
    description: 'Hire top talent',
  },
  {
    id: 'freelancer' as UserRole,
    label: 'Freelancer',
    icon: Code,
    color: 'from-purple-500 to-pink-600',
    description: 'Showcase your skills',
    comingSoon: !isRoleEnabled('freelancer' as UserRole),
  },
  {
    id: 'client' as UserRole,
    label: 'Client',
    icon: Building2,
    color: 'from-blue-500 to-green-600',
    description: 'Hire freelancers',
    comingSoon: !isRoleEnabled('client' as UserRole),
  },
  {
    id: 'college' as UserRole,
    label: 'College',
    icon: School,
    color: 'from-emerald-500 to-teal-600',
    description: 'Manage placements',
  },
  {
    id: 'student' as UserRole, // Fixed: Changed from 'Student' to 'student' to match discriminator key
    label: 'Student',
    icon: GraduationCap,
    color: 'from-indigo-500 to-purple-600',
    description: 'Access placement opportunities',
  },
  {
    id: 'startup' as UserRole,
    label: 'Startup',
    icon: Rocket,
    color: 'from-orange-500 to-red-600',
    description: 'Build your team',
  },
  {
    id: 'super_admin' as UserRole,
    label: 'Super Admin',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    description: 'Full system access',
  },
];

const UnifiedAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Multistep signup state
  const [signupStep, setSignupStep] = useState(1); // 1: role selection, 2: email verification, 3: form
  const [selectedSignupRole, setSelectedSignupRole] = useState<UserRole | null>(null);
  const [signupEmail, setSignupEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Forgot password state
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email input, 2: OTP verification, 3: new password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isForgotPasswordOtpSent, setIsForgotPasswordOtpSent] = useState(false);
  const [isForgotPasswordVerifyingOtp, setIsForgotPasswordVerifyingOtp] = useState(false);
  const [isForgotPasswordSendingOtp, setIsForgotPasswordSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Forgot password modal state
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const { login, signup, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle URL parameters
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['login', 'signup', 'forgot-password'].includes(tabFromUrl)) {
      if (tabFromUrl === 'forgot-password') {
        setIsForgotPasswordModalOpen(true);
        setForgotPasswordStep(1);
        setForgotPasswordEmail('');
        setForgotPasswordOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setIsForgotPasswordOtpSent(false);
      } else {
        setActiveTab(tabFromUrl);
        // Reset signup steps when switching tabs
        if (tabFromUrl === 'signup') {
          setSignupStep(1);
          setSelectedSignupRole(null);
          setSignupEmail('');
          setIsEmailVerified(false);
          setOtpValue('');
          setIsOtpSent(false);
        }
      }
    }
  }, [searchParams]);

  const handleSignupRoleSelect = (role: UserRole) => {
    if (!isRoleEnabled(role)) {
      const roleLabel = userTypes.find(t => t.id === role)?.label || 'This role';
      toast.info(`${roleLabel} signup is coming soon.`);
      return;
    }
    setSelectedSignupRole(role);
    setSignupStep(2);
  };

  const goBackToRoleSelection = () => {
    setSignupStep(1);
    setSelectedSignupRole(null);
    // Clear form data
    setName('');
    setEmail('');
    setPassword('');
    setSignupEmail('');
    setIsEmailVerified(false);
    setOtpValue('');
    setIsOtpSent(false);
  };

  const goBackToEmailVerification = () => {
    setSignupStep(2);
    // Clear form data but keep email verification
    setName('');
    setPassword('');
  };

  const handleSendOtp = async () => {
    if (!signupEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSendingOtp(true);
    try {
      await otpService.sendEmailVerificationOTP(signupEmail.trim());
      setIsOtpSent(true);
      toast.success('OTP sent to your email. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await otpService.verifyEmailOTP(signupEmail.trim(), otpValue.trim());
      setIsEmailVerified(true);
      setSignupStep(3);
      setEmail(signupEmail); // Set the verified email in the main form
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim() || !selectedSignupRole) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email.trim(), password.trim(), name.trim(), selectedSignupRole);
      toast.success('Signup successful! Please login with your credentials.');
      // Reset form and go to login
      setActiveTab('login');
      setSignupStep(1);
      setSelectedSignupRole(null);
      setName('');
      setEmail('');
      setPassword('');
      setSignupEmail('');
      setIsEmailVerified(false);
      setOtpValue('');
      setIsOtpSent(false);
      // Reset forgot password state
      setForgotPasswordStep(1);
      setForgotPasswordEmail('');
      setForgotPasswordOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setIsForgotPasswordOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleSendForgotPasswordOtp = async () => {
    if (!forgotPasswordEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsForgotPasswordSendingOtp(true);
    try {
      const response = await otpService.sendPasswordResetOTP(forgotPasswordEmail.trim());
      if (response.success) {
        setIsForgotPasswordOtpSent(true);
        setForgotPasswordStep(2);
        toast.success('Password reset OTP sent to your email. Please check your inbox.');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsForgotPasswordSendingOtp(false);
    }
  };

  const handleVerifyForgotPasswordOtp = async () => {
    if (!forgotPasswordOtp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsForgotPasswordVerifyingOtp(true);
    try {
      // For password reset, we don't verify the OTP here, we verify it during password reset
      setForgotPasswordStep(3);
      toast.success('OTP verified! Please enter your new password.');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsForgotPasswordVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await otpService.resetPasswordWithOTP(
        forgotPasswordEmail.trim(),
        forgotPasswordOtp.trim(),
        newPassword.trim()
      );

      if (response.success) {
        toast.success('Password reset successfully! Please login with your new password.');
        // Reset form and close modal
        setIsForgotPasswordModalOpen(false);
        setForgotPasswordStep(1);
        setForgotPasswordEmail('');
        setForgotPasswordOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setIsForgotPasswordOtpSent(false);
        setEmail(forgotPasswordEmail); // Pre-fill email in login form
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const goBackToLoginFromForgotPassword = () => {
    setIsForgotPasswordModalOpen(false);
    setForgotPasswordStep(1);
    setForgotPasswordEmail('');
    setForgotPasswordOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setIsForgotPasswordOtpSent(false);
  };

  const goBackToForgotPasswordEmail = () => {
    setForgotPasswordStep(1);
    setForgotPasswordOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const goBackToForgotPasswordOtp = () => {
    setForgotPasswordStep(2);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Auth Section (60% on desktop, full width on mobile) */}
      <div className="w-full lg:w-[50%] bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl">
          <Card className=" border-0 ">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-3 sm:mb-4">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Welcome to MinuteHire
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Your gateway to career opportunities
              </p>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="text-sm">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4 mt-4 sm:mt-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Login to Your Account
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Enter your credentials to continue
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-10 sm:h-11 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-sm">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="h-10 sm:h-11 pr-10 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-10 sm:h-11 text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordModalOpen(true);
                        setForgotPasswordStep(1);
                        setForgotPasswordEmail('');
                        setForgotPasswordOtp('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setIsForgotPasswordOtpSent(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-4 mt-4 sm:mt-6">
                  {signupStep === 1 ? (
                    // Step 1: Role Selection
                    <div className="space-y-4 sm:space-y-6">
                      <div className="text-center">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                          Create Your Account
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          First, choose your role
                        </p>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        {userTypes
                          .filter(type => type.id !== 'super_admin') // Exclude super admin from signup
                          .map(type => {
                            const Icon = type.icon;
                            const disabled = !isRoleEnabled(type.id);
                            return (
                              <button
                                key={type.id}
                                onClick={() => handleSignupRoleSelect(type.id)}
                                disabled={disabled}
                                aria-disabled={disabled}
                                className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left group transition-all duration-200 ${
                                  disabled
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-70'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center shadow-sm`}
                                  >
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                      {type.label}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 truncate">
                                      {type.description}
                                    </div>
                                  </div>
                                  {disabled ? (
                                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 flex-shrink-0">
                                      Coming soon
                                    </span>
                                  ) : (
                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                      </div>

                      {/* <div className="text-center text-xs text-gray-500">
                        Students receive login credentials from their college
                      </div> */}
                    </div>
                  ) : signupStep === 2 ? (
                    // Step 2: Email Verification
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={goBackToRoleSelection}
                          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                        >
                          <ArrowLeft className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Verify Your Email
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600">
                            We'll send an OTP to verify your email address
                          </p>
                        </div>
                      </div>

                      {selectedSignupRole && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-green-800 truncate">
                              Selected Role:{' '}
                              {userTypes.find(t => t.id === selectedSignupRole)?.label}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="signup-email-verify" className="text-sm">
                            Email Address
                          </Label>
                          <Input
                            id="signup-email-verify"
                            type="email"
                            placeholder="Enter your email address"
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                            className="h-10 sm:h-11 text-sm"
                            disabled={isOtpSent}
                            required
                          />
                        </div>

                        {!isOtpSent ? (
                          <Button
                            onClick={handleSendOtp}
                            className="w-full h-10 sm:h-11 text-sm"
                            disabled={isSendingOtp || !signupEmail.trim()}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            {isSendingOtp ? 'Sending OTP...' : 'Send Verification Code'}
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-blue-800">
                                  OTP sent to <strong>{signupEmail}</strong>
                                </span>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="otp-input" className="text-sm">
                                Enter OTP
                              </Label>
                              <Input
                                id="otp-input"
                                type="text"
                                placeholder="Enter the 6-digit code"
                                value={otpValue}
                                onChange={e =>
                                  setOtpValue(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                                }
                                className="h-10 sm:h-11 text-sm text-center tracking-wider"
                                maxLength={6}
                                required
                              />
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                onClick={handleVerifyOtp}
                                className="flex-1 h-10 sm:h-11 text-sm"
                                disabled={isVerifyingOtp || otpValue.length !== 6}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                {isVerifyingOtp ? 'Verifying...' : 'Verify Code'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsOtpSent(false);
                                  setOtpValue('');
                                }}
                                className="h-10 sm:h-11 text-sm px-3"
                                disabled={isSendingOtp || isVerifyingOtp}
                              >
                                Change Email
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              onClick={handleSendOtp}
                              className="w-full h-10 sm:h-11 text-sm"
                              disabled={isSendingOtp}
                            >
                              {isSendingOtp ? 'Resending...' : 'Resend OTP'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Step 3: Registration Form
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={goBackToEmailVerification}
                          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                        >
                          <ArrowLeft className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Complete Registration
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600">Fill in your details</p>
                        </div>
                      </div>

                      {isEmailVerified && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-green-800 truncate">
                              Email verified: {signupEmail}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedSignupRole && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-blue-800 truncate">
                              Role: {userTypes.find(t => t.id === selectedSignupRole)?.label}
                            </span>
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-sm">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="h-10 sm:h-11 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-email" className="text-sm">
                            Email (Verified)
                          </Label>
                          <Input
                            id="signup-email"
                            type="email"
                            value={email}
                            className="h-10 sm:h-11 text-sm bg-gray-50"
                            disabled
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-password" className="text-sm">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password (min. 6 characters)"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className="h-10 sm:h-11 pr-10 text-sm"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-10 sm:h-11 text-sm"
                          disabled={isLoading || !isEmailVerified}
                        >
                          {isLoading
                            ? 'Creating Account...'
                            : `Create ${userTypes.find(t => t.id === selectedSignupRole)?.label} Account`}
                        </Button>
                      </form>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={isForgotPasswordModalOpen} onOpenChange={setIsForgotPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {forgotPasswordStep === 1 && 'Reset Your Password'}
              {forgotPasswordStep === 2 && 'Verify Code'}
              {forgotPasswordStep === 3 && 'Set New Password'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {forgotPasswordStep === 1 ? (
              // Step 1: Email Input
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Enter your email address to receive a password reset code
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="forgot-email-modal" className="text-sm">
                      Email Address
                    </Label>
                    <Input
                      id="forgot-email-modal"
                      type="email"
                      placeholder="Enter your email address"
                      value={forgotPasswordEmail}
                      onChange={e => setForgotPasswordEmail(e.target.value)}
                      className="h-10 sm:h-11 text-sm"
                      required
                    />
                  </div>

                  <Button
                    onClick={handleSendForgotPasswordOtp}
                    className="w-full h-10 sm:h-11 text-sm"
                    disabled={isForgotPasswordSendingOtp || !forgotPasswordEmail.trim()}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {isForgotPasswordSendingOtp ? 'Sending...' : 'Send Reset Code'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordModalOpen(false)}
                      className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            ) : forgotPasswordStep === 2 ? (
              // Step 2: OTP Verification
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={goBackToForgotPasswordEmail}
                    className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>
                </div>

                {forgotPasswordEmail && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-blue-800 truncate">
                        Code sent to: {forgotPasswordEmail}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="forgot-otp-modal" className="text-sm">
                      Verification Code
                    </Label>
                    <Input
                      id="forgot-otp-modal"
                      type="text"
                      placeholder="Enter the 6-digit code"
                      value={forgotPasswordOtp}
                      onChange={e =>
                        setForgotPasswordOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                      }
                      className="h-10 sm:h-11 text-sm text-center tracking-wider"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleVerifyForgotPasswordOtp}
                      className="flex-1 h-10 sm:h-11 text-sm"
                      disabled={isForgotPasswordVerifyingOtp || forgotPasswordOtp.length !== 6}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {isForgotPasswordVerifyingOtp ? 'Verifying...' : 'Verify Code'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={goBackToForgotPasswordEmail}
                      className="h-10 sm:h-11 text-sm px-3"
                      disabled={isForgotPasswordSendingOtp || isForgotPasswordVerifyingOtp}
                    >
                      Change Email
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={handleSendForgotPasswordOtp}
                    className="w-full h-10 sm:h-11 text-sm"
                    disabled={isForgotPasswordSendingOtp}
                  >
                    {isForgotPasswordSendingOtp ? 'Resending...' : 'Resend Code'}
                  </Button>
                </div>
              </div>
            ) : (
              // Step 3: New Password
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={goBackToForgotPasswordOtp}
                    className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">
                      Create a strong password for your account
                    </p>
                  </div>
                </div>

                {forgotPasswordEmail && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-green-800 truncate">
                        Email verified: {forgotPasswordEmail}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="new-password-modal" className="text-sm">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password-modal"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password (min. 6 characters)"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="h-10 sm:h-11 pr-10 text-sm"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password-modal" className="text-sm">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password-modal"
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="h-10 sm:h-11 text-sm"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-11 text-sm"
                    disabled={isResettingPassword || !newPassword.trim() || !confirmPassword.trim()}
                  >
                    {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Right Side - Video Section (40% on desktop, hidden on mobile/tablet) */}
      <div className="hidden lg:block lg:w-[50%] relative overflow-hidden">
        <div className="relative h-full">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            playsInline
            ref={el => {
              if (el) {
                el.muted = true; // Set initial muted state
              }
            }}
          >
            <source src="/Vertical_Video_Generation_Complete.mp4" type="video/mp4" />
          </video>

          <button
            onClick={e => {
              const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
              video.muted = !video.muted;
              e.currentTarget.classList.toggle('text-white');
              e.currentTarget.classList.toggle('text-green-500');
            }}
            className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors text-white"
            aria-label="Toggle audio"
          >
            {/* Show different icon based on muted state */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        </div>

        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Branding overlay */}
        {/* <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 text-white">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Experience MinuteHire</h3>
            <p className="text-sm opacity-90 mb-3 sm:mb-4">Connect with opportunities in minutes</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>Quick job applications</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>AI-powered matching</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>Real-time scheduling</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UnifiedAuth;
