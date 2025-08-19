
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
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
  Edit
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

interface RegisteredStudent {
  id: number;
  name: string;
  rollNumber: string;
  branch: string;
  cgpa: number;
  email: string;
  phone: string;
  registrationDate: string;
}

const ViewPlacementDrive = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [registeredStudents] = useState<RegisteredStudent[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      rollNumber: "21CSE001",
      branch: "CSE",
      cgpa: 8.5,
      email: "rahul.sharma@college.edu",
      phone: "+91 9876543210",
      registrationDate: "2024-12-20"
    },
    {
      id: 2,
      name: "Priya Patel",
      rollNumber: "21IT002",
      branch: "IT",
      cgpa: 9.1,
      email: "priya.patel@college.edu",
      phone: "+91 9876543211",
      registrationDate: "2024-12-21"
    },
    {
      id: 3,
      name: "Amit Kumar",
      rollNumber: "21CSE003",
      branch: "CSE",
      cgpa: 7.8,
      email: "amit.kumar@college.edu",
      phone: "+91 9876543212",
      registrationDate: "2024-12-22"
    }
  ]);

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
    setDrive(foundDrive || null);
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
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      case 'Upcoming': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleExportRegistrations = () => {
    const csvContent = [
      ['Name', 'Roll Number', 'Branch', 'CGPA', 'Email', 'Phone', 'Registration Date'],
      ...registeredStudents.map(student => [
        student.name,
        student.rollNumber,
        student.branch,
        student.cgpa,
        student.email,
        student.phone,
        student.registrationDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drive?.title.replace(/\s+/g, '_')}_registrations.csv`;
    a.click();
    
    toast.success("Registration list exported successfully!");
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Drive Details</h1>
            </div>
            <div className="flex items-center space-x-4">
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
            </div>
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
                      {drive.package && (
                        <div className="flex items-center">
                          <span className="font-medium w-24">Package:</span>
                          <Badge variant="outline" className="font-mono">
                            {drive.package}
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
                        <span>{formatDate(drive.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatTime(drive.time)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Last Date:</span>
                        <span className="ml-2 text-red-600">{formatDate(drive.lastDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{drive.eligibility}</span>
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

          <div>
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
          </div>
        </div>

        {/* Registered Students */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registered Students ({registeredStudents.length})</CardTitle>
              <Button variant="outline" onClick={handleExportRegistrations}>
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
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
                {registeredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.rollNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.branch}</p>
                        <p className="text-sm text-gray-600">CGPA: {student.cgpa}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(student.registrationDate)}
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

export default ViewPlacementDrive;
