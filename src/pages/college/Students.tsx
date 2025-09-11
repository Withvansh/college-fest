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
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';
import {
  Plus,
  GraduationCap,
  Mail,
  Phone,
  Download,
  Upload,
  Search,
  ArrowLeft,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { collegeProfileAPI } from '@/lib/api/collegeProfile';
import axiosInstance from '@/lib/utils/axios';

interface Student {
  _id?: string;
  full_name: string;
  email: string;
  phone?: string;
  enrollment_no: string;
  department: string;
  cgpa?: number;
  college_id: string;
  password: string;
  verifiedByCollege?: boolean;
  verify: boolean;
  placementStatus?: string;
  company?: string;
  role?: string;
  course?: string;
  year?: number;
  profile_complete?: boolean;
  created_at?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const Students = () => {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    status?: string;
    totalStudents?: number;
    processedStudents?: number;
    currentJobId?: string;
    error?: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    enrollment_no: '',
    department: 'Computer Science',
    cgpa: '',
    course: 'B.Tech',
    year: '1',
  });

  // Track if any upload is queued/processing in persistent store
  const [hasPendingUpload, setHasPendingUpload] = useState<boolean>(false);
  const [pendingJobInfo, setPendingJobInfo] = useState<{ jobId?: string; status?: string } | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  });
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);

  // Fetch students data on component mount and when pagination changes
  useEffect(() => {
    fetchStudentData();
  }, [pagination.page, pagination.limit, sortField, sortOrder, departmentFilter, searchTerm]);

  // Poll persistent uploads API for this college
  useEffect(() => {
    const collegeId = localStorage.getItem('user_id');
    if (!collegeId) return;

    let interval: number | undefined;
    const poll = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL_EXCEL}/uploads/college/${collegeId}?limit=5`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch uploads');
        const uploads = await res.json();
        const active = (uploads || []).find((u: any) => u.status === 'queued' || u.status === 'processing');
        setHasPendingUpload(!!active);
        setPendingJobInfo(active ? { jobId: active.jobId, status: active.status } : null);

        // If still pending, keep polling; otherwise clear
        if (!active && interval) {
          window.clearInterval(interval);
        }
      } catch (e) {
        // don't spam toasts here; keep UI resilient
        console.error('Upload polling error', e);
      }
    };

    // Start immediately and then every 2s
    poll();
    interval = window.setInterval(poll, 2000) as unknown as number;

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const fetchStudentData = async () => {
    try {
      if (!id) {
        toast.error('College ID is missing');
        return;
      }

      setLoading(true);
      
      const response = await collegeProfileAPI.getStudentsByCollegeId(
        id, 
        { 
          page: pagination.page.toString(), 
          limit: pagination.limit.toString(),
          sort: sortField,
          order: sortOrder,
          ...(departmentFilter !== 'all' && { department: departmentFilter }),
          ...(searchTerm && { search: searchTerm })
        }
      );
      
      setStudents(response.data.students || response.data);
      console.log(response)
      // Update pagination info if available from API
      if (response.total !== undefined) {
        // Handle case where API returns total, page, pages, limit directly
        setPagination(prev => ({
          ...prev,
          total: response.total || 0,
          page: response.page || 1,
          pages: response.pages || 1,
          limit: response.limit || 10,
          hasNext: (response.page || 1) < (response.pages || 1),
          hasPrev: (response.page || 1) > 1
        }));
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newStudent = {
        ...formData,
        cgpa: parseFloat(formData.cgpa),
        password: formData.enrollment_no,
        verifiedByCollege: true,
        college_id: localStorage.getItem("user_id"),
        verify: true,
        role: "Student",
        year: parseInt(formData.year),
        phone: formData.phone || '',
      };

      const response = await axiosInstance.post('/user/register/students', newStudent);
      if (response) {
        setIsAddModalOpen(false);
        // Refresh the student list
        fetchStudentData();
      }
      
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        enrollment_no: '',
        department: 'Computer Science',
        cgpa: '',
        course: 'B.Tech',
        year: '1',
      });

      toast.success('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Roll Number', 'Department', 'Course', 'Year', 'CGPA', 'Placement Status', 'Company'],
      ...students.map(student => [
        student.full_name,
        student.email,
        student.enrollment_no,
        student.department,
        student.course || 'N/A',
        student.year || 'N/A',
        student.cgpa || 'N/A',
        student.placementStatus || 'Not Registered',
        student.company || 'N/A',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Student data exported successfully!');
  };

  const checkUploadStatus = async (jobId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_EXCEL}/upload-status/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch status');
      const status = await response.json();
      return status;
    } catch (error) {
      console.error('Error checking status:', error);
      return null;
    }
  };

  const checkCollegeStatus = async () => {
    try {
      const collegeId = localStorage.getItem('user_id');
      const response = await fetch(`${import.meta.env.VITE_API_URL_EXCEL}/college-status/${collegeId}`);
      if (!response.ok) throw new Error('Failed to fetch college status');
      const status = await response.json();
      setUploadStatus(status);
      
      // If there's an ongoing upload, continue checking
      if (status.status === 'processing') {
        setTimeout(() => checkCollegeStatus(), 2000);
      } else if (status.status === 'completed') {
        toast.success(`Successfully processed ${status.processedStudents} students`);
        fetchStudentData();
      }
    } catch (error) {
      console.error('Error checking college status:', error);
    }
  };

  const handleBulkImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    if (hasPendingUpload) {
      toast.error('An upload is already in progress. Please wait until it completes.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL_EXCEL}/upload-students/${localStorage.getItem('user_id')}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      toast.success('File uploaded successfully. Processing students...');
      
      // Mark as pending immediately and rely on polling to reflect state
      setHasPendingUpload(true);
      setPendingJobInfo({ jobId: result.jobId, status: 'queued' });

      // Start checking status
      checkCollegeStatus();

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload students. Please try again.');
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleSearch = () => {
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStudentData();
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-green-100 text-green-700';
      case 'Registered':
        return 'bg-blue-100 text-blue-700';
      case 'Not Registered':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/college/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Management</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => !hasPendingUpload && document.getElementById('bulk-import-input')?.click()}
                  disabled={uploading || uploadStatus?.status === 'processing' || hasPendingUpload}
                  className="text-xs sm:text-sm"
                >
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {hasPendingUpload ? 'Upload in progress' : 'Bulk Import'}
                </Button>
                <Input
                  id="bulk-import-input"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
                  onChange={handleBulkImport}
                  accept=".xlsx,.xls"
                  disabled={uploading || uploadStatus?.status === 'processing' || hasPendingUpload}
                />
                {(uploadStatus?.status === 'processing' || hasPendingUpload) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-orange-50 border border-orange-200 rounded-md p-2 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-orange-700">{pendingJobInfo?.status === 'queued' ? 'Queued...' : 'Processing students...'}</span>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-orange-600" />
                    </div>
                    {uploadStatus?.totalStudents && uploadStatus?.processedStudents && (
                      <div className="w-full bg-orange-200 rounded-full h-1.5">
                        <div
                          className="bg-orange-600 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(uploadStatus.processedStudents / uploadStatus.totalStudents) * 100}%`
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportData} 
                disabled={students.length === 0}
                className="text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Export Data
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm" size="sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.full_name}
                          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Enter student name"
                          required
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="student@college.edu"
                          required
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="rollNumber">Roll Number</Label>
                        <Input
                          id="rollNumber"
                          value={formData.enrollment_no}
                          onChange={e =>
                            setFormData({ ...formData, enrollment_no: e.target.value })
                          }
                          placeholder="CSE21001"
                          required
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={formData.department}
                          onValueChange={value => setFormData({ ...formData, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                            <SelectItem value="Mechanical">Mechanical</SelectItem>
                            <SelectItem value="Civil">Civil</SelectItem>
                            <SelectItem value="IT">Information Technology</SelectItem>
                            <SelectItem value="Electrical">Electrical</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="course">Course</Label>
                        <Select
                          value={formData.course}
                          onValueChange={value => setFormData({ ...formData, course: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="B.Tech">B.Tech</SelectItem>
                            <SelectItem value="B.E">B.E</SelectItem>
                            <SelectItem value="B.Sc">B.Sc</SelectItem>
                            <SelectItem value="B.Com">B.Com</SelectItem>
                            <SelectItem value="MBA">MBA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="year">Year</Label>
                        <Select
                          value={formData.year}
                          onValueChange={value => setFormData({ ...formData, year: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                            <SelectItem value="5">5th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="cgpa">CGPA</Label>
                        <Input
                          id="cgpa"
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.cgpa}
                          onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                          placeholder="8.5"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                      >
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

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">All Students</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-48">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  className="pl-10 w-full"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 w-full sm:w-auto"
              >
                <Filter className="h-4 w-4" />
                Filters
                {departmentFilter !== 'all' && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </Button>
              <Button onClick={handleSearch} variant="default" size="sm" className="w-full sm:w-auto">
                Apply
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Filters</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
                    Clear All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="h-8 px-2">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department-filter">Department</Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger id="department-filter" className="w-full">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Placed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {students.filter(s => s.placementStatus === 'Placed').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {students.filter(s => s.placementStatus === 'Registered').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Not Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-600">
                {students.filter(s => s.placementStatus === 'Not Registered' || !s.placementStatus).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => handleSortChange('full_name')}
                    >
                      Student Details {sortField === 'full_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Contact</TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => handleSortChange('department')}
                    >
                      Academic Info {sortField === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => handleSortChange('cgpa')}
                    >
                      CGPA {sortField === 'cgpa' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Placement Status</TableHead>
                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                        </div>
                        <p className="mt-2">Loading students...</p>
                      </TableCell>
                    </TableRow>
                  ) : students.length > 0 ? (
                    students.map(student => (
                      <TableRow key={student._id} className="hover:bg-gray-50/70">
                        <TableCell>
                          <div className="flex items-center min-w-[180px]">
                            <div className="flex-shrink-0 bg-orange-100 rounded-full p-2 mr-3">
                              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{student.full_name}</p>
                              <p className="text-sm text-gray-600 truncate">{student.enrollment_no}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 min-w-[150px]">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{student.email}</span>
                            </div>
                            {student.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{student.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[120px]">
                            <p className="font-medium truncate">{student.department}</p>
                            <div className="text-sm text-gray-600 flex flex-wrap gap-1">
                              <span>{student.course}</span>
                              {student.year && <span>• Year {student.year}</span>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {student.cgpa || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[120px]">
                            <Badge className={getStatusColor(student.placementStatus || 'Not Registered')}>
                              {student.placementStatus || 'Not Registered'}
                            </Badge>
                            {student.company && (
                              <p className="text-sm text-gray-600 mt-1 truncate">{student.company}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Link to={`/college/student/${student._id}`}>
                              <Button size="sm" variant="outline" className="h-8">
                                View
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No students found.{" "}
                        {searchTerm || departmentFilter !== 'all'
                          ? 'Try adjusting your filters.'
                          : 'Add students to get started.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
           
            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                  </span>
                  <Select
                    value={pagination.limit.toString()}
                    onValueChange={(value) => handleLimitChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {pagination.pages > 5 && (
                      <span className="px-2">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="h-8"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;