
import { useState } from 'react';
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
  Briefcase
} from "lucide-react";

const Companies = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Google Inc.",
      website: "https://google.com",
      contactPerson: "John Smith",
      email: "john.smith@google.com",
      phone: "+1 555 0123",
      industry: "Technology",
      hiringRoles: ["Software Engineer", "Product Manager"],
      packageRange: "₹15-25 LPA",
      status: "Active",
      totalHires: 12
    },
    {
      id: 2,
      name: "Microsoft",
      website: "https://microsoft.com",
      contactPerson: "Sarah Johnson",
      email: "sarah.j@microsoft.com",
      phone: "+1 555 0124",
      industry: "Technology",
      hiringRoles: ["Software Developer", "Data Scientist"],
      packageRange: "₹18-30 LPA",
      status: "Active",
      totalHires: 8
    },
    {
      id: 3,
      name: "Amazon",
      website: "https://amazon.com",
      contactPerson: "Mike Wilson",
      email: "mike.w@amazon.com",
      phone: "+1 555 0125",
      industry: "E-commerce",
      hiringRoles: ["SDE-1", "Business Analyst"],
      packageRange: "₹12-20 LPA",
      status: "Inactive",
      totalHires: 15
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Technology',
    hiringRole: '',
    packageRange: '',
    description: ''
  });

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCompany = {
      id: companies.length + 1,
      ...formData,
      hiringRoles: [formData.hiringRole],
      status: 'Active',
      totalHires: 0
    };

    setCompanies([...companies, newCompany]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      website: '',
      contactPerson: '',
      email: '',
      phone: '',
      industry: 'Technology',
      hiringRole: '',
      packageRange: '',
      description: ''
    });
    
    toast.success("Company added successfully!");
  };

  const handleExportData = () => {
    const csvContent = [
      ['Company Name', 'Contact Person', 'Email', 'Industry', 'Package Range', 'Status', 'Total Hires'],
      ...filteredCompanies.map(company => [
        company.name,
        company.contactPerson,
        company.email,
        company.industry,
        company.packageRange,
        company.status,
        company.totalHires
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
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g., Google Inc."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          placeholder="https://company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
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
                          required
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
                      <Label htmlFor="description">Company Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                {companies.filter(c => c.status === 'Active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {companies.reduce((sum, c) => sum + c.totalHires, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(companies.map(c => c.industry)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Details</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Industry & Roles</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Hires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="font-medium">{company.name}</p>
                          {company.website && (
                            <div className="flex items-center text-sm text-blue-600">
                              <Globe className="h-3 w-3 mr-1" />
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{company.contactPerson}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {company.email}
                        </div>
                        {company.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {company.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {company.industry}
                        </Badge>
                        <div className="space-y-1">
                          {company.hiringRoles.map((role, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <Briefcase className="h-3 w-3 mr-1 text-gray-400" />
                              {role}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {company.packageRange}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium">{company.totalHires}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Companies;
