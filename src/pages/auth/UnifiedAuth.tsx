import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, unifiedAuthService } from '@/services/unifiedAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, User, Briefcase, Code, Building2, GraduationCap, School } from 'lucide-react';

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
  },
  {
    id: 'client' as UserRole,
    label: 'Client',
    icon: Building2,
    color: 'from-blue-500 to-green-600',
    description: 'Hire freelancers',
  },
  {
    id: 'student' as UserRole,
    label: 'Student',
    icon: GraduationCap,
    color: 'from-indigo-500 to-cyan-600',
    description: 'Campus opportunities',
  },
  {
    id: 'college' as UserRole,
    label: 'College',
    icon: School,
    color: 'from-emerald-500 to-teal-600',
    description: 'Manage placements',
  },
];

const UnifiedAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<UserRole>('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const { login, signup, demoLogin, isAuthenticated, getDemoCredentials } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle URL parameters
  useEffect(() => {
    const typeFromUrl = searchParams.get('type') || window.location.pathname.split('/').pop();
    if (typeFromUrl && unifiedAuthService.isValidRole(typeFromUrl)) {
      setSelectedUserType(typeFromUrl);
    }

    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['login', 'signup', 'demo'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const selectedType = userTypes.find(type => type.id === selectedUserType)!;
  const IconComponent = selectedType.icon;

  const handleUserTypeChange = (userType: UserRole) => {
    setSelectedUserType(userType);
    navigate(`/auth/${userType}`, { replace: true });
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
    if (!email.trim() || !password.trim() || !name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email.trim(), password.trim(), name.trim(), selectedUserType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await demoLogin(selectedUserType);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    const demo = getDemoCredentials(selectedUserType);
    setEmail(demo.email);
    setPassword(demo.password);
    setActiveTab('demo');
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 overflow-hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* User Type Selection */}
          <div className="space-y-6 animate-slide-in-left">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to MinuteHire</h1>
              <p className="text-gray-600">Choose your role to get started</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {userTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleUserTypeChange(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedUserType === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-2 mx-auto shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth Form */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-slide-in-right">
            <CardHeader className="text-center pb-4">
              <div
                className={`mx-auto w-16 h-16 bg-gradient-to-r ${selectedType.color} rounded-full flex items-center justify-center shadow-lg mb-4 transition-all duration-300`}
              >
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300">
                {selectedType.label} Portal
              </h2>
              <p className="text-gray-600 transition-all duration-300">
                {selectedType.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="demo">Demo</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-11"
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
                          onChange={e => setPassword(e.target.value)}
                          className="h-11 pr-10"
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
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={fillDemoCredentials}
                    className="w-full text-sm text-blue-600 hover:text-blue-700"
                  >
                    Try demo account
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="h-11"
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
                        className="h-11"
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
                          className="h-11 pr-10"
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

                    {/* Role Selection Display */}
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <Label className="text-sm font-medium text-gray-700">Selected Role</Label>
                      <div className="flex items-center mt-1">
                        <div
                          className={`w-6 h-6 rounded bg-gradient-to-r ${selectedType.color} flex items-center justify-center mr-2`}
                        >
                          <IconComponent className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">{selectedType.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Change role using the selection above
                      </p>
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : `Create ${selectedType.label} Account`}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="demo" className="space-y-4 mt-6">
                  <form onSubmit={handleDemoLogin} className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-900 mb-2">Demo Account</h3>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>Email: {getDemoCredentials(selectedUserType).email}</div>
                        <div>Password: {getDemoCredentials(selectedUserType).password}</div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login with Demo Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuth;
