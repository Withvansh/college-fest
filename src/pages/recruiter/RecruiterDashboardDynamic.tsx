import { useEffect, useState, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, TestTube, BarChart3, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { recruiterDashboardsApi } from '@/lib/api/recruiter-dashboard';
import ManageStartupsModal from '@/components/ManageStartupsModal';

interface JobPost {
  _id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  applicants: number;
  status: string;
}

interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone?: string; // Added phone field
  position: string;
  appliedDate: string;
  testScore?: number;
  expectedSalary?: number; // Added expected salary
  coverLetter?: string; // Added cover letter
  location?: string; // Added job location
  status: string;
}

interface TestResult {
  _id: string;
  candidateName: string;
  position: string;
  score: number;
  completedDate: string;
  completedAt?: string; // For backward compatibility
  testName?: string;
  status: string;
}

type RecruiterDashboard = {
  _id: string;
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
  const [isManageStartupsOpen, setIsManageStartupsOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!user || !dashboardId) {
    
      return;
    }

    try {
      setLoading(true);
      setError(null);



      // First get the user's dashboard to verify ownership
      const userDashboard = await recruiterDashboardsApi.getDashboard(user._id);
  

      if (!userDashboard) {
  
        toast.error('Dashboard not found. Redirecting to HRMS workspace.');
        navigate('/recruiter/hrms', { replace: true });
        return;
      }

      // Fetch real jobs for this recruiter
      let realJobs: JobPost[] = [];
      let realApplications: Applicant[] = [];
      let totalApplicationsCount = 0;
      let pendingApplicationsCount = 0;

      try {
        const jobsResponse = await recruiterDashboardsApi.getJobs(user._id, 1, 10);
    

        // Handle the expected response structure
        const jobsArray = jobsResponse?.jobs || [];

        if (Array.isArray(jobsArray)) {
          // First map jobs without applicant count
          realJobs = jobsArray.map(job => ({
            _id: job._id,
            title: job.title,
            company: job.company_name || 'Company',
            location: job.location,
            postedDate: new Date(job.created_at).toISOString().split('T')[0],
            applicants: 0, // Will be updated below
            status: job.status === 'active' ? 'Active' : 'Inactive',
          }));

          // Fetch applicant counts for each job
          const jobsWithApplicants = await Promise.allSettled(
            realJobs.map(async job => {
              try {
                const applicationsResponse = await recruiterDashboardsApi.getApplicationsByJob(
                  job._id,
                  1,
                  1
                );
      

                // Handle both possible response structures
                const total =
                  applicationsResponse?.total ||
                  applicationsResponse?.total ||
                  (Array.isArray(applicationsResponse?.applications)
                    ? applicationsResponse.applications.length
                    : 0);

        

                return {
                  ...job,
                  applicants: total,
                };
              } catch (error) {
                console.warn(
                  `⚠️ Could not fetch applications for job ${job.title} (${job._id}):`,
                  error
                );
                return job; // Return job with 0 applicants if error
              }
            })
          );

          realJobs = jobsWithApplicants
            .map(result => {
              if (result.status === 'fulfilled') {
                return result.value;
              } else {
          
                // Find the original job from the failed attempt
                const failedJob = realJobs.find(job => job._id);
                return failedJob || realJobs[0];
              }
            })
            .filter(Boolean);
        }
      } catch (jobError) {
        console.error('❌ Error fetching jobs:', jobError);
        // Continue with empty jobs array
      }

      // Fetch recent applications
      try {
        const applicationsResponse = await recruiterDashboardsApi.getApplications(user._id, 1, 10);


        // Updated to use the correct response structure
        const applicationsArray = applicationsResponse.applications || [];
        totalApplicationsCount = Array.isArray(applicationsResponse.total)
          ? applicationsResponse.total.length
          : applicationsResponse.total || 0;

        if (Array.isArray(applicationsArray)) {
      

          realApplications = applicationsArray.map((application, index) => {
        

            // Handle the actual API response structure
            const applicantName = application?.applicant_id?.full_name || 'Unknown Applicant';
            const applicantEmail = application?.applicant_id?.email || 'No email';
            const applicantPhone = application?.applicant_id?.phone || '';
            const jobTitle = application?.job_id?.title || 'Unknown Position';
            const jobCompany = application?.job_id?.company_name || 'Unknown Company';
            const jobLocation = application?.job_id?.location || '';

            const processedApplication = {
              _id: application._id,
              name: applicantName,
              email: applicantEmail,
              phone: applicantPhone,
              position: `${jobTitle} at ${jobCompany}`,
              appliedDate: new Date(application.applied_at).toISOString().split('T')[0],
              testScore: application.test_score,
              expectedSalary: application.expected_salary,
              coverLetter: application.cover_letter,
              location: jobLocation,
              status:
                application.status === 'applied'
                  ? 'Applied'
                  : application.status === 'reviewed'
                    ? 'Under Review'
                    : application.status === 'shortlisted'
                      ? 'Shortlisted'
                      : application.status === 'interview_scheduled'
                        ? 'Interview Scheduled'
                        : application.status === 'interviewed'
                          ? 'Interviewed'
                          : application.status === 'selected'
                            ? 'Selected'
                            : application.status === 'rejected'
                              ? 'Rejected'
                              : 'Applied',
            };

          
            return processedApplication;
          });

          // Count pending applications (applied, reviewed, shortlisted, interview_scheduled)
          pendingApplicationsCount = applicationsArray.filter(app =>
            ['applied', 'reviewed', 'shortlisted', 'interview_scheduled'].includes(app.status)
          ).length;
        }
      } catch (applicationError) {
        console.warn(
          '⚠️ Could not fetch applications (continuing with mock data):',
          applicationError
        );
        // Continue with empty applications array - dashboard will show empty state
      }

      // Create a properly formatted dashboard object
      const dashboardData: RecruiterDashboard = {
        _id: dashboardId,
        dashboard_name: `${user.full_name}'s Dashboard`,
        totalJobs: userDashboard.totalJobs || realJobs.length || 0,
        activeJobs:
          userDashboard.activeJobs || realJobs.filter(job => job.status === 'Active').length || 0,
        totalApplications: Array.isArray(userDashboard.totalApplications)
          ? userDashboard.totalApplications.length
          : userDashboard.totalApplications || totalApplicationsCount || 0,
        pendingApplications: userDashboard.pendingApplications || pendingApplicationsCount || 0,
        stats: {
          totalJobs: userDashboard.totalJobs || realJobs.length || 0,
          activeJobs:
            userDashboard.activeJobs || realJobs.filter(job => job.status === 'Active').length || 0,
          totalApplications: Array.isArray(userDashboard.totalApplications)
            ? userDashboard.totalApplications.length
            : userDashboard.totalApplications || totalApplicationsCount || 0,
          pendingApplications: userDashboard.pendingApplications || pendingApplicationsCount || 0,
          applications: Array.isArray(userDashboard.totalApplications)
            ? userDashboard.totalApplications.length
            : userDashboard.totalApplications || totalApplicationsCount || 0,
          testsCreated: 0, // Mock data
          interviewsScheduled: 0, // Mock data
        },
        mockData: {
          recentJobs: [],
          recentApplications: [],
          analyticsData: [],
          jobPosts: realJobs.length > 0 ? realJobs : [], // Changed: don't fall back to mock data
          applicants: realApplications, // Changed: always use real applications, even if empty
          testResults: [
            {
              _id: '1',
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

      setDashboard(dashboardData);
    } catch (err) {
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
    if (user && dashboardId) {
      // Check if dashboardId is valid (not 'undefined' or empty)
      if (dashboardId === 'undefined' || !dashboardId.trim()) {
        toast.error('Invalid dashboard. Redirecting to HRMS workspace.');
        navigate('/recruiter/hrms', { replace: true });
        return;
      }

      loadDashboard();
    } else if (user && !dashboardId) {
      navigate('/recruiter/hrms', { replace: true });
    } else {
      setLoading(false);
    }

    // Also listen for storage events to refresh when returning from job posting
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'refresh-dashboard' && e.newValue === 'true') {
        localStorage.removeItem('refresh-dashboard');
        if (user && dashboardId) {
          loadDashboard();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, dashboardId, navigate, loadDashboard]);

  // Add detailed debugging for authentication
  if (!user) {
    return <Navigate to="/auth/recruiter" replace />;
  }

  if (user.role !== 'recruiter') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
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
              <span className="text-sm md:text-base text-gray-600">
                Welcome back, {user.full_name}
              </span>
              {/* <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                onClick={() => setIsManageStartupsOpen(true)}
              >
                <Building2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Manage Startups
              </Button> */}
              <Button variant="outline" size="sm" className="text-xs md:text-sm" asChild>
                <Link to="/recruiter/profile">Profile</Link>
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
                  <Link to="/recruiter/jobs">
                    <Button size="sm">View All Posts</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.mockData.jobPosts.length > 0 ? (
                    dashboard.mockData.jobPosts.map(job => (
                      <div
                        key={job._id}
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No job posts yet</p>
                      <p className="text-sm text-gray-400 mb-4">
                        Start by creating your first job posting
                      </p>
                      <Link to="/recruiter/post-job">
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Post Your First Job
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <span className="text-lg sm:text-xl">Recent Applicants</span>
                  <Link to="/recruiter/applications">
                    <Button size="sm" className="w-full sm:w-auto text-sm">
                      <span className="sm:hidden">View All</span>
                      <span className="hidden sm:inline">View All Applications</span>
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {dashboard.mockData.applicants.length > 0 ? (
                    dashboard.mockData.applicants.map(applicant => (
                      <div
                        key={applicant._id}
                        className="border rounded-lg hover:bg-gray-50 transition-colors overflow-hidden"
                      >
                        {/* Mobile Layout */}
                        <div className="block sm:hidden p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base truncate">
                                {applicant.name}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">{applicant.email}</p>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              <span
                                className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                                  applicant.status === 'Interview Scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : applicant.status === 'Shortlisted'
                                      ? 'bg-green-100 text-green-800'
                                      : applicant.status === 'Under Review'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : applicant.status === 'Applied'
                                          ? 'bg-purple-100 text-purple-800'
                                          : applicant.status === 'Selected'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : applicant.status === 'Rejected'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {applicant.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {applicant.phone && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <span className="mr-2">📞</span>
                                {applicant.phone}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Position:</span>{' '}
                              <span className="text-gray-700">{applicant.position}</span>
                            </p>
                            {applicant.location && (
                              <p className="text-sm text-gray-400 flex items-center">
                                <span className="mr-2">📍</span>
                                {applicant.location}
                              </p>
                            )}
                            {applicant.expectedSalary && (
                              <p className="text-sm text-green-600 flex items-center">
                                <span className="mr-2">💰</span>
                                Expected: ₹{applicant.expectedSalary.toLocaleString()}
                              </p>
                            )}
                            {applicant.testScore && (
                              <p className="text-sm text-blue-600 flex items-center">
                                <span className="mr-2">📊</span>
                                Test Score: {applicant.testScore}%
                              </p>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-500">
                                Applied: {applicant.appliedDate}
                              </p>
                              <Link to={`/recruiter/applications/${applicant._id}`}>
                                <Button size="sm" variant="outline" className="text-xs">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center justify-between p-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900">{applicant.name}</h3>
                            <p className="text-sm text-gray-600">{applicant.email}</p>
                            {applicant.phone && (
                              <p className="text-xs text-gray-500">📞 {applicant.phone}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Applied for: {applicant.position}
                            </p>
                            {applicant.location && (
                              <p className="text-xs text-gray-400">📍 {applicant.location}</p>
                            )}
                            {applicant.expectedSalary && (
                              <p className="text-xs text-green-600 mt-1">
                                💰 Expected: ₹{applicant.expectedSalary.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-sm font-medium text-gray-900">
                              {applicant.appliedDate}
                            </p>
                            {applicant.testScore && (
                              <p className="text-xs text-blue-600 mt-1">
                                📊 Test Score: {applicant.testScore}%
                              </p>
                            )}
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded-full mt-2 font-medium ${
                                applicant.status === 'Interview Scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : applicant.status === 'Shortlisted'
                                    ? 'bg-green-100 text-green-800'
                                    : applicant.status === 'Under Review'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : applicant.status === 'Applied'
                                        ? 'bg-purple-100 text-purple-800'
                                        : applicant.status === 'Selected'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : applicant.status === 'Rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {applicant.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2 text-base sm:text-lg">No applications yet</p>
                      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
                        Applications will appear here once candidates start applying to your jobs
                      </p>
                      <div className="space-y-3 sm:space-y-2">
                        <Link to="/recruiter/post-job">
                          <Button size="sm" variant="outline" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="sm:hidden">Post a Job</span>
                            <span className="hidden sm:inline">Post Your First Job</span>
                          </Button>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-400 px-4 sm:px-0">
                          Start receiving applications by posting your first job
                        </p>
                      </div>
                    </div>
                  )}
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
                  {/* {dashboard.mockData.testResults.map(result => (
                    <div
                      key={result._id}
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
                  ))} */}
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

              {/* <Link to="/recruiter/create-test" className="block"> */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <TestTube className="mr-2 h-4 w-4 text-green-600" />
                      Create Test Coming Soon....
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs">Design assessment tests for candidates.</p>
                  </CardContent>
                </Card>
              {/* </Link> */}

              <Link to="/recruiter/college/drives" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <Building2 className="mr-2 h-4 w-4 text-purple-600" />
                      College drives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs">Manage college drives for recruitment.</p>
                  </CardContent>
                </Card>
              </Link>
              {/* <Link to="/recruiter/hrms" className="block"> */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <Building2 className="mr-2 h-4 w-4 text-purple-600" />
                      HRMS Coming Soon....
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs">
                      Manage HR operations and onboard employees.
                    </p>
                  </CardContent>
                </Card>
              {/* </Link> */}
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

      {/* Manage Startups Modal */}
      <ManageStartupsModal
        isOpen={isManageStartupsOpen}
        onClose={() => setIsManageStartupsOpen(false)}
        onStartupSelect={startup => {
          toast.success(`Switched to ${startup.startup_name}`);
        }}
      />
    </div>
  );
};

export default RecruiterDashboardDynamic;
