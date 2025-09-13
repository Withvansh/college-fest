import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react';
import {
  placementDriveAPI,
  PlacementDrive,
  CreatePlacementDriveRequest,
} from '@/lib/api/placementDrives';

interface FormData {
  title: string;
  company: string;
  role: string;
  drive_date: string;
  drive_time: string;
  eligibility_criteria: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  registration_deadline: string;
  description: string;
  location: string;
  salary_package: string;
  requirements: string;
  status: 'Open' | 'Closed' | 'Upcoming' | 'Completed';
  positions_available: number;
  offCampus: boolean;
}

const ManagePlacementDrive = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [loading, setLoading] = useState(true);

  // For now, using a mock college ID - replace with actual college ID from auth context
  const collegeId = localStorage.getItem('user_id'); // Replace with actual college ID

  const [formData, setFormData] = useState<FormData>({
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
    status: 'Open',
    positions_available: 1,
    offCampus: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (driveId && driveId !== 'new') {
      fetchDriveDetails();
    } else {
      setLoading(false);
    }
  }, [driveId]);

  const fetchDriveDetails = async () => {
    try {
      setLoading(true);
      const driveData = await placementDriveAPI.getPlacementDriveById(driveId!);
      console.log(driveData);
      setDrive(driveData);

      // Populate form with existing data
      setFormData({
        title: driveData.title,
        company: driveData.company,
        role: driveData.role,
        drive_date: driveData.drive_date.split('T')[0], // Extract date part
        drive_time: driveData.drive_time,
        eligibility_criteria: driveData.eligibility_criteria,
        mode: driveData.mode,
        registration_deadline: driveData.registration_deadline.split('T')[0],
        description: driveData.description || '',
        location: driveData.location || '',
        salary_package: driveData.salary_package || '',
        requirements: driveData.requirements || '',
        status: driveData.status,
        positions_available: driveData.positions_available,
        offCampus: driveData.offCampus,
      });
    } catch (error) {
      console.error('Error fetching drive details:', error);
      toast.error('Failed to load drive details');
      navigate('/college/placement-drives');
    } finally {
      setLoading(false);
    }
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
    if (!formData.registration_deadline) {
      errors.registration_deadline = 'Registration deadline is required';
    }
    if (!formData.eligibility_criteria) {
      errors.eligibility_criteria = 'Eligibility criteria is required';
    }
    if (formData.positions_available < 1) {
      errors.positions_available = 'At least 1 position is required';
    }

    // Date validation
    if (formData.drive_date && formData.registration_deadline) {
      const driveDate = new Date(formData.drive_date);
      const deadline = new Date(formData.registration_deadline);

      if (deadline >= driveDate) {
        errors.registration_deadline = 'Registration deadline must be before drive date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);

    try {
      const submitData: CreatePlacementDriveRequest = {
        ...formData,
        college_id: collegeId,
        positions_available: Number(formData.positions_available),
      };

      if (driveId && driveId !== 'new') {
        // Update existing drive
        await placementDriveAPI.updatePlacementDrive(driveId, submitData);
        toast.success('Drive updated successfully!');
      } else {
        // Create new drive
        await placementDriveAPI.createPlacementDrive(collegeId, submitData);
        toast.success('Drive created successfully!');
      }

      navigate('/college/placement-drives');
    } catch (error) {
      console.error('Error saving drive:', error);
      toast.error('Failed to save drive. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!driveId || driveId === 'new') return;

    try {
      setIsLoading(true);
      await placementDriveAPI.deletePlacementDrive(driveId);
      toast.success('Drive deleted successfully!');
      navigate('/college/placement-drives');
    } catch (error) {
      console.error('Error deleting drive:', error);
      toast.error('Failed to delete drive. Please try again.');
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const toggleRegistrationStatus = () => {
    const newStatus = formData.status === 'Open' ? 'Closed' : 'Open';
    handleInputChange('status', newStatus);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
            Loading placement drive...
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Please wait while we load the details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/college/placement-drives"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back to All Drives</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Drive</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Delete Drive</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 sm:mx-auto w-full sm:w-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-base sm:text-lg">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-500" />
                      Delete Placement Drive
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      Are you sure you want to delete "{drive?.title || 'this drive'}"? This action
                      cannot be undone and will remove all registration data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? 'Deleting...' : 'Delete Drive'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Edit Drive Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-sm sm:text-base">
                        Drive Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Google Software Engineer Drive"
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.title ? 'border-red-500' : ''}`}
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.title}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-sm sm:text-base">
                        Company Name *
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={e => handleInputChange('company', e.target.value)}
                        placeholder="e.g., Google Inc."
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.company ? 'border-red-500' : ''}`}
                      />
                      {formErrors.company && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.company}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-sm sm:text-base">
                        Role *
                      </Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={e => handleInputChange('role', e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.role ? 'border-red-500' : ''}`}
                      />
                      {formErrors.role && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.role}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="package" className="text-sm sm:text-base">
                        Package Range
                      </Label>
                      <Input
                        id="package"
                        value={formData.salary_package}
                        onChange={e => handleInputChange('salary_package', e.target.value)}
                        placeholder="e.g., ₹25-35 LPA"
                        className="h-9 sm:h-10 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="positions" className="text-sm sm:text-base">
                        Positions Available *
                      </Label>
                      <Input
                        id="positions"
                        type="number"
                        min="1"
                        value={formData.positions_available}
                        onChange={e =>
                          handleInputChange('positions_available', parseInt(e.target.value) || 1)
                        }
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.positions_available ? 'border-red-500' : ''}`}
                      />
                      {formErrors.positions_available && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors.positions_available}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-sm sm:text-base">
                        Drive Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.drive_date}
                        onChange={e => handleInputChange('drive_date', e.target.value)}
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.drive_date ? 'border-red-500' : ''}`}
                      />
                      {formErrors.drive_date && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors.drive_date}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-sm sm:text-base">
                        Time *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.drive_time}
                        onChange={e => handleInputChange('drive_time', e.target.value)}
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.drive_time ? 'border-red-500' : ''}`}
                      />
                      {formErrors.drive_time && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors.drive_time}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="mode" className="text-sm sm:text-base">
                        Mode
                      </Label>
                      <Select
                        value={formData.mode}
                        onValueChange={(value: 'Online' | 'Offline' | 'Hybrid') =>
                          handleInputChange('mode', value)
                        }
                      >
                        <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
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
                      <Label htmlFor="offCampus" className="text-sm sm:text-base">
                        Off-Campus Drive
                      </Label>
                      <Select
                        value={formData.offCampus ? 'true' : 'false'}
                        onValueChange={value => handleInputChange('offCampus', value === 'true')}
                      >
                        <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm sm:text-base">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={e => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Main Auditorium, Block B"
                        className="h-9 sm:h-10 text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="eligibility" className="text-sm sm:text-base">
                        Eligibility Criteria *
                      </Label>
                      <Input
                        id="eligibility"
                        value={formData.eligibility_criteria}
                        onChange={e => handleInputChange('eligibility_criteria', e.target.value)}
                        placeholder="e.g., CSE, IT - 7.5+ CGPA"
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.eligibility_criteria ? 'border-red-500' : ''}`}
                      />
                      {formErrors.eligibility_criteria && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors.eligibility_criteria}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastDate" className="text-sm sm:text-base">
                        Last Date of Registration *
                      </Label>
                      <Input
                        id="lastDate"
                        type="date"
                        value={formData.registration_deadline}
                        onChange={e => handleInputChange('registration_deadline', e.target.value)}
                        className={`h-9 sm:h-10 text-sm sm:text-base ${formErrors.registration_deadline ? 'border-red-500' : ''}`}
                      />
                      {formErrors.registration_deadline && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors.registration_deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements" className="text-sm sm:text-base">
                      Technical Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={e => handleInputChange('requirements', e.target.value)}
                      placeholder="e.g., Strong programming skills in Java/Python, Data Structures & Algorithms"
                      rows={3}
                      className="text-sm sm:text-base resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm sm:text-base">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => handleInputChange('description', e.target.value)}
                      placeholder="Additional details about the drive, selection process, benefits..."
                      rows={4}
                      className="text-sm sm:text-base resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
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
          <div className="space-y-4 sm:space-y-6">
            {/* Status Control */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Registration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm sm:text-base font-medium">Current Status:</span>
                    <Badge
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                        formData.status === 'Open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {formData.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm sm:text-base font-medium">Toggle Registration:</span>
                    <Switch
                      checked={formData.status === 'Open'}
                      onCheckedChange={toggleRegistrationStatus}
                      className="self-start sm:self-auto"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.status === 'Open'
                      ? 'Students can currently register for this drive'
                      : 'Registration is closed for this drive'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Drive Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Drive Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm sm:text-base">Total Registrations:</span>
                    <span className="font-bold text-blue-600 text-sm sm:text-base">
                      {drive?.registrations || 0}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm sm:text-base">Positions Available:</span>
                    <span className="font-medium text-sm sm:text-base">
                      {drive?.positions_available || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm sm:text-base">Registration Deadline:</span>
                    <span className="font-medium text-sm sm:text-base text-right sm:text-left">
                      {drive?.registration_deadline
                        ? new Date(drive.registration_deadline).toLocaleDateString()
                        : 'Not set'}
                    </span>
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
