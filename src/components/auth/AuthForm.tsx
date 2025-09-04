import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import OTPVerification from './OTPVerification';

interface AuthFormProps {
  userType: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AuthForm = ({ userType, title, description, icon }: AuthFormProps) => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const role = params.role || searchParams.get('type');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFull_Name] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password.trim());

      if (result.requiresEmailVerification) {
        setVerificationEmail(result.email || email.trim());
        setShowEmailVerification(true);
        toast.info('Please verify your email to continue');
      } else if (!result.success) {
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
    console.log('handleSignup called', email);
    if (!email.trim() || !password.trim() || !full_name.trim() || !role?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup(
        email.trim(),
        password.trim(),
        full_name.trim(),
        role.trim() as 'jobseeker' | 'recruiter' | 'freelancer' | 'client' | 'college' | 'Student'
      );

      if (result.success) {
        if (result.requiresEmailVerification) {
          setVerificationEmail(result.email || email.trim());
          setShowEmailVerification(true);
        } else {
          setActiveTab('login');
          // Clear form
          setEmail('');
          setPassword('');
          setFull_Name('');
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    setActiveTab('login');
    setEmail('');
    setPassword('');
    setFull_Name('');
    toast.success('Email verified successfully! You can now log in.');
  };

  const handleCancelEmailVerification = () => {
    setShowEmailVerification(false);
    setVerificationEmail('');
  };

  // Show email verification screen if needed
  if (showEmailVerification) {
    return (
      <OTPVerification
        email={verificationEmail}
        type="email_verification"
        onVerificationSuccess={handleEmailVerificationSuccess}
        onCancel={handleCancelEmailVerification}
        title="Verify Your Email"
        description="We've sent a verification code to your email address. Please enter it below to complete your registration."
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-3 p-4">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="text-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-3">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
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
                      className="h-10 pr-10"
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

                <Button type="submit" className="w-full h-10" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={full_name}
                    onChange={e => setFull_Name(e.target.value)}
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
                    onChange={e => setEmail(e.target.value)}
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
                      onChange={e => setPassword(e.target.value)}
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

                <Button
                  type="submit"
                  className="w-full h-12"
                  onClick={e => {
                    console.log('Button clicked');
                    // Don't prevent default here, let form handle it
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Demo Credentials with reduced spacing */}
      {/* <div className="mt-4">
        <DemoCredentials userType={userType} onFillCredentials={handleFillCredentials} />
      </div> */}
    </div>
  );
};

export default AuthForm;
