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

const ViewPlacementDriveStudent = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [registrations, setRegistrations] = useState<PlacementRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log(registrationsData);
        setRegistrations(registrationsData.registrations);
      } catch (error) {
        console.error('Error fetching drive data:', error);
        toast.error('Failed to load drive details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriveData();
  }, [driveId]);

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

  const handleExportRegistrations = () => {
    const csvContent = [
      ['Name', 'Roll Number', 'Branch', 'CGPA', 'Email', 'Phone', 'Registration Date'],
      ...registrations.map(registration => [
        registration.student_name || 'N/A',
        registration.roll_number || 'N/A',
        registration.branch || 'N/A',
        registration.cgpa || 'N/A',
        registration.email || 'N/A',
        registration.phone || 'N/A',
        new Date(registration.registration_date).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drive?.title.replace(/\s+/g, '_')}_registrations.csv`;
    a.click();

    toast.success('Registration list exported successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
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
        <div className="text-center px-4 max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Drive Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            The placement drive you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/student/dashboard">
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
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
              <Link
                to="/student/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 flex-shrink-0 p-1 sm:p-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline text-sm lg:text-base">Back to All Drives</span>
                <span className="sm:hidden text-xs sm:text-sm">Back</span>
              </Link>
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">
                Drive Details
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8">
        {/* Drive Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl line-clamp-2">
                      {drive.title}
                    </CardTitle>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base lg:text-lg font-medium truncate">
                        {drive.company}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(drive.status)} self-start text-xs sm:text-sm`}
                  >
                    {drive.status === 'Open' ? 'Registration Open' : drive.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Basic Information
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center">
                        <span className="font-medium w-20 sm:w-24 text-xs sm:text-sm">Role:</span>
                        <span className="text-xs sm:text-sm lg:text-base">{drive.role}</span>
                      </div>
                      {drive.salary_package && (
                        <div className="flex items-center">
                          <span className="font-medium w-20 sm:w-24 text-xs sm:text-sm">
                            Package:
                          </span>
                          <Badge variant="outline" className="font-mono text-xs sm:text-sm">
                            {drive.salary_package}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="font-medium w-20 sm:w-24 text-xs sm:text-sm">Mode:</span>
                        <span className="text-xs sm:text-sm lg:text-base">{drive.mode}</span>
                      </div>
                      {drive.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm lg:text-base">{drive.location}</span>
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
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm lg:text-base">
                          {formatDate(drive.drive_date)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm lg:text-base">
                          {formatTime(drive.drive_time)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-xs sm:text-sm">Last Date:</span>
                        <span className="ml-1 sm:ml-2 text-red-600 text-xs sm:text-sm lg:text-base">
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
                  <div className="flex items-start">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm lg:text-base">
                      {drive.eligibility_criteria}
                    </span>
                  </div>
                </div>

                {drive.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Technical Requirements
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                      {drive.requirements}
                    </p>
                  </div>
                )}

                {drive.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                      Description
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                      {drive.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* <div>
            <Card>
              <CardHeader>
                <CardTitle>Registration Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{drive.registrations}</div>
                    <div className="text-sm text-gray-600">Total Registrations</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>CSE Students:</span>
                      <span className="font-medium">124</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IT Students:</span>
                      <span className="font-medium">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average CGPA:</span>
                      <span className="font-medium">8.2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>

        {/* Registered Students */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Registered Students ({registrations.length})
            </CardTitle>
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
                    <TableHead>Registration Date</TableHead>
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
                            <Mail className="h-3 w-3 mr-1" />
                            {registration.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {registration.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(registration.registration_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200">
                {registrations.map(registration => (
                  <div key={registration._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {registration.student_name}
                        </h4>
                        <p className="text-sm text-gray-600">{registration.roll_number}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Branch</p>
                        <p className="font-medium">{registration.branch}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">CGPA</p>
                        <p className="font-medium">{registration.cgpa}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{registration.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{registration.phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Registered On</p>
                      <p className="text-sm font-medium">
                        {formatDate(registration.registration_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewPlacementDriveStudent;
