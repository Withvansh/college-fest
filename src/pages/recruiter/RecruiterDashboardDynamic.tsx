import { useEffect, useState, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, TestTube, BarChart3, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { recruiterDashboardsApi } from '@/lib/api/recruiterDashboards';

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  applicants: number;
  status: string;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedDate: string;
  testScore?: number;
  status: string;
}

interface TestResult {
  id: string;
  candidateName: string;
  position: string;
  score: number;
  completedDate: string;
  completedAt?: string; // For backward compatibility
  testName?: string;
  status: string;
}

type RecruiterDashboard = {
  id: string;
  dashboard_name?: string;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  stats?: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    applications: number;
    testsCreated: number;
    interviewsScheduled: number;
  };
  mockData?: {
    recentJobs: unknown[];
    recentApplications: unknown[];
    analyticsData: unknown[];
    jobPosts: JobPost[];
    applicants: Applicant[];
    testResults: TestResult[];
  };
};
import { toast } from 'sonner';

const RecruiterDashboardDynamic = () => {
  const { dashboardId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!user || !dashboardId) {
      console.log('❌ loadDashboard: Missing user or dashboardId');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading dashboard for user:', user._id, 'dashboardId:', dashboardId);

      // First get the user's dashboard to verify ownership
      const userDashboard = await recruiterDashboardsApi.getDashboard(user._id);
      console.log('📊 User dashboard fetched:', userDashboard);

      if (!userDashboard) {
        console.log('❌ No dashboard found for user, redirecting to HRMS');
        toast.error('Dashboard not found. Redirecting to HRMS workspace.');
        navigate('/recruiter/hrms', { replace: true });
        return;
      }

      // Create a properly formatted dashboard object
      const dashboardData: RecruiterDashboard = {
        id: dashboardId,
        dashboard_name: `${user.full_name}'s Dashboard`,
        totalJobs: userDashboard.totalJobs || 0,
        activeJobs: userDashboard.activeJobs || 0,
        totalApplications: userDashboard.totalApplications || 0,
        pendingApplications: userDashboard.pendingApplications || 0,
        stats: {
          totalJobs: userDashboard.totalJobs || 0,
          activeJobs: userDashboard.activeJobs || 0,
          totalApplications: userDashboard.totalApplications || 0,
          pendingApplications: userDashboard.pendingApplications || 0,
          applications: userDashboard.totalApplications || 0,
          testsCreated: 5, // Mock data
          interviewsScheduled: 12, // Mock data
        },
        mockData: {
          recentJobs: [],
          recentApplications: [],
          analyticsData: [],
          jobPosts: [
            {
              id: '1',
              title: 'Senior Frontend Developer',
              company: 'TechCorp Inc.',
              location: 'Remote',
              postedDate: '2024-01-15',
              applicants: 24,
              status: 'Active',
            },
            {
              id: '2',
              title: 'Backend Engineer',
              company: 'TechCorp Inc.',
              location: 'New York',
              postedDate: '2024-01-12',
              applicants: 18,
              status: 'Active',
            },
          ],
          applicants: [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              position: 'Frontend Developer',
              appliedDate: '2024-01-20',
              testScore: 85,
              status: 'Interview Scheduled',
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              position: 'Backend Engineer',
              appliedDate: '2024-01-18',
              testScore: 92,
              status: 'Shortlisted',
            },
          ],
          testResults: [
            {
              id: '1',
              candidateName: 'Alex Johnson',
              position: 'Full Stack Developer',
              score: 88,
              completedDate: '2024-01-19',
              testName: 'Technical Assessment',
              completedAt: '2024-01-19',
              status: 'Passed',
            },
          ],
        },
      };

      console.log('✅ Dashboard loaded successfully:', dashboardData);
      setDashboard(dashboardData);
    } catch (err) {
      console.error('💥 Error loading dashboard:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      toast.error('Failed to load dashboard. Redirecting to HRMS workspace.');

      // Fallback to HRMS after a delay
      setTimeout(() => {
        navigate('/recruiter/hrms', { replace: true });
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [user, dashboardId, navigate]);

  useEffect(() => {
    console.log('🎯 RecruiterDashboardDynamic - Component mounted');
    console.log('📊 Dashboard ID from URL:', dashboardId);
    console.log('👤 Current user:', user);

    if (user && dashboardId) {
      // Check if dashboardId is valid (not 'undefined' or empty)
      if (dashboardId === 'undefined' || !dashboardId.trim()) {
        console.log('❌ Invalid dashboard ID, redirecting to HRMS');
        toast.error('Invalid dashboard. Redirecting to HRMS workspace.');
        navigate('/recruiter/hrms', { replace: true });
        return;
      }

      loadDashboard();
    } else if (user && !dashboardId) {
      console.log('❌ No dashboard ID provided, redirecting to HRMS');
      navigate('/recruiter/hrms', { replace: true });
    } else {
      console.log('⏳ Missing user or dashboardId:', { user: !!user, dashboardId });
      setLoading(false);
    }
  }, [user, dashboardId, navigate, loadDashboard]);

  // Add detailed debugging for authentication
  if (!user) {
    console.log('❌ User not authenticated, redirecting to auth');
    return <Navigate to="/auth/recruiter" replace />;
  }

  if (user.role !== 'recruiter') {
    console.log('❌ User role is not recruiter:', user.role);
    return <Navigate to="/" replace />;
  }

  if (loading) {
    console.log('⏳ Dashboard loading...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Dashboard ID: {dashboardId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Dashboard error state:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <div className="mt-4 space-y-2">
            <Button onClick={() => navigate('/recruiter/hrms')} className="mr-2">
              Go to HRMS Workspace
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Dashboard ID: {dashboardId}</p>
            <p>User ID: {user._id}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    console.log('❌ No dashboard data available');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Dashboard not found</p>
          <Button onClick={() => navigate('/recruiter/hrms')} className="mt-4">
            Go to HRMS Workspace
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering dashboard with data:', dashboard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {dashboard.dashboard_name}
            </h1>
            <div className="flex items-center space-x-3 md:space-x-4">
              <span className="text-sm md:text-base text-gray-600">Welcome back, {user.name}</span>
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Top Metrics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Active Jobs</CardTitle>
              <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg md:text-2xl font-bold">{dashboard.stats.activeJobs}</div>
            </CardContent>
          </Card>

          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Applications</CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg md:text-2xl font-bold">{dashboard.stats.applications}</div>
            </CardContent>
          </Card>

          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Tests Created</CardTitle>
              <TestTube className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg md:text-2xl font-bold">{dashboard.stats.testsCreated}</div>
            </CardContent>
          </Card>

          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg md:text-2xl font-bold">
                {dashboard.stats.interviewsScheduled}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            {/* Recent Job Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Job Posts</span>
                  <Link to="/recruiter/post-job">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.mockData.jobPosts.map(job => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {job.company} • {job.location}
                        </p>
                        <p className="text-xs text-gray-500">Posted: {job.postedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{job.applicants} applicants</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.mockData.applicants.map(applicant => (
                    <div
                      key={applicant.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{applicant.name}</h3>
                        <p className="text-sm text-gray-600">{applicant.email}</p>
                        <p className="text-xs text-gray-500">Applied for: {applicant.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{applicant.appliedDate}</p>
                        {applicant.testScore && (
                          <p className="text-xs text-blue-600">
                            Test Score: {applicant.testScore}%
                          </p>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            applicant.status === 'Interview Scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : applicant.status === 'Shortlisted'
                                ? 'bg-green-100 text-green-800'
                                : applicant.status === 'Under Review'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.mockData.testResults.map(result => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{result.candidateName}</h3>
                        <p className="text-sm text-gray-600">{result.testName}</p>
                        <p className="text-xs text-gray-500">Completed: {result.completedAt}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            result.score >= 90
                              ? 'text-green-600'
                              : result.score >= 70
                                ? 'text-blue-600'
                                : 'text-yellow-600'
                          }`}
                        >
                          {result.score}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="space-y-4">
              <Link to="/recruiter/post-job" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <Plus className="mr-2 h-4 w-4 text-blue-600" />
                      Post New Job
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs">Create and publish new job openings.</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/recruiter/create-test" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <TestTube className="mr-2 h-4 w-4 text-green-600" />
                      Create Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs">Design assessment tests for candidates.</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/recruiter/hrms" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <Building2 className="mr-2 h-4 w-4 text-purple-600" />
                      HRMS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs">
                      Manage HR operations and onboard employees.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Fixed CTA */}
        <div className="xl:hidden fixed bottom-4 right-4 z-50">
          <Link to="/recruiter/post-job">
            <Button size="lg" className="rounded-full shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Post Job
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardDynamic;
