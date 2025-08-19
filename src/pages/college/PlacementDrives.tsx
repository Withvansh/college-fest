
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
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Calendar, 
  Building2, 
  Users, 
  Filter,
  Download,
  Edit,
  Eye,
  ArrowLeft,
  Search,
  Trash2,
  Clock,
  MapPin,
  GraduationCap
} from "lucide-react";

interface PlacementDrive {
  id: number;
  title: string;
  company: string;
  role: string;
  date: string;
  time: string;
  eligibility: string;
  mode: string;
  registrations: number;
  status: string;
  lastDate: string;
  description?: string;
  location?: string;
  package?: string;
  requirements?: string;
}

const PlacementDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<PlacementDrive[]>([
    {
      id: 1,
      title: "Google Software Engineer Drive",
      company: "Google Inc.",
      role: "Software Engineer",
      date: "2025-01-15",
      time: "10:00",
      eligibility: "CSE, IT - 7.5+ CGPA",
      mode: "Online",
      registrations: 156,
      status: "Open",
      lastDate: "2025-01-10",
      description: "Looking for talented software engineers to join our team.",
      location: "Virtual Meeting Room",
      package: "₹25-35 LPA",
      requirements: "Strong programming skills in Java/Python"
    },
    {
      id: 2,
      title: "Microsoft Product Manager Drive",
      company: "Microsoft",
      role: "Product Manager",
      date: "2025-01-22",
      time: "14:00",
      eligibility: "All Branches - 8.0+ CGPA",
      mode: "Offline",
      registrations: 89,
      status: "Open",
      lastDate: "2025-01-18",
      description: "Seeking product managers for innovative projects.",
      location: "Main Auditorium",
      package: "₹30-40 LPA",
      requirements: "Leadership skills and technical background"
    },
    {
      id: 3,
      title: "Amazon SDE Drive",
      company: "Amazon",
      role: "Software Development Engineer",
      date: "2025-01-08",
      time: "11:00",
      eligibility: "CSE, IT - 7.0+ CGPA",
      mode: "Hybrid",
      registrations: 203,
      status: "Closed",
      lastDate: "2025-01-05",
      description: "Join Amazon's engineering team.",
      location: "Conference Hall A",
      package: "₹22-28 LPA",
      requirements: "DSA knowledge and system design"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    role: '',
    date: '',
    time: '',
    eligibility: '',
    mode: 'Online',
    lastDate: '',
    description: '',
    location: '',
    package: '',
    requirements: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetFormData = () => {
    setFormData({
      title: '',
      company: '',
      role: '',
      date: '',
      time: '',
      eligibility: '',
      mode: 'Online',
      lastDate: '',
      description: '',
      location: '',
      package: '',
      requirements: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title || formData.title.length < 3) {
      errors.title = 'Drive title must be at least 3 characters';
    }
    if (!formData.company || formData.company.length < 2) {
      errors.company = 'Company name must be at least 2 characters';
    }
    if (!formData.role || formData.role.length < 2) {
      errors.role = 'Role must be at least 2 characters';
    }
    if (!formData.date) {
      errors.date = 'Drive date is required';
    }
    if (!formData.time) {
      errors.time = 'Drive time is required';
    }
    if (!formData.eligibility) {
      errors.eligibility = 'Eligibility criteria is required';
    }
    if (!formData.lastDate) {
      errors.lastDate = 'Last registration date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newDrive: PlacementDrive = {
      id: Math.max(...drives.map(d => d.id), 0) + 1,
      ...formData,
      registrations: 0,
      status: 'Open'
    };

    setDrives([newDrive, ...drives]);
    setIsCreateModalOpen(false);
    resetFormData();
    setIsSubmitting(false);
    
    toast.success("✅ Drive scheduled successfully!");
  };

  const handleDeleteDrive = (driveId: number) => {
    const updatedDrives = drives.filter(drive => drive.id !== driveId);
    setDrives(updatedDrives);
    toast.success("Drive deleted successfully!");
  };

  const handleExportData = () => {
    const csvContent = [
      ['Drive Title', 'Company', 'Role', 'Date', 'Time', 'Mode', 'Registrations', 'Status', 'Package'],
      ...filteredDrives.map(drive => [
        drive.title,
        drive.company,
        drive.role,
        drive.date,
        drive.time,
        drive.mode,
        drive.registrations,
        drive.status,
        drive.package || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placement-drives.csv';
    a.click();
    
    toast.success("Drive data exported successfully!");
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || drive.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      case 'Upcoming': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/college/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Placement Drives</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Drive
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule New Placement Drive</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateDrive} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Drive Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g., Google Software Engineer Drive"
                          className={formErrors.title ? 'border-red-500' : ''}
                        />
                        {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="e.g., Google Inc."
                          className={formErrors.company ? 'border-red-500' : ''}
                        />
                        {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
                      </div>
                      <div>
                        <Label htmlFor="role">Role *</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          placeholder="e.g., Software Engineer"
                          className={formErrors.role ? 'border-red-500' : ''}
                        />
                        {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
                      </div>
                      <div>
                        <Label htmlFor="package">Package Range</Label>
                        <Input
                          id="package"
                          value={formData.package}
                          onChange={(e) => setFormData({...formData, package: e.target.value})}
                          placeholder="e.g., ₹25-35 LPA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Drive Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className={formErrors.date ? 'border-red-500' : ''}
                        />
                        {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
                      </div>
                      <div>
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className={formErrors.time ? 'border-red-500' : ''}
                        />
                        {formErrors.time && <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>}
                      </div>
                      <div>
                        <Label htmlFor="mode">Mode</Label>
                        <Select value={formData.mode} onValueChange={(value) => setFormData({...formData, mode: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Offline">Offline</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="e.g., Main Auditorium, Block B"
                        />
                      </div>
                      <div>
                        <Label htmlFor="eligibility">Eligibility Criteria *</Label>
                        <Input
                          id="eligibility"
                          value={formData.eligibility}
                          onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                          placeholder="e.g., CSE, IT - 7.5+ CGPA"
                          className={formErrors.eligibility ? 'border-red-500' : ''}
                        />
                        {formErrors.eligibility && <p className="text-red-500 text-sm mt-1">{formErrors.eligibility}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastDate">Last Date of Registration *</Label>
                        <Input
                          id="lastDate"
                          type="date"
                          value={formData.lastDate}
                          onChange={(e) => setFormData({...formData, lastDate: e.target.value})}
                          className={formErrors.lastDate ? 'border-red-500' : ''}
                        />
                        {formErrors.lastDate && <p className="text-red-500 text-sm mt-1">{formErrors.lastDate}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="requirements">Technical Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        placeholder="e.g., Strong programming skills in Java/Python, Data Structures & Algorithms"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Additional details about the drive, selection process, benefits..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          resetFormData();
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Scheduling...' : 'Schedule Drive'}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Drives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drives.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Drives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {drives.filter(d => d.status === 'Open').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {drives.reduce((sum, d) => sum + d.registrations, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(drives.map(d => d.company)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Placement Drives</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search drives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drives</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Drives Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drive Details</TableHead>
                  <TableHead>Company & Role</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Eligibility</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrives.map((drive) => (
                  <TableRow key={drive.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{drive.title}</p>
                        {drive.package && (
                          <Badge variant="outline" className="mt-1 font-mono text-xs">
                            {drive.package}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">{drive.company}</p>
                          <p className="text-sm text-gray-600">{drive.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          {drive.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(drive.time)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {drive.mode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                        <p className="text-sm">{drive.eligibility}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        {drive.registrations}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(drive.status)}>
                        {drive.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/college/placement-drives/${drive.id}/view`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/college/placement-drives/${drive.id}/manage`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteDrive(drive.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
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

export default PlacementDrives;
