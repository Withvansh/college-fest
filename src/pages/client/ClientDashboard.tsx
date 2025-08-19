
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import FreelancerProfileModal from "@/components/client/FreelancerProfileModal";
import { 
  DollarSign, 
  Star, 
  Clock, 
  Briefcase, 
  TrendingUp, 
  Eye,
  MessageSquare,
  FileText,
  PlusCircle,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Search,
  Users,
  Filter
} from "lucide-react";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // ✅ Now inside the component
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [acceptedProposals, setAcceptedProposals] = useState(new Set());
  const activeProjects = [
    {
      id: 1,
      title: "E-commerce Website Development",
      freelancer: "Alex Johnson",
      budget: "₹2,10,000",
      deadline: "Dec 30, 2024",
      progress: 75,
      status: "In Progress",
      milestones: 3,
      completedMilestones: 2
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      freelancer: "Sarah Wilson",
      budget: "₹1,51,000",
      deadline: "Jan 15, 2025",
      progress: 40,
      status: "In Progress",
      milestones: 4,
      completedMilestones: 1
    }
  ];

  const receivedProposals = [
    {
      id: 1,
      projectTitle: "React.js Dashboard Development",
      freelancer: {
        id: 1,
        name: "Mike Chen",
        avatar: "/api/placeholder/100/100",
        title: "Senior React Developer",
        rating: 4.8,
        reviews: 127,
        hourlyRate: 85,
        skills: ["React", "TypeScript", "Node.js", "MongoDB", "GraphQL"],
        bio: "Experienced full-stack developer with 8+ years of expertise in React, Node.js, and modern web technologies. I specialize in building scalable web applications and have worked with 50+ clients worldwide.",
        completedProjects: 89,
        successRate: 98,
        location: "San Francisco, CA"
      },
      bidAmount: "₹1,00,000",
      proposals: 12,
      coverLetter: "I have 5+ years of experience in React.js development and have built numerous dashboards for enterprise clients. I can deliver this project within 2 weeks with clean, maintainable code.",
      timeline: "2 weeks"
    },
    {
      id: 2,
      projectTitle: "Logo Design for Startup",
      freelancer: {
        id: 2,
        name: "Emma Davis",
        avatar: "/api/placeholder/100/100",
        title: "Creative Designer & Brand Strategist",
        rating: 4.9,
        reviews: 203,
        hourlyRate: 65,
        skills: ["Logo Design", "Branding", "Illustrator", "Photoshop", "Figma"],
        bio: "Award-winning designer with 6+ years of experience creating memorable brand identities. I've helped 100+ startups and established companies build their visual presence.",
        completedProjects: 156,
        successRate: 99,
        location: "New York, NY"
      },
      bidAmount: "₹37,600",
      proposals: 8,
      coverLetter: "I specialize in minimalist logo designs that capture brand essence. My approach involves thorough research and multiple concept iterations to ensure the perfect fit for your startup.",
      timeline: "5 days"
    }
  ];

  const handleAcceptProposal = (proposalId, freelancerName) => {
    setAcceptedProposals(prev => new Set([...prev, proposalId]));
    toast({
      title: "Proposal Accepted!",
      description: `You have successfully hired ${freelancerName}. They will be notified and can start working on your project.`,
    });
  };

  const handleViewProfile = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Client Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/client/chat')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/client/post-gig')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Post New Gig
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your projects and find talented freelancers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹20,66,000</div>
              <p className="text-blue-100 text-sm">Across 15 projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-green-100 text-sm">3 completing soon</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Freelancers Hired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-purple-100 text-sm">4.8/5 avg rating</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-orange-100 text-sm">Project completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Active Projects</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="gigs">My Gigs</TabsTrigger>
            <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
          </TabsList>

          {/* Active Projects */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="grid gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>Freelancer: {project.freelancer}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-semibold text-blue-600">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-semibold">{project.deadline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Milestones</p>
                        <p className="font-semibold">{project.completedMilestones}/{project.milestones}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate('/client/chat')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => navigate(`/client/gig/${project.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Proposals */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Received Proposals</h2>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-6">
              {receivedProposals.map((proposal) => (
                <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{proposal.projectTitle}</CardTitle>
                        <CardDescription>From: {proposal.freelancer.name}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{proposal.freelancer.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Bid Amount</p>
                          <p className="font-semibold text-green-600 text-lg">{proposal.bidAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Timeline</p>
                          <p className="font-semibold">{proposal.timeline}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Proposals</p>
                          <p className="font-semibold">{proposal.proposals} received</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Cover Letter</p>
                        <p className="text-gray-700 italic">{proposal.coverLetter}</p>
                      </div>

                      <div className="flex space-x-3">
                        {acceptedProposals.has(proposal.id) ? (
                          <Button size="sm" disabled className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepted
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptProposal(proposal.id, proposal.freelancer.name)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate('/client/chat')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProfile(proposal.freelancer)}
                        >
                          View Profile
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Gigs */}
          <TabsContent value="gigs" className="space-y-6">
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Your Gigs</h3>
              <p className="text-gray-600 mb-6">Create and manage your project postings</p>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/client/post-gig')}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Post New Gig
              </Button>
            </div>
          </TabsContent>

          {/* Freelancers */}
          <TabsContent value="freelancers" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Freelancers</h3>
              <p className="text-gray-600 mb-6">Browse and hire talented freelancers</p>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/client/browse-freelancers')}
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Freelancers
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Freelancer Profile Modal */}
      {selectedFreelancer && (
        <FreelancerProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedFreelancer(null);
          }}
          freelancer={selectedFreelancer}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
