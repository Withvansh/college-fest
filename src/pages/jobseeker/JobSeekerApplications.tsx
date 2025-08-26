import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi } from '@/lib/api/applications';
import { ArrowLeft, Building2, MapPin, Calendar, Eye, Trash2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  appliedDate: string;
  status: 'applied' | 'interview_scheduled' | 'rejected' | 'hired';
  salary: string;
  jobType: string;
}

const JobSeekerApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadApplications();
  }, [user]); // Add user as dependency to reload when user changes

  // Add this useEffect to reload data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadApplications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadApplications = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      console.log('Loading applications for user:', user._id);
      const response = await applicationsApi.getApplications(user._id);
      console.log('Applications loaded:', response);

      // Handle the nested response structure
      const userApplications = (response as any)?.data || response;

      if (Array.isArray(userApplications)) {
        // Convert backend application format to frontend format
        const formattedApplications: Application[] = userApplications.map((app: any) => ({
          id: app._id || app.id,
          jobId: app.job_id?._id || app.job_id,
          jobTitle: app.job_id?.title || 'Job Title Not Available',
          companyName: app.job_id?.company_name || 'Company Name Not Available',
          location: app.job_id?.location || 'Location Not Available',
          appliedDate: app.applied_at || app.createdAt || new Date().toISOString(),
          status: app.status || 'applied',
          salary: app.expected_salary
            ? `₹${app.expected_salary.toLocaleString()}`
            : 'Salary not specified',
          jobType: app.job_id?.job_type || 'Full-time',
        }));

        console.log('Formatted applications:', formattedApplications);
        setApplications(formattedApplications);
      } else {
        console.log('No applications found');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
      toast.error('Failed to load applications from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId: string, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to withdraw your application for ${jobTitle}?`)) {
      try {
        await applicationsApi.withdrawApplication(applicationId);
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        toast.success('Application withdrawn successfully');
      } catch (error) {
        console.error('Error withdrawing application:', error);
        toast.error('Failed to withdraw application');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'rejected':
        return 'Rejected';
      case 'hired':
        return 'Hired';
      default:
        return status;
    }
  };

  const filteredApplications = applications
    .filter(app => {
      if (filterStatus === 'all') return true;
      return app.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      } else {
        return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Add refresh button in the header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/jobseeker/dashboard"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600">Track your job applications</p>
              </div>
            </div>
            <Button onClick={loadApplications} variant="outline" size="sm" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filterStatus === 'all'
                  ? 'No applications yet'
                  : `No ${filterStatus.replace('_', ' ')} applications`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all'
                  ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                  : `You don't have any applications with ${filterStatus.replace('_', ' ')} status.`}
              </p>
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(application => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {application.jobTitle}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building2 className="h-4 w-4 mr-1" />
                            <span className="mr-4">{application.companyName}</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{application.location}</span>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(application.status)} border-0`}>
                          {getStatusText(application.status)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">{application.jobType}</Badge>
                        <span className="font-medium text-green-600">{application.salary}</span>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/jobs/${application.jobId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      {application.status === 'applied' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleWithdrawApplication(application.id, application.jobTitle)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerApplications;
