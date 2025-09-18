import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { sampleDataService } from '@/services/sampleDataService';
import { applicationsApi } from '@/lib/api/applications';
import { Search, MapPin, DollarSign, Clock, Building2, BookOpen, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<
    Array<{
      id: string;
      title: string;
      company: string;
      company_name?: string;
      location: string;
      salary_range?: string;
      salary_min?: number;
      salary_max?: number;
      description: string;
      requirements?: string[];
      skills_required?: string[];
      job_type?: string;
      posted_date?: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadJobs();
    loadUserApplications();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await sampleDataService.getSampleData();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadUserApplications = async () => {
    if (!user?._id) return;

    try {
      const applications = await applicationsApi.getApplications(user._id);
      if (Array.isArray(applications)) {
        const appliedJobIds = new Set(applications.map((app: any) => app.job_id));
        setAppliedJobs(appliedJobIds);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyToJob = async (jobId: string) => {
    if (!user?._id) {
      toast.error('Please log in to apply for jobs');
      return;
    }

    if (appliedJobs.has(jobId)) {
      toast.info('You have already applied to this job');
      return;
    }

    try {
      await applicationsApi.applyToJob({
        job_id: jobId,
        applicant_id: user._id,
        status: 'applied',
        cover_letter: 'Applied through JobSeeker Dashboard',
      });

      // Update local state
      setAppliedJobs(prev => new Set(prev).add(jobId));
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Job Seeker Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back, {user?.full_name}!</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                <Link to="/jobseeker/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Available Jobs</CardTitle>
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Applications</CardTitle>
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Tests Taken</CardTitle>
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Interviews</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Job Search */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Find Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
              <Button className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No jobs found matching your criteria.</p>
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-2 gap-1 sm:gap-4">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{job.company_name}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{job.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-3 gap-1 sm:gap-4">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="text-sm sm:text-base">
                                  ${job.salary_min?.toLocaleString()} - $
                                  {job.salary_max?.toLocaleString()}
                                </span>
                              </div>
                              <Badge variant="secondary" className="w-fit">
                                {job.job_type?.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
                              {job.description}
                            </p>
                            {job.skills_required && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {job.skills_required
                                  .slice(0, 4)
                                  .map((skill: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                {job.skills_required.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{job.skills_required.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-auto">
                            <Button
                              onClick={() => handleApplyToJob(job.id)}
                              className="whitespace-nowrap w-full sm:w-auto"
                              disabled={appliedJobs.has(job.id)}
                              variant={appliedJobs.has(job.id) ? 'secondary' : 'default'}
                              size="sm"
                            >
                              {appliedJobs.has(job.id) ? 'Applied' : 'Apply Now'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              asChild
                            >
                              <Link to={`/jobs/${job.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/free-test" className="hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Take Free Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Assess your skills with our free practice tests.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ai-interview" className="hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  AI Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Practice with our AI-powered interview simulation.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/jobseeker/applications" className="hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Track your job applications and their status.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
