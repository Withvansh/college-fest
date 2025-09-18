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
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [cgpaFilter, setCgpaFilter] = useState('all');
  const [profileCompleteFilter, setProfileCompleteFilter] = useState('all');
  const [placementStatusFilter, setPlacementStatusFilter] = useState('all');
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
  const [departments, setDepartments] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [stats, setStats] = useState({
    placed: 0,
    registered: 0,
    notRegistered: 0,
  });

  // Function to start polling for upload status
  const startUploadPolling = () => {
    const collegeId = localStorage.getItem('user_id');
    if (!collegeId) return;

    let interval: number | undefined;

    const poll = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL_EXCEL}/uploads/college/${collegeId}?limit=5`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const uploads = await res.json();
        const active = (uploads || []).find(
          (u: any) => u.status === 'queued' || u.status === 'processing'
        );
        setHasPendingUpload(!!active);
        setPendingJobInfo(active ? { jobId: active.jobId, status: active.status } : null);

        // If no active uploads, stop polling
        if (!active && interval) {
          window.clearInterval(interval);
          interval = undefined;
        }
      } catch (e) {
        console.warn('Upload polling error:', e);
        if (interval) {
          window.clearInterval(interval);
          interval = undefined;
        }
      }
    };

    // Start polling immediately and then every 2s
    poll();
    interval = window.setInterval(poll, 2000) as unknown as number;

    // Store interval reference for cleanup
    return () => {
      if (interval) window.clearInterval(interval);
    };
  };

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

  // Track if any upload is queued/processing in persistent store
  const [hasPendingUpload, setHasPendingUpload] = useState<boolean>(false);
  const [pendingJobInfo, setPendingJobInfo] = useState<{ jobId?: string; status?: string } | null>(
    null
  );

  // Fetch students data on component mount and when pagination/search/filter changes
  useEffect(() => {
    fetchStudentData();
  }, [
    pagination.page,
    pagination.limit,
    sortField,
    sortOrder,
    departmentFilter,
    courseFilter,
    yearFilter,
    cgpaFilter,
    profileCompleteFilter,
    placementStatusFilter,
    searchTerm,
  ]);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  // Update formData department when departments are loaded
  useEffect(() => {
    if (departments.length > 0 && formData.department === 'Computer Science') {
      setFormData(prev => ({
        ...prev,
        department: departments[0],
      }));
    }
  }, [departments]);

  // Update formData course when courses are loaded
  useEffect(() => {
    if (courses.length > 0 && formData.course === 'B.Tech') {
      setFormData(prev => ({
        ...prev,
        course: courses[0],
      }));
    }
  }, [courses]);

  const fetchDepartments = async () => {
    try {
      if (!id) return;

      const response = await collegeProfileAPI.getDepartmentsByCollegeId(id);
      if (response.success && response.departments) {
        // Filter out empty strings and null values
        setDepartments(response.departments.filter(dept => dept && dept.trim() !== ''));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to some default departments if API fails
      setDepartments([
        'Computer Science',
        'Electronics & Communication',
        'Mechanical',
        'Civil',
        'Information Technology',
        'Electrical',
        'Mathematics',
        'Physics',
      ]);
    }
  };

  const fetchCourses = async () => {
    try {
      if (!id) return;

      const response = await collegeProfileAPI.getCoursesByCollegeId(id);
      if (response.success && response.courses) {
        // Filter out empty strings and null values
        setCourses(response.courses.filter(course => course && course.trim() !== ''));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to some default courses if API fails
      setCourses(['B.Tech', 'B.E', 'B.Sc', 'B.Com', 'MBA', 'M.Tech', 'M.Sc']);
    }
  };

  const fetchStudentData = async () => {
    try {
      if (!id) {
        toast.error('College ID is missing');
        return;
      }

      setLoading(true);

      const response = await collegeProfileAPI.getStudentsByCollegeId(id, {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortField,
        order: sortOrder,
        ...(departmentFilter !== 'all' && { department: departmentFilter }),
        ...(courseFilter !== 'all' && { course: courseFilter }),
        ...(yearFilter !== 'all' && { year: yearFilter }),
        ...(cgpaFilter !== 'all' && { cgpa: cgpaFilter }),
        ...(profileCompleteFilter !== 'all' && { profile_complete: profileCompleteFilter }),
        ...(placementStatusFilter !== 'all' && { placementStatus: placementStatusFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      });

      const studentData = response.data.students || response.data;
      setStudents(studentData);
      setFilteredStudents(studentData); // No client-side filtering needed

      console.log(response);

      // Update stats from API response
      if (response.stats) {
        console.log('Received stats from API:', response.stats);
        setStats({
          placed: response.stats.placed || 0,
          registered: response.stats.registered || 0,
          notRegistered: response.stats.notRegistered || 0,
        });
      } else {
        console.log('No stats received from API');
      }

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
          hasPrev: (response.page || 1) > 1,
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
        college_id: localStorage.getItem('user_id'),
        verify: true,
        role: 'student',
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
        department: departments.length > 0 ? departments[0] : 'Computer Science',
        cgpa: '',
        course: courses.length > 0 ? courses[0] : 'B.Tech',
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
      [
        'Name',
        'Email',
        'Roll Number',
        'Department',
        'Course',
        'Year',
        'CGPA',
        'Placement Status',
        'Company',
      ],
      ...filteredStudents.map(student => [
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_EXCEL}/college-status/${collegeId}`
      );
      if (!response.ok) throw new Error('Failed to fetch college status');
      const status = await response.json();
      setUploadStatus(status);

      // If there's an ongoing upload, continue checking
      if (status.status === 'processing') {
        setTimeout(() => checkCollegeStatus(), 2000);
      } else if (status.status === 'completed') {
        toast.success(`Successfully processed ${status.processedStudents} students`);
        fetchStudentData();
        // Stop polling when upload is complete
        setHasPendingUpload(false);
        setPendingJobInfo(null);
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

      // Start polling for upload status
      startUploadPolling();

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
    setCourseFilter('all');
    setYearFilter('all');
    setCgpaFilter('all');
    setProfileCompleteFilter('all');
    setPlacementStatusFilter('all');
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
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Student Management</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    !hasPendingUpload && document.getElementById('bulk-import-input')?.click()
                  }
                  disabled={uploading || uploadStatus?.status === 'processing' || hasPendingUpload}
                  className="text-xs sm:text-sm w-full sm:w-auto"
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
                      <span className="text-xs text-orange-700">
                        {pendingJobInfo?.status === 'queued'
                          ? 'Queued...'
                          : 'Processing students...'}
                      </span>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-orange-600" />
                    </div>
                    {uploadStatus?.totalStudents && uploadStatus?.processedStudents && (
                      <div className="w-full bg-orange-200 rounded-full h-1.5">
                        <div
                          className="bg-orange-600 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(uploadStatus.processedStudents / uploadStatus.totalStudents) * 100}%`,
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
                className="text-xs sm:text-sm w-full sm:w-auto"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Data</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm w-full sm:w-auto"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Student</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto mx-4">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg sm:text-xl">Add New Student</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.full_name}
                          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Enter student name"
                          required
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="student@college.edu"
                          required
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rollNumber" className="text-sm font-medium">
                          Roll Number
                        </Label>
                        <Input
                          id="rollNumber"
                          value={formData.enrollment_no}
                          onChange={e =>
                            setFormData({ ...formData, enrollment_no: e.target.value })
                          }
                          placeholder="CSE21001"
                          required
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department" className="text-sm font-medium">
                          Department
                        </Label>
                        <Select
                          value={formData.department}
                          onValueChange={value => setFormData({ ...formData, department: value })}
                        >
                          <SelectTrigger className="mt-1 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(department => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course" className="text-sm font-medium">
                          Course
                        </Label>
                        <Select
                          value={formData.course}
                          onValueChange={value => setFormData({ ...formData, course: value })}
                        >
                          <SelectTrigger className="mt-1 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map(course => (
                              <SelectItem key={course} value={course}>
                                {course}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="year" className="text-sm font-medium">
                          Year
                        </Label>
                        <Select
                          value={formData.year}
                          onValueChange={value => setFormData({ ...formData, year: value })}
                        >
                          <SelectTrigger className="mt-1 h-10">
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
                      <div>
                        <Label htmlFor="cgpa" className="text-sm font-medium">
                          CGPA
                        </Label>
                        <Input
                          id="cgpa"
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.cgpa}
                          onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                          placeholder="8.5"
                          className="mt-1 h-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-end pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                        className="w-full sm:w-auto h-10"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto h-10"
                      >
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
          <div className="flex flex-col space-y-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">All Students</h2>

            {/* Search and Filter Controls */}
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyPress={e =>
                      e.key === 'Enter' && setPagination(prev => ({ ...prev, page: 1 }))
                    }
                    className="pl-8 sm:pl-10 w-full h-8 sm:h-10 text-sm"
                  />
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4 flex-1 sm:flex-none whitespace-nowrap text-xs sm:text-sm"
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Filters</span>
                    {(departmentFilter !== 'all' ||
                      courseFilter !== 'all' ||
                      yearFilter !== 'all' ||
                      cgpaFilter !== 'all' ||
                      profileCompleteFilter !== 'all' ||
                      placementStatusFilter !== 'all') && (
                      <Badge variant="secondary" className="ml-0.5 sm:ml-1 text-xs px-1">
                        {[
                          departmentFilter !== 'all' ? 1 : 0,
                          courseFilter !== 'all' ? 1 : 0,
                          yearFilter !== 'all' ? 1 : 0,
                          cgpaFilter !== 'all' ? 1 : 0,
                          profileCompleteFilter !== 'all' ? 1 : 0,
                          placementStatusFilter !== 'all' ? 1 : 0,
                        ].reduce((a, b) => a + b, 0)}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                    variant="default"
                    size="sm"
                    className="h-8 sm:h-10 px-3 sm:px-6 flex-1 sm:flex-none whitespace-nowrap text-xs sm:text-sm"
                  >
                    <span className="hidden xs:inline sm:inline">Apply</span>
                    <span className="xs:hidden sm:hidden">Go</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-medium text-xs sm:text-sm">Filters</h3>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs h-7 sm:h-8 px-2 sm:px-3"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="department-filter" className="text-xs sm:text-sm font-medium">
                    Department
                  </Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger
                      id="department-filter"
                      className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(department => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="course-filter" className="text-xs sm:text-sm font-medium">
                    Course
                  </Label>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger
                      id="course-filter"
                      className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="year-filter" className="text-xs sm:text-sm font-medium">
                    Year
                  </Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger
                      id="year-filter"
                      className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="cgpa-filter" className="text-xs sm:text-sm font-medium">
                    CGPA Range
                  </Label>
                  <Select value={cgpaFilter} onValueChange={setCgpaFilter}>
                    <SelectTrigger
                      id="cgpa-filter"
                      className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <SelectValue placeholder="All CGPA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All CGPA</SelectItem>
                      <SelectItem value="9-10">9.0 - 10.0</SelectItem>
                      <SelectItem value="8-9">8.0 - 8.9</SelectItem>
                      <SelectItem value="7-8">7.0 - 7.9</SelectItem>
                      <SelectItem value="6-7">6.0 - 6.9</SelectItem>
                      <SelectItem value="below-6">Below 6.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="profile-filter" className="text-xs sm:text-sm font-medium">
                    Profile Status
                  </Label>
                  <Select value={profileCompleteFilter} onValueChange={setProfileCompleteFilter}>
                    <SelectTrigger
                      id="profile-filter"
                      className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <SelectValue placeholder="All Profiles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Profiles</SelectItem>
                      <SelectItem value="true">Complete</SelectItem>
                      <SelectItem value="false">Incomplete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="placement-filter" className="text-xs sm:text-sm font-medium">
                    Placement Status
                  </Label>
                  <Select value={placementStatusFilter} onValueChange={setPlacementStatusFilter}>
                    <SelectTrigger
                      id="placement-filter"
                      className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Placed">Placed</SelectItem>
                      <SelectItem value="Registered">Registered</SelectItem>
                      <SelectItem value="Not Registered">Not Registered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {pagination.total}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Placed</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                {stats.placed}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Registered
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                {stats.registered}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Not Registered
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">
                {stats.notRegistered}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table View */}
        <Card className="bg-white/80 backdrop-blur-sm overflow-hidden hidden lg:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => handleSortChange('full_name')}
                    >
                      Student Details{' '}
                      {sortField === 'full_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Contact</TableHead>
                    <TableHead
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => handleSortChange('department')}
                    >
                      Academic Info{' '}
                      {sortField === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <TableRow key={student._id} className="hover:bg-gray-50/70">
                        <TableCell>
                          <div className="flex items-center min-w-[180px]">
                            <div className="flex-shrink-0 bg-orange-100 rounded-full p-2 mr-3">
                              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{student.full_name}</p>
                              <p className="text-sm text-gray-600 truncate">
                                {student.enrollment_no}
                              </p>
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
                            <Badge
                              className={getStatusColor(
                                student.placementStatus || 'Not Registered'
                              )}
                            >
                              {student.placementStatus || 'Not Registered'}
                            </Badge>
                            {student.company && (
                              <p className="text-sm text-gray-600 mt-1 truncate">
                                {student.company}
                              </p>
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
                        No students found.{' '}
                        {searchTerm ||
                        departmentFilter !== 'all' ||
                        courseFilter !== 'all' ||
                        yearFilter !== 'all' ||
                        cgpaFilter !== 'all' ||
                        profileCompleteFilter !== 'all' ||
                        placementStatusFilter !== 'all'
                          ? 'Try adjusting your filters.'
                          : 'Add students to get started.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <Card className="bg-white/80 backdrop-blur-sm p-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              </div>
              <p className="mt-2 text-center">Loading students...</p>
            </Card>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <Card key={student._id} className="bg-white/80 backdrop-blur-sm p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0 bg-orange-100 rounded-full p-2">
                      <GraduationCap className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base truncate">{student.full_name}</h3>
                      <p className="text-sm text-gray-600 truncate">{student.enrollment_no}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(student.placementStatus || 'Not Registered')}>
                    {student.placementStatus || 'Not Registered'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{student.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">{student.department}</p>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{student.course}</span>
                      {student.year && <span>• Year {student.year}</span>}
                      <span>• CGPA: {student.cgpa || 'N/A'}</span>
                    </div>
                  </div>

                  {student.company && (
                    <div className="text-gray-600">
                      <span className="font-medium">Company: </span>
                      <span>{student.company}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                  <Link to={`/college/student/${student._id}`} className="flex-1">
                    <Button size="sm" variant="default" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm p-8">
              <div className="text-center text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-sm">
                  {searchTerm ||
                  departmentFilter !== 'all' ||
                  courseFilter !== 'all' ||
                  yearFilter !== 'all' ||
                  cgpaFilter !== 'all' ||
                  profileCompleteFilter !== 'all' ||
                  placementStatusFilter !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'Add students to get started.'}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Common Pagination Controls */}
        {pagination.pages > 1 && (
          <Card className="bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between px-4 py-4 border-t">
                {/* Pagination Info */}
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-xs sm:text-sm text-gray-700 text-center sm:text-left whitespace-nowrap">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} entries
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-700">Show:</span>
                    <Select
                      value={pagination.limit.toString()}
                      onValueChange={value => handleLimitChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-16 sm:w-20 h-8 text-xs sm:text-sm">
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
                </div>

                {/* Pagination Navigation */}
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2">
                  {/* Mobile-first simple pagination */}
                  <div className="flex items-center justify-center sm:hidden space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-3 py-1 bg-gray-100 rounded">
                      {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="h-8 px-3"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Desktop pagination with page numbers */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden md:inline">Previous</span>
                    </Button>

                    {/* Page numbers for desktop */}
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
                            variant={pagination.page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="h-8 w-8 p-0 text-xs"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {pagination.pages > 5 && (
                        <span className="px-2 text-sm text-gray-500">...</span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="h-8 px-3"
                    >
                      <span className="hidden md:inline">Next</span>
                      <ChevronRight className="h-4 w-4 ml-1 md:ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Students;
