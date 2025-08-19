
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Plus, 
  GraduationCap, 
  Mail, 
  Phone, 
  Filter,
  Download,
  Upload,
  Search,
  ArrowLeft,
  FileText
} from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@college.edu",
      phone: "+91 9876543210",
      rollNumber: "CSE21001",
      department: "CSE",
      cgpa: 8.5,
      placementStatus: "Placed",
      company: "Amazon"
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      phone: "+91 9876543211",
      rollNumber: "ECE21045",
      department: "ECE",
      cgpa: 7.8,
      placementStatus: "Registered",
      company: null
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@college.edu",
      phone: "+91 9876543212",
      rollNumber: "ME21023",
      department: "Mechanical",
      cgpa: 7.2,
      placementStatus: "Not Registered",
      company: null
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    department: 'CSE',
    cgpa: ''
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent = {
      id: students.length + 1,
      ...formData,
      cgpa: parseFloat(formData.cgpa),
      placementStatus: 'Not Registered',
      company: null
    };

    setStudents([...students, newStudent]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      rollNumber: '',
      department: 'CSE',
      cgpa: ''
    });
    
    toast.success("Student added successfully!");
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Roll Number', 'Department', 'CGPA', 'Placement Status', 'Company'],
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.rollNumber,
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
    a.click();
    
    toast.success("Student data exported successfully!");
  };

  const handleBulkImport = () => {
    // Simulate bulk import
    toast.success("Bulk import feature coming soon!");
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
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
              <Button variant="outline" onClick={handleBulkImport}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
              <Button variant="outline" onClick={handleExportData}>
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
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
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
                  <SelectValue />
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
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.rollNumber}</p>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
