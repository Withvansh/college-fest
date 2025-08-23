import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { sampleDataService } from '@/services/sampleDataService';
import { Search, DollarSign, Clock, Code, User, FileText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import SubmitProposalModal from '@/components/freelancer/SubmitProposalModal';

const FreelancerDashboard = () => {
  const { user, logout } = useAuth();
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const gigsData = await sampleDataService.getSampleData();
      setGigs(gigsData);
    } catch (error) {
      console.error('Error loading gigs:', error);
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(
    gig =>
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.project_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitProposal = (gig: any) => {
    setSelectedGig(gig);
    setIsProposalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Freelancer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/freelancer/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Gigs</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gigs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹10,40,000</div>
            </CardContent>
          </Card>
        </div>

        {/* Gig Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Browse Gigs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search gigs by title, type, or skills..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button className="h-12 px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Gigs List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading gigs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGigs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No gigs found matching your criteria.</p>
                  </div>
                ) : (
                  filteredGigs.map(gig => (
                    <Card key={gig.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {gig.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="mr-4">
                                ${gig.budget_min?.toLocaleString()} - $
                                {gig.budget_max?.toLocaleString()}
                              </span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{gig.duration_days} days</span>
                            </div>
                            <Badge variant="secondary" className="mb-3">
                              {gig.project_type?.replace('-', ' ')}
                            </Badge>
                            <p className="text-gray-600 mb-3 line-clamp-2">{gig.description}</p>
                            {gig.skills_required && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {gig.skills_required
                                  .slice(0, 4)
                                  .map((skill: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                {gig.skills_required.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{gig.skills_required.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-6 flex flex-col gap-2">
                            <Button
                              onClick={() => handleSubmitProposal(gig)}
                              className="whitespace-nowrap"
                            >
                              Submit Proposal
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/gigs/${gig.id}`}>View Details</Link>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/freelancer/portfolio" className="hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                  My Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Showcase your work and attract more clients.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/freelancer/proposals" className="hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  My Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track your submitted proposals and their status.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/freelancer/earnings" className="hover:shadow-lg transition-shadow">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View your earnings and payment history.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Submit Proposal Modal */}
      <SubmitProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        gig={selectedGig}
      />
    </div>
  );
};

export default FreelancerDashboard;
