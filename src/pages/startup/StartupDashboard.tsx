import { useState, useEffect } from 'react';
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
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<StartupStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?._id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load startup data
      const startupRes = await axios.get(`/startup/${user?._id}`);
      setStartupData(startupRes.data.startup);

      // Load dashboard stats
      const dashboardRes = await axios.get(`/startup/dashboard/${user?._id}`);
      const dashboardData = dashboardRes.data;

      setStats({
        total_jobs: dashboardData.total_jobs || 0,
        active_jobs: dashboardData.active_jobs || 0,
        total_applications: dashboardData.total_applications || 0,
        pending_applications: dashboardData.pending_applications || 0,
        hired_candidates: dashboardData.hired_candidates || 0,
        interviews_scheduled: dashboardData.interviews_scheduled || 0,
      });

      // Load job openings
      const jobsRes = await axios.get(`/startup/${user?._id}/jobs`);
      setJobOpenings(jobsRes.data.jobs || []);

      // Load notifications
      const notificationsRes = await axios.get(`/startup/${user?._id}/notifications`);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png"
                  alt="MinuteHire Logo"
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold text-gray-800">MinuteHire</span>
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Startup Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/startup/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            {startupData?.logo_url ? (
              <img
                src={startupData.logo_url}
                alt="Startup Logo"
                className="h-16 w-16 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {startupData?.startup_name || 'Startup'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                {startupData?.founder_name && `Founded by ${startupData.founder_name} • `}
                {startupData?.industry && `${startupData.industry} • `}
                {startupData?.funding_stage && `${startupData.funding_stage}`}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-600">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats?.total_jobs || 0}</div>
              <p className="text-xs text-blue-600">{stats?.active_jobs || 0} active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-600">Applications</CardTitle>
                <FileText className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {stats?.total_applications || 0}
              </div>
              <p className="text-xs text-green-600">{stats?.pending_applications || 0} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-600">Interviews</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {stats?.interviews_scheduled || 0}
              </div>
              <p className="text-xs text-orange-600">scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-600">Hired</CardTitle>
                <Award className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {stats?.hired_candidates || 0}
              </div>
              <p className="text-xs text-purple-600">candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job Openings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Job Openings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Job Openings</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {jobOpenings.slice(0, 5).map(job => (
                        <div
                          key={job._id}
                          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {job.applications_count} applications
                              </span>
                            </div>
                          </div>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{startupData?.startup_name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Founder</p>
                      <p className="font-medium">{startupData?.founder_name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{startupData?.industry || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Funding Stage</p>
                      <p className="font-medium">{startupData?.funding_stage || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Team Size</p>
                      <p className="font-medium">
                        {startupData?.employees_count || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate('/startup/profile')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Job Openings Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No job openings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by posting your first job opening.
                  </p>
                  <div className="mt-6">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Applications will appear here once candidates start applying to your jobs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Analytics Coming Soon
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Track your hiring performance with detailed analytics and insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {notifications.map(notification => (
                        <div
                          key={notification._id}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            {notification.type === 'success' && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {notification.type === 'warning' && (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                            {notification.type === 'error' && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            {notification.type === 'info' && (
                              <AlertCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're all caught up! Notifications will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupDashboard;
