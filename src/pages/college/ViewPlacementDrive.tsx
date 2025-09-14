import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Users,
  Download,
  Phone,
  Mail,
  Edit,
} from 'lucide-react';
import { placementDriveAPI } from '@/lib/api/placementDrives';
import { PlacementDrive, PlacementRegistration } from '@/lib/api/placementDrives';

const ViewPlacementDrive = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [registrations, setRegistrations] = useState<PlacementRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<PlacementRegistration | null>(null);
  const [isPlacementDialogOpen, setIsPlacementDialogOpen] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    selected: 0,
    rejected: 0,
    waitlisted: 0,
    registered: 0,
    cseStudents: 0,
    itStudents: 0,
    averageCGPA: 0
  });

  useEffect(() => {
    const fetchDriveData = async () => {
      if (!driveId) return;

      setIsLoading(true);
      try {
        // Fetch drive details
        const driveData = await placementDriveAPI.getPlacementDriveById(driveId);
        setDrive(driveData);

        // Fetch registrations for this drive
        const registrationsData = await placementDriveAPI.getDriveRegistrations(driveId);
        setRegistrations(registrationsData.registrations);
        
        // Calculate statistics
        calculateStatistics(registrationsData.registrations);
      } catch (error) {
        console.error('Error fetching drive data:', error);
        toast.error('Failed to load drive details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriveData();
  }, [driveId]);

  const calculateStatistics = (registrations: PlacementRegistration[]) => {
    let selected = 0;
    let rejected = 0;
    let waitlisted = 0;
    let registered = 0;
    let cseStudents = 0;
    let itStudents = 0;
    let totalCGPA = 0;
    let validCGPAcount = 0;

    registrations.forEach(reg => {
      // Count by status
      switch (reg.status) {
        case 'Selected':
          selected++;
          break;
        case 'Rejected':
          rejected++;
          break;
        case 'Waitlisted':
          waitlisted++;
          break;
        case 'Registered':
        default:
          registered++;
          break;
      }

      // Count by branch
      if (reg.branch) {
        const branchLower = reg.branch.toLowerCase();
        if (branchLower.includes('cse') || branchLower.includes('computer')) {
          cseStudents++;
        } else if (branchLower.includes('it') || branchLower.includes('information')) {
          itStudents++;
        }
      }

      // Calculate average CGPA
      if (reg.cgpa && !isNaN(reg.cgpa)) {
        totalCGPA += reg.cgpa;
        validCGPAcount++;
      }
    });

    setStatistics({
      total: registrations.length,
      selected,
      rejected,
      waitlisted,
      registered,
      cseStudents,
      itStudents,
      averageCGPA: validCGPAcount > 0 ? parseFloat((totalCGPA / validCGPAcount).toFixed(2)) : 0
    });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Waitlisted':
        return 'bg-yellow-100 text-yellow-700';
      case 'Registered':
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const handlePlacementUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const formData = new FormData(e.currentTarget);
    const placementData = {
      package: formData.get('package') as string,
      startDate: formData.get('startDate') as string,
      placedDate: formData.get('placedDate') as string,
      status: formData.get('status') as string
    };

    try {
      await placementDriveAPI.updatePlacementStatus(driveId!, selectedStudent._id!, placementData);
      
      // Update the local state
      setRegistrations((prevRegistrations:any) =>
        prevRegistrations.map((reg:any) =>
          reg._id === selectedStudent._id
            ? {
                ...reg,
                placed: {
                  package: placementData.package,
                  startDate: new Date(placementData.startDate),
                  placedDate: new Date(placementData.placedDate),
                },
                status: placementData.status
              }
            : reg
        )
      );

      // Recalculate statistics
      calculateStatistics(registrations.map((reg:any) => 
        reg._id === selectedStudent._id 
          ? {...reg, status: placementData.status} 
          : reg
      ));

      setIsPlacementDialogOpen(false);
      toast.success('Placement status updated successfully');
    } catch (error) {
      console.error('Error updating placement status:', error);
      toast.error('Failed to update placement status');
    }
  };

  const handleExportRegistrations = (status?: string) => {
    let filteredRegistrations = registrations;
    let fileName = `${drive?.title.replace(/\s+/g, '_')}_registrations`;
    
    if (status) {
      filteredRegistrations = registrations.filter(reg => reg.status === status);
      fileName = `${drive?.title.replace(/\s+/g, '_')}_${status.toLowerCase()}_registrations`;
    }

    const csvContent = [
      ['Name', 'Roll Number', 'Branch', 'CGPA', 'Email', 'Phone', 'Status', 'Registration Date'],
      ...filteredRegistrations.map(registration => [
        registration.student_name || 'N/A',
        registration.roll_number || 'N/A',
        registration.branch || 'N/A',
        registration.cgpa || 'N/A',
        registration.email || 'N/A',
        registration.phone || 'N/A',
        registration.status || 'N/A',
        new Date(registration.registration_date).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();

    toast.success(`Registration list${status ? ` (${status})` : ''} exported successfully!`);
  };

  const handleEditStudent = (student: PlacementRegistration) => {
    setSelectedStudent(student);
    setIsPlacementDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
            Loading drive details...
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Please wait while we fetch the information
          </p>
        </div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Drive Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            The placement drive you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/college/placement-drives">
            <Button className="w-full sm:w-auto">
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Drive Details</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => handleExportRegistrations()}
                className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export All</span>
                <span className="sm:hidden">Export All</span>
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
                onClick={() => navigate(`/college/placement-drives/${drive.id}/manage`)}
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Manage Drive</span>
                <span className="sm:hidden">Manage</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Drive Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl">{drive.title}</CardTitle>
                    <div className="flex items-center mt-2">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="text-base sm:text-lg font-medium truncate">
                        {drive.company}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(drive.status)} text-xs sm:text-sm px-2 sm:px-3 py-1 flex-shrink-0`}
                  >
                    {drive.status === 'Open' ? 'Registration Open' : drive.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Basic Information
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center">
                        <span className="font-medium w-20 sm:w-24 text-sm sm:text-base">Role:</span>
                        <span className="text-sm sm:text-base truncate ml-2">{drive.role}</span>
                      </div>
                      {drive.salary_package && (
                        <div className="flex items-center">
                          <span className="font-medium w-20 sm:w-24 text-sm sm:text-base">
                            Package:
                          </span>
                          <span className="text-sm sm:text-base ml-2">
                            {drive.salary_package} LPA
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="font-medium w-20 sm:w-24 text-sm sm:text-base">Mode:</span>
                        <span className="text-sm sm:text-base ml-2">{drive.mode}</span>
                      </div>
                      {drive.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base truncate">{drive.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Schedule
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{formatDate(drive.drive_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{formatTime(drive.drive_time)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-sm sm:text-base">Last Date:</span>
                        <span className="ml-2 text-red-600 text-sm sm:text-base">
                          {formatDate(drive.registration_deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    Eligibility Criteria
                  </h3>
                  <div className="flex items-center">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{drive.eligibility_criteria}</span>
                  </div>
                </div>

                {drive.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Technical Requirements
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">{drive.requirements}</p>
                  </div>
                )}

                {drive.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Description
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">{drive.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Registration Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {statistics.total}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Registrations</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 p-2 rounded text-center">
                      <div className="text-lg font-semibold text-green-700">{statistics.selected}</div>
                      <div className="text-xs text-green-600">Selected</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-center">
                      <div className="text-lg font-semibold text-red-700">{statistics.rejected}</div>
                      <div className="text-xs text-red-600">Rejected</div>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <div className="text-lg font-semibold text-yellow-700">{statistics.waitlisted}</div>
                      <div className="text-xs text-yellow-600">Waitlisted</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <div className="text-lg font-semibold text-blue-700">{statistics.registered}</div>
                      <div className="text-xs text-blue-600">Registered</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base">CSE Students:</span>
                      <span className="font-medium text-sm sm:text-base">{statistics.cseStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base">IT Students:</span>
                      <span className="font-medium text-sm sm:text-base">{statistics.itStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base">Average CGPA:</span>
                      <span className="font-medium text-sm sm:text-base">{statistics.averageCGPA}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registered Students */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">
                Registered Students ({registrations.length})
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportRegistrations()}
                  className="h-8 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportRegistrations('Selected')}
                  className="h-8 text-xs bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportRegistrations('Rejected')}
                  className="h-8 text-xs bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Rejected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportRegistrations('Waitlisted')}
                  className="h-8 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Waitlisted
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Details</TableHead>
                    <TableHead>Branch & CGPA</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map(registration => (
                    <TableRow key={registration._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{registration.student_name}</p>
                          <p className="text-sm text-gray-600">{registration.roll_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{registration.branch}</p>
                          <p className="text-sm text-gray-600">CGPA: {registration.cgpa}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{registration.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{registration.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStudentStatusColor(registration.status || 'Registered')}>
                          {registration.status || 'Registered'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(registration.registration_date)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStudent(registration)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {registrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                  <p className="text-gray-500">No registrations yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {registrations.map(registration => (
                    <div key={registration._id} className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {registration.student_name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {registration.roll_number}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatDate(registration.registration_date)}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                            Branch
                          </div>
                          <div className="font-medium truncate">{registration.branch}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                            CGPA
                          </div>
                          <div className="font-medium">{registration.cgpa}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                            Status
                          </div>
                          <Badge className={getStudentStatusColor(registration.status || 'Registered')}>
                            {registration.status || 'Registered'}
                          </Badge>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{registration.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
                          <span>{registration.phone}</span>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleEditStudent(registration)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Placement Details
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

      {/* Placement Dialog */}
      <Dialog open={isPlacementDialogOpen} onOpenChange={setIsPlacementDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Placement Status</DialogTitle>
            <DialogDescription>
              Enter placement details for {selectedStudent?.student_name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePlacementUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={selectedStudent?.status || 'Registered'}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Selected">Selected</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="package" className="text-right">
                  Package
                </Label>
                <Input
                  id="package"
                  name="package"
                  placeholder="e.g. 8.5 LPA"
                  className="col-span-3"
                  defaultValue={selectedStudent?.placed?.package || ''}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="col-span-3"
                  defaultValue={selectedStudent?.placed?.startDate ? new Date(selectedStudent.placed.startDate).toISOString().split('T')[0] : ''}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="placedDate" className="text-right">
                  Placed Date
                </Label>
                <Input
                  id="placedDate"
                  name="placedDate"
                  type="date"
                  className="col-span-3"
                  defaultValue={selectedStudent?.placed?.placedDate ? new Date(selectedStudent.placed.placedDate).toISOString().split('T')[0] : ''}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewPlacementDrive;