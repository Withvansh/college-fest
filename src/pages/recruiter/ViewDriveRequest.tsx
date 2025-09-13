import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Calendar,
  Mail,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  User,
  BookOpen,
  GraduationCap,
  Globe,
  Eye
} from "lucide-react";
import { companyInviteAPI } from '@/lib/api/CompanyInvite';

interface College {
  _id: string;
  college_name: string;
  full_name: string;
  email: string;
  tpo_name: string;
  tpo_email: string;
  tpo_mobile: string;
  total_students: number;
  course_branch: string;
  remainingCredits: number;
}

interface Recruiter {
  _id: string;
  company_name: string;
  full_name: string;
  email: string;
  phone: string;
  company_website: string;
  location: string;
}

interface Student {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  department: string;
  enrollment_no: string;
  college_name: string;
  skills: string[];
  cgpa: number;
  tenth_percentage: number;
  twelfth_percentage: number;
  graduation_percentage: number;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  resume_url: string;
  verifiedByCollege: boolean;
}

interface DriveRequest {
  _id: string;
  college_id: College;
  recruiter_id: Recruiter;
  students: Student[];
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'scheduled';
  createdAt: string;
  updatedAt: string;
}

function ViewDriveRequest() {
  const { id } = useParams<{ id: string }>();
  const [driveRequest, setDriveRequest] = useState<DriveRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    const fetchDriveRequest = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await companyInviteAPI.getInviteById(id);
        
        if (response.success && response.data) {
          setDriveRequest(response.data);
        } else {
          toast.error("Failed to fetch drive request details");
        }
      } catch (error) {
        console.error('Error fetching drive request:', error);
        toast.error("An error occurred while fetching drive request");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriveRequest();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected' | 'scheduled') => {
    if (!id) return;
    
    try {
      setIsUpdating(true);
      const response = await companyInviteAPI.updateInviteStatus(id, newStatus);
      
      if (response.success) {
        setDriveRequest(prev => prev ? {...prev, status: newStatus} : null);
        toast.success(`Drive request ${newStatus} successfully`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Completed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-gray-600">Loading drive request details...</p>
        </div>
      </div>
    );
  }

  if (!driveRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Drive Request Not Found</h1>
          <Link to="/recruiter/college/drives">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drive Requests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/recruiter/college/drives">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Drive Request Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Drive Information</CardTitle>
                  {getStatusBadge(driveRequest.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{driveRequest.recruiter_id.company_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Recruiter Contact</p>
                      <p className="font-medium">{driveRequest.recruiter_id.full_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{driveRequest.recruiter_id.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="font-medium">{driveRequest.recruiter_id.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Company Location</p>
                      <p className="font-medium">{driveRequest.recruiter_id.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium">{driveRequest.recruiter_id.company_website}</p>
                    </div>
                  </div>
                </div>
                
                {driveRequest.message && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Invitation Message</p>
                    <p className="text-gray-700">{driveRequest.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* College Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">College Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">College Name</p>
                      <p className="font-medium">{driveRequest.college_id.college_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">TPO Name</p>
                      <p className="font-medium">{driveRequest.college_id.tpo_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">TPO Email</p>
                      <p className="font-medium">{driveRequest.college_id.tpo_email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">TPO Mobile</p>
                      <p className="font-medium">{driveRequest.college_id.tpo_mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="font-medium">{driveRequest.college_id.total_students.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Courses/Branches</p>
                      <p className="font-medium">{driveRequest.college_id.course_branch}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Students Table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Selected Students</CardTitle>
                  <Badge variant="outline" className="bg-gray-100">
                    {driveRequest.students.length} students
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {driveRequest.students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driveRequest.students.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{student.full_name || `Student ${index + 1}`}</TableCell>
                          <TableCell>{student.email || 'N/A'}</TableCell>
                          <TableCell>{student.course || 'N/A'}</TableCell>
                          <TableCell>{student.year || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className={student.verifiedByCollege ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}>
                              {student.verifiedByCollege ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewStudent(student)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No students have been selected for this drive yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar with actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Drive Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {driveRequest.status === 'pending' && (
                  <>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate('accepted')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Accept Request
                    </Button>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Reject Request
                    </Button>
                  </>
                )}
                
                {driveRequest.status === 'accepted' && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStatusUpdate('scheduled')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
                    Schedule Drive
                  </Button>
                )}
                
                {(driveRequest.status === 'accepted' || driveRequest.status === 'scheduled') && (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Mark as Completed
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-gray-500">{formatDate(driveRequest.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-gray-500">{formatDate(driveRequest.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>College Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Remaining Credits</span>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    {driveRequest.college_id.remainingCredits}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedStudent?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Full Name:</span>
                      <span className="font-medium">{selectedStudent.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="font-medium">{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="font-medium">{selectedStudent.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Enrollment No:</span>
                      <span className="font-medium">{selectedStudent.enrollment_no || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Academic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">College:</span>
                      <span className="font-medium">{selectedStudent.college_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Course:</span>
                      <span className="font-medium">{selectedStudent.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Department:</span>
                      <span className="font-medium">{selectedStudent.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Year:</span>
                      <span className="font-medium">{selectedStudent.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">CGPA:</span>
                      <span className="font-medium">{selectedStudent.cgpa || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Academic Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">10th Percentage:</span>
                      <span className="font-medium">{selectedStudent.tenth_percentage || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">12th Percentage:</span>
                      <span className="font-medium">{selectedStudent.twelfth_percentage || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Graduation Percentage:</span>
                      <span className="font-medium">{selectedStudent.graduation_percentage || 'N/A'}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                      selectedStudent.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No skills listed</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Online Presence</h3>
                  <div className="space-y-2">
                    {selectedStudent.github_url && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">GitHub:</span>
                        <a href={selectedStudent.github_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          View Profile
                        </a>
                      </div>
                    )}
                    {selectedStudent.linkedin_url && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">LinkedIn:</span>
                        <a href={selectedStudent.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          View Profile
                        </a>
                      </div>
                    )}
                    {selectedStudent.portfolio_url && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Portfolio:</span>
                        <a href={selectedStudent.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                    {selectedStudent.resume_url && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Resume:</span>
                        <a href={selectedStudent.resume_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          Download Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-500">College Verification:</span>
                  <Badge className={selectedStudent.verifiedByCollege ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {selectedStudent.verifiedByCollege ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewDriveRequest;