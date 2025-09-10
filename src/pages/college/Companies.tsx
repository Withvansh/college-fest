import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Search,
  Download,
  ArrowLeft,
  Users,
  Briefcase,
  Crown,
  Send,
  Eye,
  Loader2
} from "lucide-react";
import { recruiterProfileAPI, RecruiterProfile } from '@/lib/api/Recuriter';
import { companyInviteAPI } from '@/lib/api/CompanyInvite';

const Companies = () => {
  const [companies, setCompanies] = useState<RecruiterProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    full_name: '',
    email: '',
    phone: '',
    industry: 'Technology',
    hiringRole: '',
    packageRange: '',
    bio: ''
  });

  const [inviteData, setInviteData] = useState({
    companyName: '',
    contactEmail: '',
    message: 'We would like to invite your company to participate in our campus recruitment program.'
  });
  const [remainingCredits, setRemainingCredits] = useState(5);

  // Fetch companies data from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        // Get all recruiter profiles
        const recruiters = await recruiterProfileAPI.getRandomRecruiters();
        setCompanies(recruiters);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error("Failed to load companies data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newCompanyData = {
        company_name: formData.company_name,
        company_website: formData.company_website,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        package_purchased: formData.packageRange ? [formData.packageRange] : []
      };

      // Create new company profile
      const newCompany = await recruiterProfileAPI.updateProfile(newCompanyData);
      
      // Update local state
      setCompanies([...companies, newCompany]);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({
        company_name: '',
        company_website: '',
        full_name: '',
        email: '',
        phone: '',
        industry: 'Technology',
        hiringRole: '',
        packageRange: '',
        bio: ''
      });
      
      toast.success("Company added successfully!");
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error("Failed to add company");
    }
  };

  const handleInviteCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (remainingCredits <= 0) {
      toast.error("You don't have enough credits to send invites");
      return;
    }

    try {
      const response = await companyInviteAPI.sendInvite({
        companyName: inviteData.companyName,
        contactEmail: inviteData.contactEmail,
        message: inviteData.message,
        collegeId:localStorage.getItem("user_id")
      });

      setRemainingCredits(response.remainingCredits);
      setIsInviteModalOpen(false);
      setInviteData({
        companyName: '',
        contactEmail: '',
        message: 'We would like to invite your company to participate in our campus recruitment program.'
      });
      toast.success("Invitation sent successfully!");
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Company Name', 'Contact Person', 'Email', 'Industry', 'Package Range', 'Status', 'Total Hires'],
      ...filteredCompanies.map(company => [
        company.company_name,
        company.full_name,
        company.email,
        company.industry || 'Not specified',
        company.package_purchased?.join(', ') || 'Not specified',
        company.verify ? 'Active' : 'Inactive',
        '0' // This would need to come from a different API endpoint
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies-data.csv';
    a.click();
    
    toast.success("Company data exported successfully!");
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const topRecruiters = companies.filter(company => company.verify);

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-gray-600">Loading companies data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/college/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCompany} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                          id="company_name"
                          value={formData.company_name}
                          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                          placeholder="e.g., Google Inc."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company_website">Website</Label>
                        <Input
                          id="company_website"
                          type="url"
                          value={formData.company_website}
                          onChange={(e) => setFormData({...formData, company_website: e.target.value})}
                          placeholder="https://company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="full_name">Contact Person</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="contact@company.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry Type</Label>
                        <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="hiringRole">Primary Hiring Role</Label>
                        <Input
                          id="hiringRole"
                          value={formData.hiringRole}
                          onChange={(e) => setFormData({...formData, hiringRole: e.target.value})}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="packageRange">Expected Package</Label>
                        <Input
                          id="packageRange"
                          value={formData.packageRange}
                          onChange={(e) => setFormData({...formData, packageRange: e.target.value})}
                          placeholder="₹12-18 LPA"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Company Description (Optional)</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Brief description about the company..."
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                        Add Company
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Top Recruiters */}
          <div className="w-full lg:w-1/3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Top Recruiters</CardTitle>
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(100vh-250px)] overflow-y-auto">
                  {topRecruiters.length > 0 ? (
                    <div className="space-y-4 p-4">
                      {topRecruiters.map((company) => (
                        <div key={company._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{company.company_name}</h3>
                                <p className="text-sm text-gray-600">{company.industry || 'Not specified'}</p>
                                <div className="flex items-center mt-1">
                                  <Users className="h-3 w-3 mr-1 text-gray-400" />
                                  <span className="text-xs">0 hires</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(company.verify)}>
                              {company.verify ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {company.package_purchased?.join(', ') || 'Not specified'}
                            </div>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p>No top recruiters yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Company Invitation & Management */}
          <div className="w-full lg:w-2/3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Company Invitation & Management</CardTitle>
                  <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Send className="h-4 w-4 mr-2" />
                        Invite Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Invite a Company</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleInviteCompany} className="space-y-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            value={inviteData.companyName}
                            onChange={(e) => setInviteData({...inviteData, companyName: e.target.value})}
                            placeholder="e.g., Google Inc."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={inviteData.contactEmail}
                            onChange={(e) => setInviteData({...inviteData, contactEmail: e.target.value})}
                            placeholder="contact@company.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Invitation Message</Label>
                          <Textarea
                            id="message"
                            value={inviteData.message}
                            onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                            Send Invitation
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">All Companies</h2>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{companies.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {companies.filter(c => c.verify).length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        0
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Industries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(companies.map(c => c.industry).filter(Boolean)).size}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Invite Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {remainingCredits}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[calc(100vh-450px)] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Details</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((company) => (
                        <TableRow key={company._id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Building2 className="h-5 w-5 mr-3 text-gray-400" />
                              <div>
                                <p className="font-medium">{company.company_name}</p>
                                <Badge variant="secondary" className="mt-1">
                                  {company.industry || 'Not specified'}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{company.full_name}</p>
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                {company.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {company.package_purchased?.join(', ') || 'Not specified'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(company.verify)}>
                              {company.verify ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  if (remainingCredits <= 0) {
                                    toast.error("No invite credits remaining");
                                    return;
                                  }
                                  setInviteData({
                                    ...inviteData,
                                    companyName: company.company_name,
                                    contactEmail: company.email
                                  });
                                  setIsInviteModalOpen(true);
                                }}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Send Invite
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;