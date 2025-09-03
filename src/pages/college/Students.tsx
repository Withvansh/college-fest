import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { 
  Plus, 
  GraduationCap, 
  Mail, 
  Phone, 
  Download,
  Upload,
  Search,
  ArrowLeft,
  FileText
} from "lucide-react";
import { collegeProfileAPI } from '@/lib/api/collegeProfile';

interface Student {
  _id: number;
  full_name: string;
  email: string;
  phone: string;
  enrollment_no: string;
  department: string;
  cgpa: number;
  placementStatus: string;
  company: string | null;
}

const Students = () => {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    enrollment_no: '',
    department: 'CSE',
    cgpa: ''
  });

  // Fetch students data on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      if (!id) {
        toast.error("College ID is missing");
        return;
      }
      
      const response = await collegeProfileAPI.getStudentsByCollegeId(id);
      // console.log(response)
      setStudents(response.data);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch student data");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newStudent = {
        _id: students.length + 1,
        ...formData,
        cgpa: parseFloat(formData.cgpa),
        placementStatus: 'Not Registered',
        company: null
      };

      // Call API to add student
      // await collegeProfileAPI.addStudent(collegeId as string, newStudent);
      
      // Update local state
      setStudents([...students, newStudent]);
      setIsAddModalOpen(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
       enrollment_no: '',
        department: 'CSE',
        cgpa: ''
      });
      
      toast.success("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Roll Number', 'Department', 'CGPA', 'Placement Status', 'Company'],
      ...filteredStudents.map(student => [
        student.full_name,
        student.email,
        student.enrollment_no,
        student.department,
        student.cgpa,
        student.placementStatus,
        student.company || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Student data exported successfully!");
  };

  const handleBulkImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/upload-students', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      toast.success(`Successfully uploaded ${result.count} students`);
      
      // Refresh student data
      fetchStudentData();
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload students. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.enrollment_no.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed': return 'bg-green-100 text-green-700';
      case 'Registered': return 'bg-blue-100 text-blue-700';
      case 'Not Registered': return 'bg-gray-100 text-gray-700';
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
              <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
    <Button 
      variant="outline" 
      onClick={() => document.getElementById('bulk-import-input')?.click()}
      disabled={uploading}
    >
      <Upload className="h-4 w-4 mr-2" />
      Bulk Import
    </Button>
    <Input 
      id="bulk-import-input"
      type="file" 
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden" 
      onChange={handleBulkImport}
      accept=".xlsx,.xls"
      disabled={uploading}
    />
  </div>
  <Button variant="outline" onClick={handleExportData} disabled={students.length === 0}>
    <Download className="h-4 w-4 mr-2" />
    Export Data
  </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          placeholder="Enter student name"
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
                          placeholder="student@college.edu"
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rollNumber">Roll Number</Label>
                        <Input
                          id="rollNumber"
                          value={formData.enrollment_no}
                          onChange={(e) => setFormData({...formData, enrollment_no: e.target.value})}
                          placeholder="CSE21001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CSE">Computer Science</SelectItem>
                            <SelectItem value="ECE">Electronics & Communication</SelectItem>
                            <SelectItem value="Mechanical">Mechanical</SelectItem>
                            <SelectItem value="Civil">Civil</SelectItem>
                            <SelectItem value="IT">Information Technology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cgpa">CGPA</Label>
                        <Input
                          id="cgpa"
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.cgpa}
                          onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                          placeholder="8.5"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                        Add Student
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
            <h2 className="text-xl font-semibold">All Students</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">Computer Science</SelectItem>
                  <SelectItem value="ECE">Electronics & Communication</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="IT">Information Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Placed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {students.filter(s => s.placementStatus === 'Placed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {students.filter(s => s.placementStatus === 'Registered').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Not Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {students.filter(s => s.placementStatus === 'Not Registered').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Placement Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 mr-3 text-gray-400" />
                          <div>
                            <p className="font-medium">{student.full_name}</p>
                            <p className="text-sm text-gray-600">{student.enrollment_no}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {student.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {student.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.department}</p>
                          <p className="text-sm text-gray-600">Final Year</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {student.cgpa}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge className={getStatusColor(student.placementStatus)}>
                            {student.placementStatus}
                          </Badge>
                          {student.company && (
                            <p className="text-sm text-gray-600 mt-1">{student.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No students found. {searchTerm || departmentFilter !== 'all' ? 'Try adjusting your filters.' : 'Add students to get started.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;