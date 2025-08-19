
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save, 
  Trash2,
  AlertTriangle
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

const ManagePlacementDrive = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    requirements: '',
    status: 'Open'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data for drives
  const mockDrives = [
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
  ];

  useEffect(() => {
    const foundDrive = mockDrives.find(d => d.id === parseInt(driveId || '0'));
    if (foundDrive) {
      setFormData({
        title: foundDrive.title,
        company: foundDrive.company,
        role: foundDrive.role,
        date: foundDrive.date,
        time: foundDrive.time,
        eligibility: foundDrive.eligibility,
        mode: foundDrive.mode,
        lastDate: foundDrive.lastDate,
        description: foundDrive.description || '',
        location: foundDrive.location || '',
        package: foundDrive.package || '',
        requirements: foundDrive.requirements || '',
        status: foundDrive.status
      });
    }
  }, [driveId]);

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

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast.success("✅ Drive updated successfully!");
  };

  const handleDeleteDrive = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsDeleteDialogOpen(false);
    setIsLoading(false);
    toast.success("Drive deleted successfully!");
    navigate('/college/placement-drives');
  };

  const toggleRegistrationStatus = () => {
    const newStatus = formData.status === 'Open' ? 'Closed' : 'Open';
    setFormData({ ...formData, status: newStatus });
    toast.success(`Registration ${newStatus.toLowerCase()} successfully!`);
  };

  const drive = mockDrives.find(d => d.id === parseInt(driveId || '0'));

  if (!drive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Drive Not Found</h1>
          <Link to="/college/placement-drives">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Drives
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/college/placement-drives" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to All Drives
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Drive</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Drive
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      Delete Placement Drive
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{drive.title}"? This action cannot be undone and will remove all registration data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteDrive} disabled={isLoading}>
                      {isLoading ? 'Deleting...' : 'Delete Drive'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Edit Drive Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveChanges} className="space-y-6">
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
                    <div className="md:col-span-2">
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

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Control */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Status:</span>
                    <Badge className={formData.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {formData.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Toggle Registration:</span>
                    <Switch
                      checked={formData.status === 'Open'}
                      onCheckedChange={toggleRegistrationStatus}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {formData.status === 'Open' 
                      ? 'Students can currently register for this drive' 
                      : 'Registration is closed for this drive'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Drive Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Drive Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Registrations:</span>
                    <span className="font-bold text-blue-600">{drive.registrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eligible Students:</span>
                    <span className="font-medium">248</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Rate:</span>
                    <span className="font-medium">63%</span>
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

export default ManagePlacementDrive;
