import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import axios from '@/lib/utils/axios';
import {
  User,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  DollarSign,
  Star,
  Eye,
  Plus,
  Edit,
  BarChart3,
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Info,
} from 'lucide-react';

interface StartupData {
  _id: string;
  full_name: string;
  email: string;
  startup_name: string;
  founder_name?: string;
  industry?: string;
  website?: string;
  location?: string;
  phone?: string;
  description?: string;
  funding_stage?: string;
  employees_count?: number;
  logo_url?: string;
  hiring?: boolean;
}

interface JobOpening {
  _id: string;
  title: string;
  location: string;
  type: string;
  salary?: string;
  applications_count: number;
  status: string;
  created_at: string;
}

interface Application {
  _id: string;
  candidate_name: string;
  job_title: string;
  status: string;
  applied_at: string;
  candidate_email: string;
}

interface StartupStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  hired_candidates: number;
  interviews_scheduled: number;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
}

const StartupDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [startupData, setStartupData] = useState<StartupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);

        // Load startup data only
        const startupRes = await axios.get(`/startups/dashboard/${user._id}`);
        console.log(startupRes.data.data.startup)
        setStartupData(startupRes.data.data.startup);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      loadDashboardData();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your startup dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Responsive Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png"
                  alt="MinuteHire Logo"
                  className="h-8 w-auto"
                />
                <span className="hidden sm:block text-lg font-bold text-gray-800">MinuteHire</span>
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hidden sm:inline-flex">
                Startup Dashboard
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/startup/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
            <Button
  variant="outline"
  size="sm"
  onClick={() => {
    localStorage.clear();
    navigate("/auth?tab=login");
  }}
>
  <Users className="h-4 w-4 mr-2" />
  Login as Recruiter
</Button>

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 mb-3">
                Startup Dashboard
              </Badge>
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <Link to="/startup/profile" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Feature Access Notice */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Limited Access - Startup Account
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Only recruiters can access all features including job posting, job management, and HRMS. 
                    As a startup, you can update your company details and hiring status.
                  </p>
                  <p className="text-xs text-blue-600">
                    Want full access? Login as Recruiter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {startupData?.logo_url ? (
              <img
                src={startupData.logo_url}
                alt="Startup Logo"
                className="h-16 w-16 rounded-full border-4 border-white shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                Welcome back, {startupData?.startup_name || 'Startup'}! 👋
              </h1>
              <div className="text-sm sm:text-lg text-gray-600 space-y-1 sm:space-y-0">
                <p className="truncate">
                  {startupData?.founder_name && `Founded by ${startupData.founder_name}`}
                </p>
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  {startupData?.industry && (
                    <Badge variant="outline" className="text-xs">{startupData.industry}</Badge>
                  )}
                  {startupData?.funding_stage && (
                    <Badge variant="outline" className="text-xs">{startupData.funding_stage}</Badge>
                  )}
                  {startupData?.hiring !== undefined && (
                    <Badge 
                      variant={startupData.hiring ? "default" : "secondary"}
                      className={`text-xs ${startupData.hiring ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {startupData.hiring ? '🟢 Hiring' : '🔴 Not Hiring'}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Disabled for Startup */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 opacity-50">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-600">Total Jobs</CardTitle>
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-700">0</div>
              <p className="text-xs text-blue-600">0 active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-600">Applications</CardTitle>
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-700">0</div>
              <p className="text-xs text-green-600">0 pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-orange-600">Interviews</CardTitle>
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-700">0</div>
              <p className="text-xs text-orange-600">scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-purple-600">Hired</CardTitle>
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-purple-700">0</div>
              <p className="text-xs text-purple-600">candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Update Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Job Openings - Disabled */}
              <Card className="opacity-50">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg">Recent Job Openings</CardTitle>
                    <Button variant="outline" size="sm" className="bg-slate-50 text-xs sm:text-sm" disabled>
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Only Recruiter can Post Jobs</span>
                      <span className="sm:hidden">Recruiter Only</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48 sm:h-64">
                    <div className="space-y-3">
                      <div className="text-center py-8">
                        <Briefcase className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No job openings</h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4">
                          Switch to recruiter role to post jobs and manage applications.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Company Name</p>
                      <p className="font-medium text-sm sm:text-base truncate">{startupData?.startup_name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Founder</p>
                      <p className="font-medium text-sm sm:text-base truncate">{startupData?.founder_name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Industry</p>
                      <p className="font-medium text-sm sm:text-base truncate">{startupData?.industry || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Funding Stage</p>
                      <p className="font-medium text-sm sm:text-base truncate">{startupData?.funding_stage || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Team Size</p>
                      <p className="font-medium text-sm sm:text-base">
                        {startupData?.employees_count || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Hiring Status</p>
                      <Badge 
                        variant={startupData?.hiring ? "default" : "secondary"}
                        className={`text-xs mt-1 ${startupData?.hiring ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {startupData?.hiring ? '🟢 Currently Hiring' : '🔴 Not Hiring'}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 text-xs sm:text-sm"
                    onClick={() => navigate('/startup/profile')}
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Update Profile & Hiring Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Update Your Profile</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage your company information, profile details, and hiring status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Use this section to update your company profile information and hiring status. 
                    All changes will be reflected across the platform.
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">What you can update:</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                      <li>Company information and details</li>
                      <li>Hiring status (Currently Hiring / Not Hiring)</li>
                      <li>Contact information and website</li>
                      <li>Company logo and description</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => navigate('/startup/profile')}
                    className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Edit Profile & Hiring Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupDashboard;