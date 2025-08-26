import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { jobsApi } from '@/lib/api/jobs';
import { applicationsApi } from '@/lib/api/applications';
import { type Job } from '@/lib/api/recruiter-dashboard';
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
  CheckCircle,
  Send,
  X,
} from 'lucide-react';
import axios from '../../lib/utils/axios';

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jobApplicationData, setJobApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
  });
const [check,SetCheck]= useState(false);
  const loadJobDetails = useCallback(async () => {
    try {
      const jobData = await jobsApi.getJobById(id!);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkApplicationStatus = useCallback(async () => {
    if (!user || !id) return;

    try {
      const applications: any = await applicationsApi.getApplications(user._id);
      const hasAppliedToJob = applications.some((app: any) => app.job_id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  }, [user, id]);

  const handleOpenApplicationModal = () => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('auth_token');
    if (!authToken || !isAuthenticated) {
      toast.error('Please login to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    setShowApplicationModal(true);
  };

  const handleJobApplication = async () => {
    // Check authentication again before submitting
    const authToken = localStorage.getItem('auth_token');
    if (!authToken || !user || !id) {
      toast.error('Please login to apply for this job');
      setShowApplicationModal(false);
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setSubmitting(true);

      // Validate required fields
      if (!jobApplicationData.coverLetter || !jobApplicationData.expectedSalary) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Convert expected salary to number if needed
      const expectedSalary =
        parseFloat(jobApplicationData.expectedSalary.replace(/[^\d.]/g, '')) || 0;

      // Submit application using axios
      const response = await axios.post(
        '/job-applications',
        {
          job_id: id,
          applicant_id: user._id,
          cover_letter: jobApplicationData.coverLetter,
          expected_salary: expectedSalary,
          available_from: jobApplicationData.availableFrom
            ? new Date(jobApplicationData.availableFrom)
            : undefined,
          status: 'applied',
          applied_at: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Reset form and update state
      setJobApplicationData({
        coverLetter: '',
        expectedSalary: '',
        availableFrom: '',
      });

      setHasApplied(true);
      setShowApplicationModal(false);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        navigate('/login', { state: { from: `/jobs/${id}` } });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit application');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const checkAlreadyApplied = async (id:string) => {
    try {
      const response= await axios.get(`/job-applications/job/${id}`);
    
response.data.data.forEach((element:any) => {
  
  if(element.applicant_id._id==localStorage.getItem("user_id")){
    
    SetCheck(true)
  }
});
     
    
    } catch (e: any) {
console.log(e)
    }
  };
  useEffect(() => {
    if (id) {
      loadJobDetails();
      checkAlreadyApplied(id)
      if (isAuthenticated && user) {
        checkApplicationStatus();
      }
    }
  }, [id, loadJobDetails, checkApplicationStatus, isAuthenticated, user]);

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
                      <AvatarFallback>
                        {job.company_name?.substring(0, 2).toUpperCase() || 'CO'}
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
                          <li key={index} className="text-gray-700">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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
                      : 'Competitive'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Job Type</span>
                  </div>
                  <Badge variant="outline">{job.job_type.replace('_', ' ').toUpperCase()}</Badge>
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
                  <span className="text-sm">0</span>{' '}
                  {/* TODO: Get actual application count from backend */}
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
           { localStorage.getItem("auth_token")?<Card>
              <CardContent className="pt-6">
                {hasApplied || check ? (
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
                    <Button className="w-full" onClick={handleOpenApplicationModal}>
                      Apply for this Job
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save for Later
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>:<Button className="w-full" >
                     Login to apply
                    </Button>
                   }

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {job.company_name?.substring(0, 2).toUpperCase() || 'CO'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{job.company_name}</p>
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

        {/* Application Modal */}
        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Apply for {job.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowApplicationModal(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="coverLetter">Cover Letter *</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're the perfect fit for this role..."
                  value={jobApplicationData.coverLetter}
                  onChange={e =>
                    setJobApplicationData({ ...jobApplicationData, coverLetter: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedSalary">Expected Salary *</Label>
                  <Input
                    id="expectedSalary"
                    placeholder="e.g., ₹7.5L"
                    value={jobApplicationData.expectedSalary}
                    onChange={e =>
                      setJobApplicationData({
                        ...jobApplicationData,
                        expectedSalary: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={jobApplicationData.availableFrom}
                    onChange={e =>
                      setJobApplicationData({
                        ...jobApplicationData,
                        availableFrom: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
             { check?<Button
                onClick={handleJobApplication}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                { 'Already Submitted'}
              </Button>:<Button
                onClick={handleJobApplication}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobDetailsPage;
