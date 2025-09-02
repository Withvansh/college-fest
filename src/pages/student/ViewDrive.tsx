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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading drive details...</h1>
        </div>
      </div>
    );
  }

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
              <Link
                to="/student/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to All Drives
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Drive Details</h1>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExportRegistrations}>
                <Download className="h-4 w-4 mr-2" />
                Export Registrations
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate(`/college/placement-drives/${drive.id}/manage`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Manage Drive
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Drive Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{drive.title}</CardTitle>
                    <div className="flex items-center mt-2">
                      <Building2 className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-lg font-medium">{drive.company}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(drive.status)}>
                    {drive.status === 'Open' ? 'Registration Open' : drive.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="font-medium w-24">Role:</span>
                        <span>{drive.role}</span>
                      </div>
                      {drive.salary_package && (
                        <div className="flex items-center">
                          <span className="font-medium w-24">Package:</span>
                          <Badge variant="outline" className="font-mono">
                            {drive.salary_package}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="font-medium w-24">Mode:</span>
                        <span>{drive.mode}</span>
                      </div>
                      {drive.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{drive.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Schedule</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatDate(drive.drive_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatTime(drive.drive_time)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Last Date:</span>
                        <span className="ml-2 text-red-600">
                          {formatDate(drive.registration_deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{drive.eligibility_criteria}</span>
                  </div>
                </div>

                {drive.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Technical Requirements</h3>
                    <p className="text-gray-700">{drive.requirements}</p>
                  </div>
                )}

                {drive.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{drive.description}</p>
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
            {/* <div className="flex items-center justify-between">
              <CardTitle>Registered Students ({registrations.length})</CardTitle>
              <Button variant="outline" onClick={handleExportRegistrations}>
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div> */}
          </CardHeader>
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewPlacementDriveStudent;
