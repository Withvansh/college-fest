import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
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
  GraduationCap,
} from 'lucide-react';
import { placementDriveAPI } from '@/lib/api/placementDrives';
import { PlacementDrive, CreatePlacementDriveRequest } from '@/lib/api/placementDrives';

const PlacementDrives = () => {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem('user_id');

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    role: '',
    drive_date: '',
    drive_time: '',
    eligibility_criteria: '',
    mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
    registration_deadline: '',
    description: '',
    location: '',
    salary_package: '',
    requirements: '',
    positions_available: 1,
    offCampus: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch drives on component mount
  useEffect(() => {
    fetchDrives();
  }, [collegeId]);

  const fetchDrives = async () => {
    if (!collegeId) return;

    setIsLoading(true);
    try {
      const response = await placementDriveAPI.getPlacementDrives(collegeId);
      console.log(response);
      setDrives(response.drives || []);
    } catch (error) {
      console.error('Error fetching drives:', error);
      toast.error('Failed to load placement drives');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      company: '',
      role: '',
      drive_date: '',
      drive_time: '',
      eligibility_criteria: '',
      mode: 'Online',
      registration_deadline: '',
      description: '',
      location: '',
      salary_package: '',
      requirements: '',
      positions_available: 1,
      offCampus: false,
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
    if (!formData.drive_date) {
      errors.drive_date = 'Drive date is required';
    }
    if (!formData.drive_time) {
      errors.drive_time = 'Drive time is required';
    }
    if (!formData.eligibility_criteria) {
      errors.eligibility_criteria = 'Eligibility criteria is required';
    }
    if (!formData.registration_deadline) {
      errors.registration_deadline = 'Last registration date is required';
    }
    if (!formData.positions_available || formData.positions_available < 1) {
      errors.positions_available = 'Positions available must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const createData: CreatePlacementDriveRequest = {
        ...formData,
        college_id: collegeId,
      };

      await placementDriveAPI.createPlacementDrive(collegeId, createData);

      // Refresh the drives list
      await fetchDrives();

      setIsCreateModalOpen(false);
      resetFormData();
      toast.success('✅ Drive scheduled successfully!');
    } catch (error) {
      console.error('Error creating drive:', error);
      toast.error('Failed to create drive. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDrive = async (driveId: string) => {
    try {
      await placementDriveAPI.deletePlacementDrive(driveId);

      // Refresh the drives list
      await fetchDrives();

      toast.success('Drive deleted successfully!');
    } catch (error) {
      console.error('Error deleting drive:', error);
      toast.error('Failed to delete drive. Please try again.');
    }
  };

  const handleExportData = () => {
    const csvContent = [
      [
        'Drive Title',
        'Company',
        'Role',
        'Date',
        'Time',
        'Mode',
        'Registrations',
        'Status',
        'Package',
      ],
      ...filteredDrives.map(drive => [
        drive.title,
        drive.company,
        drive.role,
        formatDate(drive.drive_date),
        formatTime(drive.drive_time),
        drive.mode,
        drive.registrations || 0,
        drive.status,
        drive.salary_package || 'N/A',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placement-drives.csv';
    a.click();

    toast.success('Drive data exported successfully!');
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch =
      drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || drive.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700';
      case 'Closed':
        return 'bg-red-100 text-red-700';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';

    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);

      // Validate hour and minute values
      if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return time; // Return original if invalid
      }

      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.warn('Error formatting time:', time, error);
      return time; // Return original time if formatting fails
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';

    try {
      // Handle different date formats
      let dateObj: Date;

      if (date.includes('-')) {
        // Assume YYYY-MM-DD format
        const [year, month, day] = date.split('-');
        if (year && month && day) {
          dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          return date; // Return original if parsing fails
        }
      } else if (date.includes('/')) {
        // Handle MM/DD/YYYY format
        dateObj = new Date(date);
      } else {
        // Try to parse as is
        dateObj = new Date(date);
      }

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return date; // Return original if invalid
      }

      // Format as DD-MM-YYYY
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.warn('Error formatting date:', date, error);
      return date; // Return original date if formatting fails
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/college/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Placement Drives</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Data</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Schedule New Drive</span>
                    <span className="sm:hidden">New Drive</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto w-full sm:w-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      Schedule New Placement Drive
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateDrive} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Drive Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Google Software Engineer Drive"
                          className={formErrors.title ? 'border-red-500' : ''}
                        />
                        {formErrors.title && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g., Google Inc."
                          className={formErrors.company ? 'border-red-500' : ''}
                        />
                        {formErrors.company && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="role">Role *</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          placeholder="e.g., Software Engineer"
                          className={formErrors.role ? 'border-red-500' : ''}
                        />
                        {formErrors.role && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="package">Package Range</Label>
                        <Input
                          id="package"
                          value={formData.salary_package}
                          onChange={e =>
                            setFormData({ ...formData, salary_package: e.target.value })
                          }
                          placeholder="e.g., ₹25-35 LPA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="positions">Positions Available *</Label>
                        <Input
                          id="positions"
                          type="number"
                          min="1"
                          value={formData.positions_available}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              positions_available: parseInt(e.target.value) || 1,
                            })
                          }
                          className={formErrors.positions_available ? 'border-red-500' : ''}
                        />
                        {formErrors.positions_available && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.positions_available}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="date">Drive Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.drive_date}
                          onChange={e => setFormData({ ...formData, drive_date: e.target.value })}
                          className={formErrors.drive_date ? 'border-red-500' : ''}
                        />
                        {formErrors.drive_date && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.drive_date}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.drive_time}
                          onChange={e => setFormData({ ...formData, drive_time: e.target.value })}
                          className={formErrors.drive_time ? 'border-red-500' : ''}
                        />
                        {formErrors.drive_time && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.drive_time}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mode">Mode</Label>
                        <Select
                          value={formData.mode}
                          onValueChange={(value: 'Online' | 'Offline' | 'Hybrid') =>
                            setFormData({ ...formData, mode: value })
                          }
                        >
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
                        <Label htmlFor="offCampus">Off-Campus Drive</Label>
                        <Select
                          value={formData.offCampus ? 'true' : 'false'}
                          onValueChange={value =>
                            setFormData({ ...formData, offCampus: value === 'true' })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Main Auditorium, Block B"
                        />
                      </div>
                      <div>
                        <Label htmlFor="eligibility">Eligibility Criteria *</Label>
                        <Input
                          id="eligibility"
                          value={formData.eligibility_criteria}
                          onChange={e =>
                            setFormData({ ...formData, eligibility_criteria: e.target.value })
                          }
                          placeholder="e.g., CSE, IT - 7.5+ CGPA"
                          className={formErrors.eligibility_criteria ? 'border-red-500' : ''}
                        />
                        {formErrors.eligibility_criteria && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.eligibility_criteria}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastDate">Last Date of Registration *</Label>
                        <Input
                          id="lastDate"
                          type="date"
                          value={formData.registration_deadline}
                          onChange={e =>
                            setFormData({ ...formData, registration_deadline: e.target.value })
                          }
                          className={formErrors.registration_deadline ? 'border-red-500' : ''}
                        />
                        {formErrors.registration_deadline && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.registration_deadline}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="requirements">Technical Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements}
                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="e.g., Strong programming skills in Java/Python, Data Structures & Algorithms"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Additional details about the drive, selection process, benefits..."
                        rows={4}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          resetFormData();
                        }}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
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

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Total Drives
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {drives.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Open Drives
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                {drives.filter(d => d.status === 'Open').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Registrations
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                {drives.reduce((sum, d) => sum + d.registrations, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Companies
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                {new Set(drives.map(d => d.company)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold">All Placement Drives</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search drives..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 w-full sm:w-64 h-8 sm:h-10 text-sm"
                />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
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

        {/* Drives Table/Cards */}
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Loading placement drives...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredDrives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">No placement drives found</p>
                          <p className="text-sm">
                            Create your first placement drive to get started
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrives.map(drive => (
                      <TableRow key={drive._id || drive.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{drive.title}</p>
                            {drive.salary_package && (
                              <Badge variant="outline" className="mt-1 font-mono text-xs">
                                {drive.salary_package}
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
                              {formatDate(drive.drive_date)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(drive.drive_time)}
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
                            <p className="text-sm">{drive.eligibility_criteria}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            {drive.registrations}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(drive.status)}>{drive.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/college/placement-drives/${drive._id || drive.id}/view`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/college/placement-drives/${drive._id || drive.id}/manage`
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDrive(drive._id || drive.id!)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="bg-white rounded-lg p-8 max-w-sm mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Loading placement drives...
                    </h3>
                    <p className="text-sm text-gray-600">Please wait while we fetch your data</p>
                  </div>
                </div>
              ) : filteredDrives.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 rounded-lg p-8 max-w-sm mx-auto">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No placement drives found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Create your first placement drive to get started with managing campus
                      placements
                    </p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Drive
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredDrives.map(drive => (
                    <div
                      key={drive._id || drive.id}
                      className="p-4 space-y-3 bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-gray-900 truncate mb-1">
                            {drive.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {drive.company}
                            </span>
                          </div>
                          {drive.salary_package && (
                            <Badge
                              variant="secondary"
                              className="mt-2 text-xs font-mono bg-green-100 text-green-700"
                            >
                              {drive.salary_package}
                            </Badge>
                          )}
                        </div>
                        <Badge
                          className={`${getStatusColor(drive.status)} text-xs px-2 py-1 ml-3 flex-shrink-0 font-medium`}
                        >
                          {drive.status}
                        </Badge>
                      </div>

                      {/* Role and Mode */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{drive.role}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {drive.mode}
                        </Badge>
                      </div>

                      {/* Date and Time */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(drive.drive_date)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatTime(drive.drive_time)}
                            </span>
                          </div>
                        </div>
                        {drive.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{drive.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Eligibility and Registrations */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                                Eligibility
                              </div>
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {drive.eligibility_criteria}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="text-xs font-medium text-green-700 uppercase tracking-wide">
                                Registrations
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {drive.registrations}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/college/placement-drives/${drive._id || drive.id}/view`)
                          }
                          className="flex-1 h-9 text-sm font-medium bg-white hover:bg-blue-50 hover:border-blue-200 border-gray-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/college/placement-drives/${drive._id || drive.id}/manage`)
                          }
                          className="flex-1 h-9 text-sm font-medium bg-white hover:bg-orange-50 hover:border-orange-200 border-gray-200"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDrive(drive._id || drive.id!)}
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlacementDrives;
