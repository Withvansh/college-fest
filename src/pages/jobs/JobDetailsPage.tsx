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
import { toast } from 'sonner';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Building2,
  Users,
  Calendar,
  Briefcase,
  CheckCircle,
  Send,
  X,
  Bookmark,
  Home,
  Shield,
  Award,
  BookOpen,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Gift,
  Car,
  Coffee,
  Laptop,
  Building,
  Tag,
  Wifi,
  GraduationCap,
  Plane,
  Zap,
  HeartHandshake,
} from 'lucide-react';
import axios from '../../lib/utils/axios';

// Define the Job interface based on API response
interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  company_name: string;
  location: string;
  job_type: string;
  employment_type?: string;
  min_salary?: number;
  max_salary?: number;
  currency?: string;
  experience_required?: number;
  experience_level?: string;
  skills_required?: string[];
  education_requirements?: string[];
  certifications_required?: string[];
  benefits?: string[];
  department?: string;
  job_category?: string;
  travel_required?: string;
  urgency_level?: string;
  remote_allowed?: boolean;
  application_deadline?: string;
  recruiter_id?: {
    _id: string;
    full_name: string;
    email: string;
    role: string;
  };
  status?: string;
  created_at: string;
  updated_at: string;
}

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
  const [check, setCheck] = useState(false);

  const loadJobDetails = useCallback(async () => {
    try {
      const response = await jobsApi.getJobById(id!);
      if (response) {
        // Handle both direct response and nested response formats
        const jobData = (response as any).data || response;

        // Transform the API response to match our interface - completely dynamic
        const transformedJob: Job = {
          _id: jobData._id || jobData.id,
          title: jobData.title || '',
          description: jobData.description || 'No description provided',
          requirements:
            jobData.requirements || 'Requirements will be discussed during the interview process',
          company_name: jobData.company_name || 'Company',
          location: jobData.location || 'Location not specified',
          job_type: jobData.job_type || 'full_time',
          employment_type: jobData.employment_type || jobData.job_type,
          min_salary: jobData.min_salary || undefined,
          max_salary: jobData.max_salary || undefined,
          currency: jobData.currency || 'INR',
          experience_required: jobData.experience_required || 0,
          experience_level: jobData.experience_level || 'entry',
          skills_required: jobData.skills_required || [],
          education_requirements: jobData.education_requirements || [],
          certifications_required: jobData.certifications_required || [],
          benefits: jobData.benefits || [],
          department: jobData.department || undefined,
          job_category: jobData.job_category || undefined,
          travel_required: jobData.travel_required || undefined,
          urgency_level: jobData.urgency_level || 'normal',
          remote_allowed: jobData.remote_allowed || false,
          application_deadline: jobData.application_deadline || undefined,
          recruiter_id: jobData.recruiter_id || undefined,
          status: jobData.status || 'active',
          created_at: jobData.created_at || new Date().toISOString(),
          updated_at: jobData.updated_at || new Date().toISOString(),
        };
        setJob(transformedJob);
      }
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

  const checkAlreadyApplied = async (id: string) => {
    try {
      const response = await axios.get(`/job-applications/job/${id}`);

      response.data.data.forEach((element: any) => {
        if (element.applicant_id._id == localStorage.getItem('user_id')) {
          setCheck(true);
        }
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  // Utility functions for dynamic rendering
  const getExperienceLevelBadgeVariant = (
    level: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (level?.toLowerCase()) {
      case 'entry':
        return 'default';
      case 'mid':
      case 'mid_level':
      case 'intermediate':
        return 'secondary';
      case 'senior':
      case 'expert':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getUrgencyBadgeVariant = (
    urgency: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'destructive';
      case 'moderate':
      case 'medium':
        return 'secondary';
      case 'low':
      case 'normal':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatSalary = (minSalary?: number, maxSalary?: number, currency = 'INR') => {
    if (!minSalary && !maxSalary) return 'Salary not disclosed';
    if (minSalary && maxSalary) {
      return `${currency} ${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`;
    }
    if (minSalary) return `${currency} ${minSalary.toLocaleString()}+`;
    if (maxSalary) return `Up to ${currency} ${maxSalary.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(dateString));
    } catch {
      return 'Invalid date';
    }
  };

  const formatJobType = (jobType?: string) => {
    return jobType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified';
  };

  const formatArray = (items: string[] | undefined, emptyMessage = 'None specified') => {
    if (!items || !Array.isArray(items) || items.length === 0) return emptyMessage;
    return items;
  };

  useEffect(() => {
    if (id) {
      loadJobDetails();
      checkAlreadyApplied(id);
      if (isAuthenticated && user) {
        checkApplicationStatus();
      }
    }
  }, [id, loadJobDetails, checkApplicationStatus, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">Loading job details...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 md:mb-6">
          <nav className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors text-sm">
              Home
            </Link>
            <span className="hidden sm:inline">/</span>
            <Link to="/jobs" className="hover:text-blue-600 transition-colors text-sm">
              Jobs
            </Link>
            <span className="hidden sm:inline">/</span>
            <span className="text-gray-900 truncate text-sm">{job.title}</span>
          </nav>
          <Link
            to="/jobs"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm mt-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Job Header with Enhanced Info */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <Avatar className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto sm:mx-0 shadow-lg">
                    <AvatarFallback className="text-lg sm:text-xl md:text-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold">
                      {job.company_name?.substring(0, 2).toUpperCase() || 'CO'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                      {job.title}
                    </CardTitle>

                    <div className="flex flex-col gap-2 text-gray-600 text-sm md:text-base mb-4">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Building2 className="h-4 w-4 flex-shrink-0 text-blue-600" />
                        <span className="font-medium">{job.company_name}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Calendar className="h-4 w-4 flex-shrink-0 text-purple-600" />
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Enhanced Job Badges */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                      <Badge
                        variant="secondary"
                        className="text-xs sm:text-sm capitalize bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <Briefcase className="h-3 w-3 mr-1" />
                        {formatJobType(job.employment_type || job.job_type)}
                      </Badge>
                      {job.remote_allowed && (
                        <Badge
                          variant="outline"
                          className="text-xs sm:text-sm text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                        >
                          <Home className="h-3 w-3 mr-1" />
                          Remote Friendly
                        </Badge>
                      )}
                      {job.urgency_level && job.urgency_level !== 'normal' && (
                        <Badge
                          variant={getUrgencyBadgeVariant(job.urgency_level)}
                          className="text-xs sm:text-sm animate-pulse"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {formatJobType(job.urgency_level)} Hiring
                        </Badge>
                      )}
                      {job.experience_level && (
                        <Badge
                          variant={getExperienceLevelBadgeVariant(job.experience_level)}
                          className="text-xs sm:text-sm capitalize bg-purple-50 text-purple-700 border-purple-200"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {formatJobType(job.experience_level)} Level
                        </Badge>
                      )}
                      {job.job_category && (
                        <Badge
                          variant="outline"
                          className="text-xs sm:text-sm bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {job.job_category}
                        </Badge>
                      )}
                      {job.department && (
                        <Badge
                          variant="outline"
                          className="text-xs sm:text-sm bg-pink-50 text-pink-700 border-pink-200"
                        >
                          <Building className="h-3 w-3 mr-1" />
                          {job.department}
                        </Badge>
                      )}
                      {job.travel_required && (
                        <Badge
                          variant="outline"
                          className="text-xs sm:text-sm bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Travel Required
                        </Badge>
                      )}
                    </div>

                    {/* Salary Range - Prominent Display */}
                    {(job.min_salary || job.max_salary) && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-base sm:text-lg md:text-xl font-bold text-green-700">
                            {formatSalary(job.min_salary, job.max_salary, job.currency)}
                            <span className="text-xs sm:text-sm font-normal text-green-600 ml-1">
                              per annum
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced Job Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* About the Role */}
                <div className="bg-gray-50 p-3 md:p-6 rounded-lg">
                  <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-900 flex items-center gap-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    About the Role
                  </h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {job.description}
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                {/* Requirements */}
                <div className="bg-blue-50 p-3 md:p-6 rounded-lg">
                  <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    Requirements & Qualifications
                  </h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {job.requirements}
                  </div>
                </div>

                {/* Skills Section - Enhanced */}
                {job.skills_required && job.skills_required.length > 0 && (
                  <>
                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />
                    <div className="bg-purple-50 p-3 md:p-6 rounded-lg">
                      <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-900 flex items-center gap-2">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        Required Skills & Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs sm:text-sm md:text-base px-2 py-1 md:px-3 md:py-2 bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Education Requirements Section */}
                {job.education_requirements && job.education_requirements.length > 0 && (
                  <>
                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />
                    <div className="bg-indigo-50 p-4 md:p-6 rounded-lg border border-indigo-100">
                      <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-indigo-600" />
                        Education Requirements
                      </h3>
                      <div className="space-y-3">
                        {job.education_requirements.map((education: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-200 shadow-sm"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <BookOpen className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                              {education}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Certifications Section */}
                {job.certifications_required && job.certifications_required.length > 0 && (
                  <>
                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />
                    <div className="bg-orange-50 p-4 md:p-6 rounded-lg border border-orange-100">
                      <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
                        <Award className="h-6 w-6 text-orange-600" />
                        Required Certifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.certifications_required.map((certification: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex-shrink-0">
                              <Shield className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                              {certification}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800 flex items-center gap-2">
                          <Star className="h-4 w-4 text-orange-600" />
                          <strong>Note:</strong> Certifications may be obtained during employment
                          with company support.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Benefits Section - Enhanced */}
                {(job.benefits && job.benefits.length > 0) || true ? (
                  <>
                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg border border-green-100">
                      <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
                        <Heart className="h-6 w-6 text-red-500" />
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {job.benefits && job.benefits.length > 0 ? (
                          job.benefits.map((benefit: string, index: number) => {
                            // Determine icon based on benefit content
                            const getBenefitIcon = (benefit: string) => {
                              const lowerBenefit = benefit.toLowerCase();
                              if (
                                lowerBenefit.includes('health') ||
                                lowerBenefit.includes('medical') ||
                                lowerBenefit.includes('insurance')
                              ) {
                                return <HeartHandshake className="h-5 w-5 text-red-500" />;
                              }
                              if (
                                lowerBenefit.includes('car') ||
                                lowerBenefit.includes('transport') ||
                                lowerBenefit.includes('vehicle')
                              ) {
                                return <Car className="h-5 w-5 text-blue-500" />;
                              }
                              if (
                                lowerBenefit.includes('coffee') ||
                                lowerBenefit.includes('food') ||
                                lowerBenefit.includes('meal')
                              ) {
                                return <Coffee className="h-5 w-5 text-orange-500" />;
                              }
                              if (
                                lowerBenefit.includes('laptop') ||
                                lowerBenefit.includes('equipment') ||
                                lowerBenefit.includes('device')
                              ) {
                                return <Laptop className="h-5 w-5 text-purple-500" />;
                              }
                              if (
                                lowerBenefit.includes('bonus') ||
                                lowerBenefit.includes('incentive') ||
                                lowerBenefit.includes('reward')
                              ) {
                                return <Gift className="h-5 w-5 text-yellow-500" />;
                              }
                              if (
                                lowerBenefit.includes('learn') ||
                                lowerBenefit.includes('training') ||
                                lowerBenefit.includes('education')
                              ) {
                                return <GraduationCap className="h-5 w-5 text-indigo-500" />;
                              }
                              if (
                                lowerBenefit.includes('travel') ||
                                lowerBenefit.includes('vacation') ||
                                lowerBenefit.includes('leave')
                              ) {
                                return <Plane className="h-5 w-5 text-teal-500" />;
                              }
                              if (
                                lowerBenefit.includes('flexible') ||
                                lowerBenefit.includes('remote') ||
                                lowerBenefit.includes('work from home')
                              ) {
                                return <Zap className="h-5 w-5 text-green-500" />;
                              }
                              return <CheckCircle className="h-5 w-5 text-green-600" />;
                            };

                            return (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-300"
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  {getBenefitIcon(benefit)}
                                </div>
                                <span className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                                  {benefit}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          // Default benefits when none provided
                          <div></div>
                        )}
                      </div>

                      {/* Additional Benefits Note */}
                      <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 flex items-center gap-2">
                          <Star className="h-4 w-4 text-green-600" />
                          <strong>For More benefits!</strong> Contact our HR team to learn about
                          additional perks and company culture.
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Additional Info Section */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 md:p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                    {job.department && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-gray-900">{job.department}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employment Type:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {formatJobType(job.employment_type || job.job_type)}
                      </span>
                    </div>
                    {job.application_deadline && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Deadline:</span>
                        <span className="font-medium text-red-600">
                          {formatDate(job.application_deadline)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Status:</span>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {formatJobType(job.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted On:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                    {job.updated_at !== job.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(job.updated_at)}
                        </span>
                      </div>
                    )}
                    {job.travel_required && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel Required:</span>
                        <Badge variant="outline" className="bg-blue-50">
                          <MapPin className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remote Work:</span>
                      <Badge variant={job.remote_allowed ? 'default' : 'secondary'}>
                        <Wifi className="h-3 w-3 mr-1" />
                        {job.remote_allowed ? 'Allowed' : 'Not Available'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Stats - Enhanced */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-green-700">
                        Salary Range
                      </span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-green-700">
                      {job.min_salary && job.max_salary
                        ? `₹${job.min_salary.toLocaleString('en-IN')} - ₹${job.max_salary.toLocaleString('en-IN')}`
                        : 'Competitive'}
                    </span>
                    <span className="text-xs text-green-600 block">per annum</span>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Job Type</span>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {job.job_type?.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Experience</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">
                      {job.experience_required || 0} years
                    </span>
                  </div>

                  {job.experience_level && (
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium">Level</span>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {job.experience_level}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Location</span>
                    </div>
                    <span className="text-xs sm:text-sm text-right font-medium">
                      {job.location}
                    </span>
                  </div>

                  {job.application_deadline && (
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-red-700">
                          Deadline
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-red-600 text-right font-medium">
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {job.remote_allowed && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Remote work allowed</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Application Actions */}
            {localStorage.getItem('auth_token') ? (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                  {hasApplied || check ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-bold text-green-700 mb-2 text-lg">
                        Application Submitted!
                      </h3>
                      <p className="text-sm text-green-600 mb-4">
                        Your application has been successfully submitted. The recruiter will review
                        it soon.
                      </p>
                      <Link to="/jobseeker/applications" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full text-sm border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Track Application
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-blue-900 mb-2">Ready to Apply?</h3>
                        <p className="text-sm text-blue-700">Join our team and make an impact!</p>
                      </div>
                      <Button
                        className="w-full text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                        onClick={handleOpenApplicationModal}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                      {/* <Button
                        variant="outline"
                        className="w-full text-sm md:text-base border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save for Later
                      </Button> */}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-orange-900 mb-2">Join MinuteHire</h3>
                  <p className="text-sm text-orange-700 mb-4">
                    Create an account to apply for this amazing opportunity
                  </p>
                  <Link to="/login" className="w-full">
                    <Button className="w-full text-sm md:text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                      Login to Apply
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Company Info */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  About {job.company_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold text-sm sm:text-base md:text-lg">
                      {job.company_name?.substring(0, 2).toUpperCase() || 'CO'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 truncate">
                      {job.company_name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {job.recruiter_id?.full_name
                        ? `Hiring Manager: ${job.recruiter_id.full_name}`
                        : 'Verified Employer'}
                    </p>
                    {job.recruiter_id?.email && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        {job.recruiter_id.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-xs sm:text-sm text-gray-600">Industry</span>
                    <span className="text-xs sm:text-sm font-medium">Technology</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-xs sm:text-sm text-gray-600">Company Size</span>
                    <span className="text-xs sm:text-sm font-medium">50-200 employees</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Founded</span>
                    <span className="text-sm font-medium">2018</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 leading-relaxed">
                    <strong className="text-blue-900">Why work with us?</strong>
                    <br />
                    Join our innovative team and contribute to cutting-edge projects. We offer
                    excellent growth opportunities, competitive benefits, and a collaborative work
                    environment that values creativity and innovation.
                  </p>
                </div>

                {/* <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Website
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    More Jobs
                  </Button>
                </div> */}
              </CardContent>
            </Card>

            {/* Similar Jobs Teaser */}
            {/* <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Similar Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700 mb-3">
                  Found 12 similar jobs that might interest you
                </p>
                <Button
                  variant="outline"
                  className="w-full text-sm border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  View Similar Jobs
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Enhanced Application Modal */}
        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="sm:max-w-[700px] mx-4 max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl pr-8 text-blue-900">
                <Send className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Apply for {job.title}
              </DialogTitle>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                at <strong>{job.company_name}</strong> • {job.location}
              </p>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 pt-4">
              {/* Job Summary in Modal */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-blue-900">
                      {job.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-700">{job.company_name}</p>
                  </div>
                </div>
                {(job.min_salary || job.max_salary) && (
                  <p className="text-xs sm:text-sm text-blue-700">
                    <strong>Salary:</strong> ₹{job.min_salary?.toLocaleString('en-IN')} - ₹
                    {job.max_salary?.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="coverLetter"
                      className="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      Cover Letter *
                    </Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you're the perfect fit for this role..."
                      value={jobApplicationData.coverLetter}
                      onChange={e =>
                        setJobApplicationData({
                          ...jobApplicationData,
                          coverLetter: e.target.value,
                        })
                      }
                      rows={4}
                      className="mt-2 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 50 characters ({jobApplicationData.coverLetter.length}/50)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="expectedSalary"
                      className="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2"
                    >
                      Expected Salary *
                    </Label>
                    <Input
                      id="expectedSalary"
                      placeholder="e.g., ₹7.5L or 750000"
                      value={jobApplicationData.expectedSalary}
                      onChange={e =>
                        setJobApplicationData({
                          ...jobApplicationData,
                          expectedSalary: e.target.value,
                        })
                      }
                      className="mt-2 text-sm md:text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="availableFrom"
                      className="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Available From
                    </Label>
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
                      className="mt-2 text-sm md:text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <h5 className="font-semibold text-yellow-800 text-xs sm:text-sm mb-1">
                      Quick Tip
                    </h5>
                    <p className="text-xs text-yellow-700">
                      A well-written cover letter increases your chances by 40%!
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

              <div className="pt-2">
                {check ? (
                  <Button
                    onClick={handleJobApplication}
                    disabled={true}
                    className="w-full bg-gray-400 hover:bg-gray-400 text-sm md:text-base py-3"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Application Already Submitted
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleJobApplication}
                      disabled={
                        submitting ||
                        jobApplicationData.coverLetter.length < 50 ||
                        !jobApplicationData.expectedSalary
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm md:text-base py-3 shadow-lg disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      By applying, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobDetailsPage;
