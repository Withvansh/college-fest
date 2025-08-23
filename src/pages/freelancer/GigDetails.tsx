import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, DollarSign, Clock, User, Calendar, Send, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const GigDetails = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    proposedAmount: '',
    deliveryDays: '',
  });

  // Mock gig data - in real app, this would be fetched based on ID
  const gig = {
    id: id,
    title: 'Full-Stack E-commerce Website Development',
    description: `We are looking for an experienced full-stack developer to build a comprehensive e-commerce website from scratch. 

The project includes:
- Modern, responsive frontend using React/Next.js
- Robust backend API with Node.js/Express
- Database design and implementation (MongoDB/PostgreSQL)
- Payment gateway integration (Stripe/PayPal)
- Admin dashboard for inventory management
- User authentication and authorization
- Shopping cart and checkout functionality
- Order tracking and management system
- Email notifications
- SEO optimization

The ideal candidate should have:
- 3+ years of full-stack development experience
- Proven experience with e-commerce platforms
- Strong portfolio with similar projects
- Excellent communication skills
- Ability to work independently and meet deadlines

This is a great opportunity to work on a comprehensive project that will showcase your full-stack capabilities.`,
    budget_min: 2000,
    budget_max: 4000,
    duration_days: 45,
    client: {
      name: 'TechCorp Solutions',
      rating: 4.8,
      projectsCompleted: 23,
      memberSince: '2022',
    },
    skills_required: [
      'React',
      'Node.js',
      'MongoDB',
      'Express',
      'Stripe',
      'JavaScript',
      'CSS',
      'HTML',
    ],
    posted_date: '2024-01-20',
    proposals_count: 12,
    project_type: 'web-development',
    status: 'open',
  };

  const relatedGigs = [
    {
      id: 2,
      title: 'React Dashboard Development',
      budget_min: 800,
      budget_max: 1500,
      duration_days: 21,
      skills_required: ['React', 'TypeScript', 'Chart.js'],
    },
    {
      id: 3,
      title: 'API Integration Project',
      budget_min: 500,
      budget_max: 1000,
      duration_days: 14,
      skills_required: ['Node.js', 'REST API', 'MongoDB'],
    },
  ];

  const handleSubmitProposal = async () => {
    if (!proposalData.coverLetter || !proposalData.proposedAmount || !proposalData.deliveryDays) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseInt(proposalData.proposedAmount);
    if (amount < gig.budget_min || amount > gig.budget_max) {
      toast.error(`Proposed amount must be between $${gig.budget_min} and $${gig.budget_max}`);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Proposal submitted successfully!');
      setIsSubmitting(false);
      setProposalData({ coverLetter: '', proposedAmount: '', deliveryDays: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4">
                <Link to="/freelancer/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gig Details</h1>
                <p className="text-gray-600">Review project requirements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{gig.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />${gig.budget_min.toLocaleString()} -
                        ${gig.budget_max.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {gig.duration_days} days
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted {new Date(gig.posted_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {gig.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {gig.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gig.skills_required.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Gigs */}
            <Card>
              <CardHeader>
                <CardTitle>Related Gigs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedGigs.map(relatedGig => (
                    <div key={relatedGig.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium mb-2">{relatedGig.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>
                              ${relatedGig.budget_min} - ${relatedGig.budget_max}
                            </span>
                            <span>{relatedGig.duration_days} days</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {relatedGig.skills_required.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/gigs/${relatedGig.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Client Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{gig.client.name}</h4>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">
                        {gig.client.rating} ({gig.client.projectsCompleted} projects)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Member since {gig.client.memberSince}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proposals</span>
                    <span className="font-medium">{gig.proposals_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">
                      ${gig.budget_min.toLocaleString()} - ${gig.budget_max.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{gig.duration_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Type</span>
                    <span className="font-medium">{gig.project_type.replace('-', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Proposal */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Proposal</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Proposal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Submit Your Proposal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cover Letter *</label>
                        <Textarea
                          value={proposalData.coverLetter}
                          onChange={e =>
                            setProposalData({ ...proposalData, coverLetter: e.target.value })
                          }
                          placeholder="Explain why you're the best fit for this project..."
                          rows={6}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Proposed Amount ($) *
                          </label>
                          <Input
                            type="number"
                            value={proposalData.proposedAmount}
                            onChange={e =>
                              setProposalData({ ...proposalData, proposedAmount: e.target.value })
                            }
                            placeholder={`${gig.budget_min} - ${gig.budget_max}`}
                            min={gig.budget_min}
                            max={gig.budget_max}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Budget range: ${gig.budget_min.toLocaleString()} - $
                            {gig.budget_max.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Delivery Time (days) *
                          </label>
                          <Input
                            type="number"
                            value={proposalData.deliveryDays}
                            onChange={e =>
                              setProposalData({ ...proposalData, deliveryDays: e.target.value })
                            }
                            placeholder={`Max ${gig.duration_days} days`}
                            max={gig.duration_days}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                        <Button onClick={handleSubmitProposal} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Proposal
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
