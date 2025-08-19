
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@/lib/api/jobs';
import { applicationsApi } from '@/lib/api/applications';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  Briefcase,
  CheckCircle
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadJobDetails();
      checkApplicationStatus();
    }
  }, [id, user]);

  const loadJobDetails = async () => {
    try {
      const jobData = await jobsApi.getJobById(id!);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!user || !id) return;
    
    try {
      const applications = await applicationsApi.getUserApplications(user.id);
      const hasAppliedToJob = applications.some(app => app.job_id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    setShowApplicationForm(false);
    toast.success('Application submitted successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link to="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/jobs" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={job.profiles?.avatar_url} />
                      <AvatarFallback>
                        {job.company_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{job.company_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About the Role</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                </div>

                {job.skills_required && job.skills_required.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Benefits</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {job.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="text-gray-700">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Application Form */}
            {showApplicationForm && user?.role === 'jobseeker' && (
              <JobApplicationForm
                jobId={job.id}
                jobTitle={job.title}
                onSuccess={handleApplicationSuccess}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Salary</span>
                  </div>
                  <span className="text-sm">
                    {job.min_salary && job.max_salary 
    ? `₹${job.min_salary.toLocaleString('en-IN')} - ₹${job.max_salary.toLocaleString('en-IN')}`
                      : 'Competitive'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Job Type</span>
                  </div>
                  <Badge variant="outline">
                    {job.job_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <span className="text-sm">{job.experience_required || 0} years</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Applications</span>
                  </div>
                  <span className="text-sm">{job.job_applications?.[0]?.count || 0}</span>
                </div>

                {job.remote_allowed && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Remote work allowed</span>
                  </div>
                )}

                {job.application_deadline && (
                  <div className="text-sm text-red-600">
                    <strong>Application Deadline:</strong>{' '}
                    {new Date(job.application_deadline).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Actions */}
            {user?.role === 'jobseeker' && (
              <Card>
                <CardContent className="pt-6">
                  {hasApplied ? (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-green-700 mb-2">Applied Successfully!</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        You have already applied for this position.
                      </p>
                      <Link to="/jobseeker/applications">
                        <Button variant="outline" className="w-full">
                          View My Applications
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        onClick={() => setShowApplicationForm(true)}
                        disabled={showApplicationForm}
                      >
                        Apply for this Job
                      </Button>
                      <Button variant="outline" className="w-full">
                        Save for Later
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={job.profiles?.avatar_url} />
                    <AvatarFallback>
                      {job.company_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{job.profiles?.full_name}</p>
                    <p className="text-sm text-gray-600">Recruiter</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Join our growing team and make an impact in the industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
