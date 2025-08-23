import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface LocalAuthFormProps {
  userType: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const LocalAuthForm = ({ userType, title, description, icon }: LocalAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Function to get redirect path based on user type
  const getRedirectPath = (userType: string): string => {
    switch (userType) {
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'jobseeker':
        return '/jobseeker/dashboard';
      case 'freelancer':
        return '/freelancer/dashboard';
      case 'client':
        return '/client/dashboard';
      case 'college':
        return '/college/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  const handleFillCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success('Demo credentials filled! Click login to continue.');
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login for:', email.trim(), 'as', userType);
      await login(email.trim(), password.trim());
      // Redirect will be handled by useEffect when auth state changes
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupabaseSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(
        email.trim(),
        password.trim(),
        name.trim(),
        userType as 'jobseeker' | 'recruiter' | 'freelancer' | 'client' | 'college' | 'student'
      );
      if (success) {
        setActiveTab('login');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting demo login for:', email.trim(), 'as', userType);
      await login(email.trim(), password.trim());

      // For demo login, redirect immediately since local auth doesn't have async return
      console.log('Demo login successful, redirecting to:', getRedirectPath(userType));
      setTimeout(() => {
        navigate(getRedirectPath(userType));
      }, 100);
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get demo credentials for this user type
  const getDemoCredentials = () => {
    const roleMap: Record<string, string> = {
      jobseeker: 'demo.candidate@minutehire.com',
      recruiter: 'demo.hr@minutehire.com',
      freelancer: 'demo.freelancer@minutehire.com',
      client: 'demo.client@minutehire.com',
      student: 'demo.student@minutehire.com',
      college: 'demo.college@minutehire.com',
      admin: 'demo.admin@minutehire.com',
    };

    const passwordMap: Record<string, string> = {
      jobseeker: '#Candidate123',
      recruiter: '#HRaccess123',
      freelancer: '#Freelance123',
      client: '#Client123',
      student: '#Student123',
      college: '#College123',
      admin: '#Admin123',
    };

    return {
      email: roleMap[userType] || '',
      password: passwordMap[userType] || '',
    };
  };

  const demoCredentials = getDemoCredentials();

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="demo">Demo</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSupabaseLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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

              {/* {userType === 'recruiter' && (
                <div className="text-center text-sm text-gray-600">
                  <p>After Google sign-in, you'll be able to post jobs immediately!</p>
                </div>
              )} */}
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSupabaseSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
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

                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4">
              <form onSubmit={handleDemoLogin} className="space-y-4">
                <div>
                  <Label htmlFor="demo-email">Email</Label>
                  <Input
                    id="demo-email"
                    type="email"
                    placeholder="Enter demo email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="demo-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="demo-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter demo password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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
                  {isLoading ? 'Logging in...' : 'Demo Login'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Demo Credentials Auto-fill - Only show in demo tab */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    Quick Demo Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left border-blue-300 hover:bg-blue-100"
                    onClick={() =>
                      handleFillCredentials(demoCredentials.email, demoCredentials.password)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {icon}
                      <div>
                        <div className="font-medium">Use Demo Account</div>
                        <div className="text-xs text-gray-600">{demoCredentials.email}</div>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Show credentials for easy copying */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <code className="bg-white px-2 py-1 rounded">{demoCredentials.email}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Password:</span>
                    <code className="bg-white px-2 py-1 rounded">{demoCredentials.password}</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalAuthForm;
