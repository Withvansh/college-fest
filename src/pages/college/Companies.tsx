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
    recruiterId: '', // Added required field
    jobRole: '',     // Added required field
    driveDate: '', 
    college_id:'',  // Added required field
    message: 'We would like to invite your company to participate in our campus recruitment program.'
  });
  
  // Initialize remainingCredits from localStorage or default to 5
  const [remainingCredits, setRemainingCredits] = useState(() => {
    const savedCredits = localStorage.getItem('inviteCredits');
    return savedCredits ? parseInt(savedCredits, 10) : 5;
  });
  
  const [selectedCompany, setSelectedCompany] = useState<RecruiterProfile | null>(null);

  // Fetch companies data from API and credits
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get all recruiter profiles
        const recruiters = await recruiterProfileAPI.getRandomRecruiters();
        setCompanies(recruiters);
        
        // Fetch remaining credits if not in localStorage
        if (!localStorage.getItem('inviteCredits')) {
          const collegeId = localStorage.getItem("user_id");
          if (collegeId) {
            const creditsResponse = await companyInviteAPI.getRemainingCredits(collegeId);
            if (creditsResponse.remainingCredits !== undefined) {
              setRemainingCredits(creditsResponse.remainingCredits);
              localStorage.setItem('inviteCredits', creditsResponse.remainingCredits.toString());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
      const college_id = localStorage.getItem("user_id") as string;
      
      const response = await companyInviteAPI.sendInviteAndCreateDrive({
        companyName: inviteData.companyName,
        contactEmail: inviteData.contactEmail,
        message: inviteData.message,
        college_id: college_id,
        recruiter_id: inviteData.recruiterId,
        job_role: inviteData.jobRole,
        drive_date: inviteData.driveDate
      });

      // Update credits in state and localStorage
      if (response.remainingCredits !== undefined) {
        setRemainingCredits(response.remainingCredits);
        localStorage.setItem('inviteCredits', response.remainingCredits.toString());
      }
      
      setIsInviteModalOpen(false);
      setInviteData({
        companyName: '',
        contactEmail: '',
        recruiterId: '',
        jobRole: '',
        driveDate: '',
        college_id:'',
        message: 'We would like to invite your company to participate in our campus recruitment program.'
      });
      setSelectedCompany(null);
      toast.success("Invitation sent successfully!");
    } catch (error: any) {
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

  const openInviteDialog = (company: RecruiterProfile) => {
    if (remainingCredits <= 0) {
      toast.error("No invite credits remaining");
      return;
    }
    
    setSelectedCompany(company);
    setInviteData({
      ...inviteData,
      companyName: company.company_name,
      contactEmail: company.email,
      recruiterId: company._id || '', // Use company ID as recruiter ID
    });
    setIsInviteModalOpen(true);
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/college/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Company Management</h1>
            </div>
            {/* Export button removed for simplicity */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Panel - Top Recruiters */}
          <div className="w-full lg:w-1/3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Top Recruiters</CardTitle>
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(100vh-250px)] overflow-y-auto">
                  {topRecruiters.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                      {topRecruiters.map((company) => (
                        <div key={company._id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <div className="bg-blue-100 p-1 sm:p-2 rounded-full">
                                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm sm:text-base">{company.company_name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">{company.industry || 'Not specified'}</p>
                                <div className="flex items-center mt-1">
                                  <Users className="h-3 w-3 mr-1 text-gray-400" />
                                  <span className="text-xs">0 hires</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(company.verify)}`}>
                              {company.verify ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="mt-2 sm:mt-3 flex items-center justify-between">
                            <div className="text-xs sm:text-sm font-medium">
                              {company.package_purchased?.join(', ') || 'Not specified'}
                            </div>
                            <Link to={`/college/company/${company._id}`}>
                              <Button size="sm" variant="outline" className="text-xs h-7 sm:h-9 sm:text-sm">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                View
                              </Button>
                            </Link> 
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6 text-center text-gray-500">
                      <Building2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base">No top recruiters yet</p>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <CardTitle className="text-lg sm:text-xl">Company Invitation & Management</CardTitle>
                  <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm h-8 sm:h-10">
                        <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Invite Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-4 sm:mx-0">
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
                          <Label htmlFor="jobRole">Job Role</Label>
                          <Input
                            id="jobRole"
                            value={inviteData.jobRole}
                            onChange={(e) => setInviteData({...inviteData, jobRole: e.target.value})}
                            placeholder="e.g., Software Engineer"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="driveDate">Drive Date</Label>
                          <Input
                            id="driveDate"
                            type="date"
                            value={inviteData.driveDate}
                            onChange={(e) => setInviteData({...inviteData, driveDate: e.target.value})}
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
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">All Companies</h2>
                    <div className="relative w-full sm:w-auto">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <Card className="text-center">
                    <CardHeader className="pb-2 py-3 sm:py-4">
                      <CardTitle className="text-xs sm:text-sm font-medium">Total Companies</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-3 sm:py-4">
                      <div className="text-lg sm:text-2xl font-bold">{companies.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardHeader className="pb-2 py-3 sm:py-4">
                      <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-3 sm:py-4">
                      <div className="text-lg sm:text-2xl font-bold text-green-600">
                        {companies.filter(c => c.verify).length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardHeader className="pb-2 py-3 sm:py-4">
                      <CardTitle className="text-xs sm:text-sm font-medium">Total Hires</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-3 sm:py-4">
                      <div className="text-lg sm:text-2xl font-bold text-blue-600">
                        0
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardHeader className="pb-2 py-3 sm:py-4">
                      <CardTitle className="text-xs sm:text-sm font-medium">Industries</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-3 sm:py-4">
                      <div className="text-lg sm:text-2xl font-bold text-purple-600">
                        {new Set(companies.map(c => c.industry).filter(Boolean)).size}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardHeader className="pb-2 py-3 sm:py-4">
                      <CardTitle className="text-xs sm:text-sm font-medium">Invite Credits</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-3 sm:py-4">
                      <div className="text-lg sm:text-2xl font-bold text-orange-600">
                        {remainingCredits}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[calc(100vh-450px)] overflow-y-auto">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Company Details</TableHead>
                          <TableHead className="whitespace-nowrap">Contact Information</TableHead>
                          <TableHead className="whitespace-nowrap">Package</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCompanies.map((company) => (
                          <TableRow key={company._id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                                <div>
                                  <p className="font-medium text-sm sm:text-base">{company.company_name}</p>
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {company.industry || 'Not specified'}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-xs sm:text-sm">{company.full_name}</p>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {company.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {company.package_purchased?.join(', ') || 'Not specified'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${getStatusColor(company.verify)}`}>
                                {company.verify ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                                <Link to={`/college/company/${company._id}`}>
                                  <Button size="sm" variant="outline" className="text-xs h-7 w-full sm:w-auto sm:h-9 sm:text-sm">
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    View
                                  </Button>
                                </Link> 
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs h-7 w-full sm:w-auto sm:h-9 sm:text-sm"
                                  onClick={() => openInviteDialog(company)}
                                  disabled={remainingCredits <= 0}
                                >
                                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  Invite
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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