import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Clock,
  IndianRupee,
  Briefcase,
  Code,
  Building2,
  User,
  Star,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle,
  LogIn,
} from 'lucide-react';
import { toast } from 'sonner';
import { jobsService } from '@/services/jobsService';
import { applicationsApi } from '@/lib/api/applications';
import { useAuth } from '@/hooks/useAuth';

interface JobListing {
  _id: string;
  title: string;
  company: string;
  location: string;
  postedTime: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
}

interface FreelanceProject {
  _id: string;
  title: string;
  budget: string;
  skills: string[];
  postedTime: string;
  projectType: string;
  description: string;
  requirements: string[];
  clientName: string;
  clientRating: number;
  duration: string;
}

const LiveFeedsSection = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [freelanceProjects, setFreelanceProjects] = useState<FreelanceProject[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [selectedProject, setSelectedProject] = useState<FreelanceProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [jobApplicationData, setJobApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
  });
  const [projectBidData, setProjectBidData] = useState({
    coverLetter: '',
    bidAmount: '',
    deliveryTime: '',
  });

  // Helper functions
  const formatSalary = (min: number | null, max: number | null) => {
    if (min && max) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    } else if (min) {
      return `₹${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ₹${max.toLocaleString()}`;
    }
    return 'Salary negotiable';
  };

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatProjectBudget = (min: number | null, max: number | null) => {
    if (min && max) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    } else if (min) {
      return `₹${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ₹${max.toLocaleString()}`;
    }
    return 'Budget negotiable';
  };

  const formatProjectType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Fetch user's applied jobs
  const fetchAppliedJobs = async () => {
    if (!isAuthenticated || !user?._id) return;

    try {
      
      const response = await applicationsApi.getApplications(user._id);
    

      // Use the same structure as JobSeekerApplications
      const userApplications = (response as any)?.data || response;
     

      if (Array.isArray(userApplications)) {
        const appliedJobIds = new Set(
          userApplications
            .map((app: any) => {
              // Get job ID from the populated job_id field
              const jobId = app.job_id?._id || app.job_id;
              
              return jobId;
            })
            .filter(Boolean)
        );

        setAppliedJobs(appliedJobIds);
      } else {
        console.log('No applications found or invalid format');
        setAppliedJobs(new Set());
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      setAppliedJobs(new Set());
    }
  };

  // Fetch real data from database with auto-refresh
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch real jobs from database
        const jobsData = await jobsService.getJobs();

        // Transform the data to match our interface
        const transformedJobs: JobListing[] = (jobsData || []).slice(0, 6).map(job => ({
          _id: job._id,
          title: job.title,
          company: (job as any).company_name || job.company,
          location: job.location,
          postedTime: getTimeAgo(job.created_at || ''),
          type: formatJobType((job as any).job_type || job.job_type),
          salary: formatSalary((job as any).min_salary, (job as any).max_salary),
          description: job.description,
          requirements: (job as any).requirements
            ? typeof (job as any).requirements === 'string'
              ? (job as any).requirements.split('\n').filter((req: string) => req.trim())
              : job.requirements
            : ['No specific requirements listed'],
          benefits: (job as any).benefits || ['Competitive package'],
          skills: (job as any).skills_required || job.skills_required || [],
        }));

        setJobListings(transformedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to mock data if there's an error
        const mockJobs: JobListing[] = [
          {
            _id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Solutions',
            location: 'Bangalore, India',
            postedTime: '2 hours ago',
            type: 'Full-time',
            salary: '₹80k - ₹120k',
            description:
              'We are looking for an experienced Frontend Developer to join our dynamic team.',
            requirements: ['5+ years of experience in React.js', 'Strong knowledge of TypeScript'],
            benefits: ['Health Insurance', 'Remote Work Options'],
            skills: ['React', 'TypeScript', 'JavaScript'],
          },
        ];
        setJobListings(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    // Mock freelance projects data
    const fetchFreelanceProjects = async () => {
      const mockProjects: FreelanceProject[] = [
        {
          _id: '1',
          title: 'E-commerce Website Development',
          budget: '₹2,000 - ₹5,000',
          skills: ['React', 'Node.js', 'MongoDB'],
          postedTime: '1 hour ago',
          projectType: 'Web Development',
          description:
            'Looking for a skilled developer to create a modern e-commerce website with payment integration.',
          requirements: ['Experience with React and Node.js', 'Payment gateway integration'],
          clientName: 'Digital Commerce Co.',
          clientRating: 4.8,
          duration: '6-8 weeks',
        },
      ];
      setFreelanceProjects(mockProjects);
    };

    // Fetch freelance projects
    fetchFreelanceProjects();

    // Initial load
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
      fetchFreelanceProjects();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch applied jobs when user changes
  useEffect(() => {
    fetchAppliedJobs();
  }, [isAuthenticated, user]);

  const handleJobApplication = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to apply for jobs');
      navigate('/auth/jobseeker');
      return;
    }

    if (!jobApplicationData.coverLetter || !jobApplicationData.expectedSalary) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedJob) return;

    try {
      setApplying(true);
      console.log('Applying to job:', selectedJob._id);

      // Submit application to backend
      const applicationData = {
        job_id: selectedJob._id,
        applicant_id: user._id,
        cover_letter: jobApplicationData.coverLetter,
        expected_salary: parseInt(jobApplicationData.expectedSalary.replace(/[₹,]/g, '')),
        available_from: jobApplicationData.availableFrom || null,
      };

      console.log('Application data:', applicationData);
      const response = await applicationsApi.applyToJob(applicationData);
      console.log('Application response:', response);

      // Update applied jobs state immediately
      setAppliedJobs(prev => {
        const newSet = new Set([...prev, selectedJob._id]);
        console.log('Updated applied jobs after application:', Array.from(newSet));
        return newSet;
      });

      toast.success('Application submitted successfully! You can view it in your dashboard.');
      setJobApplicationData({ coverLetter: '', expectedSalary: '', availableFrom: '' });
      setSelectedJob(null);

      // Refresh applied jobs from server to ensure consistency
      setTimeout(() => {
        fetchAppliedJobs();
      }, 1000);
    } catch (error: any) {
      console.error('Error applying to job:', error);
      if (error.response?.status === 409 || error.message?.includes('already applied')) {
        toast.error('You have already applied to this job');
        // Add to applied jobs if it's a duplicate application error
        setAppliedJobs(prev => new Set([...prev, selectedJob._id]));
      } else if (error.response?.status === 400) {
        toast.error('Invalid application data. Please check your inputs.');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleProjectBid = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to submit proposals');
      navigate('/auth/jobseeker'); // or '/freelancer-login' depending on your routes
      return;
    }

    if (!projectBidData.coverLetter || !projectBidData.bidAmount || !projectBidData.deliveryTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedProject) return;

    try {
      setApplying(true); // You might want to add a separate state for project proposals
      console.log('Submitting proposal for project:', selectedProject._id);

      // For now, we'll create a proposal entry similar to job applications
      // You might want to create a separate proposals API endpoint
      const proposalData = {
        project_id: selectedProject._id,
        freelancer_id: user._id,
        cover_letter: projectBidData.coverLetter,
        bid_amount: parseInt(projectBidData.bidAmount.replace(/[₹,]/g, '')),
        delivery_time: projectBidData.deliveryTime,
        status: 'submitted',
      };

      console.log('Proposal data:', proposalData);

      // You'll need to create this API endpoint for freelance proposals
      // const response = await proposalsApi.submitProposal(proposalData);
      // For now, we'll simulate success

      toast.success('Proposal submitted successfully! You can view it in your dashboard.');
      setProjectBidData({ coverLetter: '', bidAmount: '', deliveryTime: '' });
      setSelectedProject(null);
    } catch (error: any) {
      console.error('Error submitting proposal:', error);
      toast.error('Failed to submit proposal. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleViewDetails = (jobId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to view job details');
      navigate('/auth/jobseeker');
      return;
    }
    navigate(`/jobs/${jobId}`);
  };

  const handleViewProject = (projectId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to view project details');
      navigate('/freelancer-login');
      return;
    }
    navigate(`/gigs/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm text-blue-700 text-sm font-semibold mb-6 animate-fade-in border border-blue-200/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
            <Sparkles className="w-4 h-4 mr-2" />
            Live & Real-time Opportunities
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            Live Opportunities
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover fresh job openings and exciting freelance projects, updated in real-time from
            top companies and clients worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Pane - Job Listings */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Latest Jobs</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Fresh opportunities from top companies
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm text-emerald-600 font-semibold flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </div>
                <div className="text-xs text-gray-500">Updates every 30s</div>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto scrollbar-hide space-y-4 sm:space-y-6 pr-2">
              <style>{`
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {loading ? (
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 animate-pulse border border-gray-200/50"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                jobListings.map(job => {
                  const isApplied = appliedJobs.has(job._id);
                  console.log(`Job ${job._id} (${job.title}) applied status:`, isApplied); // Debug log
                  console.log('Applied jobs set:', Array.from(appliedJobs)); // Debug log

                  return (
                    <Card
                      key={job._id}
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:bg-white/95 hover:border-blue-200/50"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {job.title}
                          </h4>
                          <div className="flex gap-2">
                            <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 hover:scale-105 transition-transform self-start">
                              {job.type}
                            </Badge>
                            {isApplied && (
                              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Applied
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm">{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                              <IndianRupee className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-emerald-700 font-semibold text-sm">
                              {job.salary}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-600 font-medium">{job.postedTime}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          {isAuthenticated ? (
                            <Button
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              size="sm"
                              onClick={() => handleViewDetails(job._id)}
                            >
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button
                              className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg transition-all duration-300"
                              size="sm"
                              onClick={() => {
                                toast.error('Please login to view details');
                                navigate('/auth/jobseeker');
                              }}
                            >
                              <LogIn className="w-4 h-4 mr-2" />
                              Login to View
                            </Button>
                          )}

                          {isAuthenticated ? (
                            isApplied ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="border-2 border-green-200 text-green-600 bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Already Applied
                              </Button>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedJob(job)}
                                    className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                                  >
                                    Apply Now
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">
                                      {selectedJob?.title}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedJob && (
                                    <div className="space-y-6">
                                      {/* Job Details */}
                                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                          <Building2 className="h-4 w-4 text-gray-500" />
                                          <span className="font-medium">{selectedJob.company}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <MapPin className="h-4 w-4 text-gray-500" />
                                          <span>{selectedJob.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <IndianRupee className="h-4 w-4 text-gray-500" />
                                          <span className="font-medium text-green-600">
                                            {selectedJob.salary}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                          Job Description
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                          {selectedJob.description}
                                        </p>
                                      </div>

                                      {/* Requirements */}
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                                        <ul className="space-y-2">
                                          {selectedJob.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                              <span className="text-gray-700">{req}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Skills */}
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                          Required Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedJob.skills.map((skill, index) => (
                                            <Badge key={index} variant="outline">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Benefits */}
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                                        <div className="grid md:grid-cols-2 gap-2">
                                          {selectedJob.benefits.map((benefit, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center space-x-2"
                                            >
                                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                              <span className="text-gray-700">{benefit}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Application Form */}
                                      <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold mb-4">
                                          Apply for this Position
                                        </h3>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="coverLetter">Cover Letter *</Label>
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
                                            />
                                          </div>
                                          <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                              <Label htmlFor="expectedSalary">
                                                Expected Salary *
                                              </Label>
                                              <Input
                                                id="expectedSalary"
                                                placeholder="e.g., 750000"
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
                                          <Button
                                            onClick={handleJobApplication}
                                            disabled={applying}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                          >
                                            <Send className="w-4 h-4 mr-2" />
                                            {applying ? 'Submitting...' : 'Submit Application'}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            )
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast.error('Please login to apply');
                                navigate('/auth/jobseeker');
                              }}
                              className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                              <LogIn className="w-4 h-4 mr-2" />
                              Login to Apply
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Explore More Jobs Button */}
            <div className="text-center pt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link to="/jobs" className="flex items-center">
                  Explore All Jobs
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Pane - Freelance Projects */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Code className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Freelance Projects
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Latest gigs from verified clients
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm text-emerald-600 font-semibold flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </div>
                <div className="text-xs text-gray-500">Updates every 30s</div>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto scrollbar-hide space-y-4 sm:space-y-6 pr-2">
              {loading ? (
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 animate-pulse border border-gray-200/50"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                //   (
                //   freelanceProjects.map(project => (
                //     <Card
                //       key={project._id}
                //       className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:bg-white/95 hover:border-purple-200/50"
                //     >
                //       <CardContent className="p-4 sm:p-6">
                //         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                //           <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                //             {project.title}
                //           </h4>
                //           <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0 hover:scale-105 transition-transform self-start">
                //             {project.projectType}
                //           </Badge>
                //         </div>

                //         <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                //           <div className="flex items-center space-x-2">
                //             <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                //               <IndianRupee className="h-4 w-4 text-emerald-600" />
                //             </div>
                //             <span className="text-emerald-700 font-semibold text-sm">
                //               {project.budget}
                //             </span>
                //           </div>
                //           <div className="flex items-center space-x-2">
                //             <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                //               <User className="h-4 w-4 text-blue-600" />
                //             </div>
                //             <span className="text-blue-700 font-medium text-sm">
                //               {project.clientName}
                //             </span>
                //           </div>
                //         </div>

                //         {project.skills.length > 0 && (
                //           <div className="flex flex-wrap gap-2 mb-4">
                //             {project.skills.slice(0, 3).map((skill, index) => (
                //               <Badge
                //                 key={index}
                //                 variant="secondary"
                //                 className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors"
                //               >
                //                 {skill}
                //               </Badge>
                //             ))}
                //             {project.skills.length > 3 && (
                //               <Badge variant="secondary" className="text-xs bg-gray-100">
                //                 +{project.skills.length - 3} more
                //               </Badge>
                //             )}
                //           </div>
                //         )}

                //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600 mb-4">
                //           <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                //             <Clock className="h-4 w-4 text-gray-500" />
                //             <span>{project.postedTime}</span>
                //           </div>
                //           <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-lg">
                //             <Star className="h-4 w-4 text-yellow-500 fill-current" />
                //             <span className="text-yellow-600 font-medium">
                //               {project.clientRating}
                //             </span>
                //           </div>
                //         </div>

                //         <div className="flex flex-col sm:flex-row gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                //           {isAuthenticated ? (
                //             <Button
                //               className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                //               size="sm"
                //               onClick={() => handleViewProject(project._id)}
                //             >
                //               View Project
                //               <ArrowRight className="w-4 h-4 ml-2" />
                //             </Button>
                //           ) : (
                //             <Button
                //               className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg transition-all duration-300"
                //               size="sm"
                //               onClick={() => {
                //                 toast.error('Please login to view project details');
                //                 navigate('/freelancer-login');
                //               }}
                //             >
                //               <LogIn className="w-4 h-4 mr-2" />
                //               Login to View
                //             </Button>
                //           )}

                //           {isAuthenticated ? (
                //             <Dialog>
                //               <DialogTrigger asChild>
                //                 <Button
                //                   variant="outline"
                //                   size="sm"
                //                   onClick={() => setSelectedProject(project)}
                //                   className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                //                 >
                //                   Submit Proposal
                //                 </Button>
                //               </DialogTrigger>
                //               <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                //                 <DialogHeader>
                //                   <DialogTitle className="text-2xl font-bold text-gray-900">
                //                     {selectedProject?.title}
                //                   </DialogTitle>
                //                 </DialogHeader>
                //                 {selectedProject && (
                //                   <div className="space-y-6">
                //                     {/* Project Details */}
                //                     <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                //                       <div className="flex items-center space-x-2">
                //                         <IndianRupee className="h-4 w-4 text-gray-500" />
                //                         <span className="font-medium text-green-600">
                //                           {selectedProject.budget}
                //                         </span>
                //                       </div>
                //                       <div className="flex items-center space-x-2">
                //                         <User className="h-4 w-4 text-gray-500" />
                //                         <span className="font-medium">
                //                           {selectedProject.clientName}
                //                         </span>
                //                       </div>
                //                       <div className="flex items-center space-x-2">
                //                         <Star className="h-4 w-4 text-yellow-500 fill-current" />
                //                         <span className="font-medium">
                //                           {selectedProject.clientRating}
                //                         </span>
                //                       </div>
                //                     </div>

                //                     {/* Description */}
                //                     <div>
                //                       <h3 className="text-lg font-semibold mb-3">
                //                         Project Description
                //                       </h3>
                //                       <p className="text-gray-700 leading-relaxed">
                //                         {selectedProject.description}
                //                       </p>
                //                     </div>

                //                     {/* Requirements */}
                //                     <div>
                //                       <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                //                       <ul className="space-y-2">
                //                         {selectedProject.requirements.map((req, index) => (
                //                           <li key={index} className="flex items-start space-x-2">
                //                             <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                //                             <span className="text-gray-700">{req}</span>
                //                           </li>
                //                         ))}
                //                       </ul>
                //                     </div>

                //                     {/* Skills */}
                //                     <div>
                //                       <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                //                       <div className="flex flex-wrap gap-2">
                //                         {selectedProject.skills.map((skill, index) => (
                //                           <Badge key={index} variant="outline">
                //                             {skill}
                //                           </Badge>
                //                         ))}
                //                       </div>
                //                     </div>

                //                     {/* Proposal Form */}
                //                     <div className="border-t pt-6">
                //                       <h3 className="text-lg font-semibold mb-4">
                //                         Submit Your Proposal
                //                       </h3>
                //                       <div className="space-y-4">
                //                         <div>
                //                           <Label htmlFor="projectCoverLetter">Cover Letter *</Label>
                //                           <Textarea
                //                             id="projectCoverLetter"
                //                             placeholder="Explain why you're the perfect fit for this project..."
                //                             value={projectBidData.coverLetter}
                //                             onChange={e =>
                //                               setProjectBidData({
                //                                 ...projectBidData,
                //                                 coverLetter: e.target.value,
                //                               })
                //                             }
                //                             rows={4}
                //                           />
                //                         </div>
                //                         <div className="grid md:grid-cols-2 gap-4">
                //                           <div>
                //                             <Label htmlFor="bidAmount">Your Bid Amount *</Label>
                //                             <Input
                //                               id="bidAmount"
                //                               placeholder="e.g., ₹2,10,000"
                //                               value={projectBidData.bidAmount}
                //                               onChange={e =>
                //                                 setProjectBidData({
                //                                   ...projectBidData,
                //                                   bidAmount: e.target.value,
                //                                 })
                //                               }
                //                             />
                //                           </div>
                //                           <div>
                //                             <Label htmlFor="deliveryTime">Delivery Time *</Label>
                //                             <Input
                //                               id="deliveryTime"
                //                               placeholder="e.g., 2 weeks"
                //                               value={projectBidData.deliveryTime}
                //                               onChange={e =>
                //                                 setProjectBidData({
                //                                   ...projectBidData,
                //                                   deliveryTime: e.target.value,
                //                                 })
                //                               }
                //                             />
                //                           </div>
                //                         </div>
                //                         <Button
                //                           onClick={handleProjectBid}
                //                           className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                //                         >
                //                           <Send className="w-4 h-4 mr-2" />
                //                           Submit Proposal
                //                         </Button>
                //                       </div>
                //                     </div>
                //                   </div>
                //                 )}
                //               </DialogContent>
                //             </Dialog>
                //           ) : (
                //             <Button
                //               variant="outline"
                //               size="sm"
                //               onClick={() => {
                //                 toast.error('Please login to submit proposal');
                //                 navigate('/freelancer-login');
                //               }}
                //               className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                //             >
                //               <LogIn className="w-4 h-4 mr-2" />
                //               Login to Apply
                //             </Button>
                //           )}
                //         </div>
                //       </CardContent>
                //     </Card>
                //   ))
                // )}

                //coming soon card
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 max-w-md mx-auto shadow-lg shadow-gray-900/5 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
                </div>
              )}
              
            </div>

            {/* Explore More Projects Button */}
            {/* 
            <div className="text-center pt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link to="/freelancer/dashboard" className="flex items-center">
                  Explore All Projects
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            */}
            <div className="text-center pt-6">
              <Button
                disabled
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg cursor-not-allowed flex items-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
        {!isAuthenticated && (
          <div className="text-center mt-12 sm:mt-16 lg:mt-20 ">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/50 max-w-4xl mx-auto shadow-xl shadow-gray-900/5">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Don't Miss Out on Perfect Opportunities
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Join thousands of professionals who trust MinuteHire to find their next career move
                or project
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/auth/jobseeker">Join as Job Seeker</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-gray-400 px-6 sm:px-8 py-3 rounded-xl transition-all duration-300 bg-transparent"
                >
                  <Link to="/freelancer-login">Join as Freelancer</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFeedsSection;
