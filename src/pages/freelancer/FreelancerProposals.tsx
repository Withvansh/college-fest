
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { FileText, Calendar, DollarSign, Eye, X, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const FreelancerProposals = () => {
  const { user, logout } = useLocalAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const proposals = [
    {
      id: 1,
      gigTitle: 'E-commerce Website Development',
      clientName: 'TechCorp Solutions',
      proposedAmount: 2500,
      status: 'pending',
      submittedDate: '2024-01-15',
      proposalText: 'I have extensive experience in building e-commerce platforms using React and Node.js...',
      deliveryDays: 21
    },
    {
      id: 2,
      gigTitle: 'Mobile App UI/UX Design',
      clientName: 'StartupXYZ',
      proposedAmount: 1800,
      status: 'accepted',
      submittedDate: '2024-01-10',
      proposalText: 'Your project aligns perfectly with my design expertise...',
      deliveryDays: 14
    },
    {
      id: 3,
      gigTitle: 'API Integration Project',
      clientName: 'DataFlow Inc',
      proposedAmount: 800,
      status: 'rejected',
      submittedDate: '2024-01-08',
      proposalText: 'I can help you integrate multiple APIs seamlessly...',
      deliveryDays: 7
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesSearch = proposal.gigTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleWithdraw = (proposalId: number) => {
    toast.success('Proposal withdrawn successfully');
    // In real app, this would update the proposal status
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
              <p className="text-gray-600">Track your submitted proposals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/freelancer/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by project title or client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No proposals found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredProposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {proposal.gigTitle}
                      </h3>
                      <p className="text-gray-600 mb-2">Client: {proposal.clientName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Submitted: {new Date(proposal.submittedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${proposal.proposedAmount.toLocaleString()}
                        </span>
                        <span>{proposal.deliveryDays} days delivery</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 line-clamp-2">{proposal.proposalText}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Proposal
                    </Button>
                    <div className="flex space-x-2">
                      {proposal.status === 'accepted' && (
                        <Button size="sm" asChild>
                          <Link to={`/freelancer/projects/${proposal.id}`}>
                            View Project
                          </Link>
                        </Button>
                      )}
                      {proposal.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleWithdraw(proposal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProposals;
