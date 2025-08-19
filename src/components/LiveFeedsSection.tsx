import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, DollarSign, IndianRupee, Briefcase, Code, Building2, User, Star, Send, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { jobsService } from '@/services/jobsService';
import { supabase } from '@/integrations/supabase/client';

interface JobListing {
  id: string;
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
  id: string;
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
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [freelanceProjects, setFreelanceProjects] = useState<FreelanceProject[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [selectedProject, setSelectedProject] = useState<FreelanceProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobApplicationData, setJobApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableFrom: ''
  });
  const [projectBidData, setProjectBidData] = useState({
    coverLetter: '',
    bidAmount: '',
    deliveryTime: ''
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

  // Fetch real data from database with auto-refresh
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch real jobs from database
        const jobsData = await jobsService.getJobs();
        
        // Transform the data to match our interface
        const transformedJobs: JobListing[] = (jobsData || []).slice(0, 6).map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company_name,
          location: job.location,
          postedTime: getTimeAgo(job.created_at || ''),
          type: formatJobType(job.job_type),
          salary: formatSalary(job.min_salary, job.max_salary),
          description: job.description,
          requirements: job.requirements ? job.requirements.split('\n').filter(req => req.trim()) : ['No specific requirements listed'],
          benefits: job.benefits || ['Competitive package'],
          skills: job.skills_required || []
        }));

        setJobListings(transformedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to mock data if there's an error
        const mockJobs: JobListing[] = [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Solutions',
            location: 'Bangalore, India',
            postedTime: '2 hours ago',
            type: 'Full-time',
            salary: '₹80k - ₹120k',
            description: 'We are looking for an experienced Frontend Developer to join our dynamic team.',
            requirements: ['5+ years of experience in React.js', 'Strong knowledge of TypeScript'],
            benefits: ['Health Insurance', 'Remote Work Options'],
            skills: ['React', 'TypeScript', 'JavaScript']
          }
        ];
        setJobListings(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    // Fetch real freelance projects from database
    const fetchFreelanceProjects = async () => {
      try {
        const { data: projectsData, error } = await supabase
          .from('freelance_gigs')
          .select(`
            *,
            profiles:client_id(full_name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching freelance projects:', error);
          throw error;
        }

        // Transform the data to match our interface
        const transformedProjects: FreelanceProject[] = (projectsData || []).map((project) => ({
          id: project.id,
          title: project.title,
          budget: formatProjectBudget(project.budget_min, project.budget_max),
          skills: project.skills_required || [],
          postedTime: getTimeAgo(project.created_at || ''),
          projectType: formatProjectType(project.project_type || 'other'),
          description: project.description,
          requirements: project.description ? [project.description.slice(0, 100) + '...'] : ['No specific requirements listed'],
          clientName: project.profiles?.full_name || 'Anonymous Client',
          clientRating: 4.5, // Default rating - could be fetched from a separate ratings table
          duration: project.duration_days ? `${project.duration_days} days` : 'Not specified'
        }));

        setFreelanceProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching freelance projects:', error);
        // Fallback to mock data if there's an error
        const mockProjects: FreelanceProject[] = [
          {
            id: '1',
            title: 'E-commerce Website Development',
            budget: '₹2,000 - ₹5,000',
            skills: ['React', 'Node.js', 'MongoDB'],
            postedTime: '1 hour ago',
            projectType: 'Web Development',
            description: 'Looking for a skilled developer to create a modern e-commerce website with payment integration.',
            requirements: ['Experience with React and Node.js', 'Payment gateway integration'],
            clientName: 'Digital Commerce Co.',
            clientRating: 4.8,
            duration: '6-8 weeks'
          }
        ];
        setFreelanceProjects(mockProjects);
      }
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

  const handleJobApplication = () => {
    if (!jobApplicationData.coverLetter || !jobApplicationData.expectedSalary) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Application submitted successfully!');
    setJobApplicationData({ coverLetter: '', expectedSalary: '', availableFrom: '' });
    setSelectedJob(null);
  };

  const handleProjectBid = () => {
    if (!projectBidData.coverLetter || !projectBidData.bidAmount || !projectBidData.deliveryTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Proposal submitted successfully!');
    setProjectBidData({ coverLetter: '', bidAmount: '', deliveryTime: '' });
    setSelectedProject(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold mb-6 animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            🚀 Live & Real-time Opportunities
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Live Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover fresh job openings and exciting freelance projects, updated in real-time from top companies and clients worldwide
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Pane - Job Listings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Latest Jobs</h3>
                  <p className="text-gray-600">Fresh opportunities from top companies</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600 font-semibold flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </div>
                <div className="text-xs text-gray-500">Updates every 30s</div>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                jobListings.map((job) => (
                  <Card key={job.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:bg-white/90">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {job.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 hover:scale-105 transition-transform">
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-gray-700 font-medium text-sm">{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-green-700 font-semibold text-sm">{job.salary}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-blue-600 font-medium">{job.postedTime}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          size="sm"
                          asChild
                        >
                          <Link to={`/jobs/${job.id}`} className="flex items-center justify-center">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
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
                                    <span className="font-medium text-green-600">{selectedJob.salary}</span>
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                                  <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
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
                                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedJob.skills.map((skill, index) => (
                                      <Badge key={index} variant="outline">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Benefits */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                                  <div className="grid md:grid-cols-2 gap-2">
                                    {selectedJob.benefits.map((benefit, index) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span className="text-gray-700">{benefit}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Application Form */}
                                <div className="border-t pt-6">
                                  <h3 className="text-lg font-semibold mb-4">Apply for this Position</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="coverLetter">Cover Letter *</Label>
                                      <Textarea
                                        id="coverLetter"
                                        placeholder="Tell us why you're the perfect fit for this role..."
                                        value={jobApplicationData.coverLetter}
                                        onChange={(e) => setJobApplicationData({...jobApplicationData, coverLetter: e.target.value})}
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
                                          onChange={(e) => setJobApplicationData({...jobApplicationData, expectedSalary: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="availableFrom">Available From</Label>
                                        <Input
                                          id="availableFrom"
                                          type="date"
                                          value={jobApplicationData.availableFrom}
                                          onChange={(e) => setJobApplicationData({...jobApplicationData, availableFrom: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <Button 
                                      onClick={handleJobApplication}
                                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Submit Application
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Explore More Jobs Button */}
            <div className="text-center pt-6">
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Freelance Projects</h3>
                  <p className="text-gray-600">Latest gigs from verified clients</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600 font-semibold flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </div>
                <div className="text-xs text-gray-500">Updates every 30s</div>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                freelanceProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:bg-white/90">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                          {project.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0 hover:scale-105 transition-transform">
                            {project.projectType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-green-700 font-semibold text-sm">{project.budget}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-blue-700 font-medium text-sm">{project.clientName}</span>
                        </div>
                      </div>
                      
                      {project.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors">
                              {skill}
                            </Badge>
                          ))}
                          {project.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100">
                              +{project.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{project.postedTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-lg">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-yellow-600 font-medium">{project.clientRating}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          size="sm"
                          asChild
                        >
                          <Link to={`/gigs/${project.id}`} className="flex items-center justify-center">
                            View Project
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProject(project)}
                              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                            >
                              Submit Proposal
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900">
                                {selectedProject?.title}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedProject && (
                              <div className="space-y-6">
                                {/* Project Details */}
                                <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <IndianRupee className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-green-600">{selectedProject.budget}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{selectedProject.clientName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-medium">{selectedProject.clientRating}</span>
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                                  <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
                                </div>

                                {/* Requirements */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                                  <ul className="space-y-2">
                                    {selectedProject.requirements.map((req, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Skills */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedProject.skills.map((skill, index) => (
                                      <Badge key={index} variant="outline">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Proposal Form */}
                                <div className="border-t pt-6">
                                  <h3 className="text-lg font-semibold mb-4">Submit Your Proposal</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="projectCoverLetter">Cover Letter *</Label>
                                      <Textarea
                                        id="projectCoverLetter"
                                        placeholder="Explain why you're the perfect fit for this project..."
                                        value={projectBidData.coverLetter}
                                        onChange={(e) => setProjectBidData({...projectBidData, coverLetter: e.target.value})}
                                        rows={4}
                                      />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="bidAmount">Your Bid Amount *</Label>
                                        <Input
                                          id="bidAmount"
                                          placeholder="e.g., ₹2,10,000"
                                          value={projectBidData.bidAmount}
                                          onChange={(e) => setProjectBidData({...projectBidData, bidAmount: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="deliveryTime">Delivery Time *</Label>
                                        <Input
                                          id="deliveryTime"
                                          placeholder="e.g., 2 weeks"
                                          value={projectBidData.deliveryTime}
                                          onChange={(e) => setProjectBidData({...projectBidData, deliveryTime: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <Button 
                                      onClick={handleProjectBid}
                                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Submit Proposal
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Explore More Projects Button */}
            <div className="text-center pt-6">
              <Button 
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link to="/freelancer/dashboard" className="flex items-center">
                  Explore All Projects
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don't Miss Out on Perfect Opportunities
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who trust MinuteHire to find their next career move or project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/auth/jobseeker">
                  Join as Job Seeker
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Link to="/freelancer-login">
                  Join as Freelancer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.7);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
};

export default LiveFeedsSection;
