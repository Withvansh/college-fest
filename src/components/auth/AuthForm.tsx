import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Chrome, Linkedin } from 'lucide-react';
import DemoCredentials from './DemoCredentials';

interface AuthFormProps {
  userType: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AuthForm = ({ userType, title, description, icon }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const { login, signup, signInWithGoogle, signInWithLinkedIn, signInWithOTP, verifyOTP, forgotPassword } = useAuth();

  const handleFillCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveTab('login');
    toast.success('Demo credentials filled! Click login to continue.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password.trim(), userType);
      if (!success) {
        // Error is handled in the login function
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(email.trim(), password.trim(), name.trim(), userType);
      if (success) {
        setActiveTab('login');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(userType);
    } catch (error) {
      toast.error('Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithLinkedIn(userType);
    } catch (error) {
      toast.error('LinkedIn sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signInWithOTP(otpEmail.trim(), userType);
      if (success) {
        setIsOtpSent(true);
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyOTP(otpEmail, otpCode.trim(), userType);
      if (success) {
        setIsOtpSent(false);
        setOtpCode('');
        setOtpEmail('');
      }
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const success = await forgotPassword(forgotPasswordEmail.trim());
      if (success) {
        setActiveTab('login');
        setForgotPasswordEmail('');
      }
    } catch (error) {
      toast.error('Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="h-12"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLinkedInSignIn}
                  disabled={isLoading}
                  className="h-12"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4">
              {!isOtpSent ? (
                <form onSubmit={handleOTPSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      placeholder="Enter your email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    <Mail className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Login Code'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOTPVerify} className="space-y-4">
                  <div>
                    <Label htmlFor="otp-code">Verification Code</Label>
                    <Input
                      id="otp-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="h-12"
                      maxLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOtpSent(false)}
                    className="w-full"
                  >
                    Use different email
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="forgot" className="space-y-4">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Demo Credentials Component */}
      <DemoCredentials userType={userType} onFillCredentials={handleFillCredentials} />
    </div>
  );
};

export default AuthForm;
