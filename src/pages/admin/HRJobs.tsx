
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Plus, Edit, Trash2, Search, Filter, Eye, Copy, TestTube } from 'lucide-react';

const HRJobs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock data for HR job postings
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      status: 'Active', 
      applications: 45,
      datePosted: '2024-01-15',
      salary: '₹10L-12.5L',
      hasTest: true,
      testName: 'Frontend Dev Assessment'
    },
    { 
      id: 2, 
      title: 'Product Manager', 
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      status: 'Closed', 
      applications: 23,
      datePosted: '2024-01-20',
      salary: '₹8.4L-10.9L',
      hasTest: false,
      testName: null
    },
    { 
      id: 3, 
      title: 'UX Designer', 
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Contract',
      status: 'Active', 
      applications: 12,
      datePosted: '2024-01-25',
      salary: '₹7.5L-9.2L',
      hasTest: true,
      testName: 'Design Portfolio Review'
    },
  ]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Closed': return 'secondary';
      case 'Draft': return 'outline';
      default: return 'secondary';
    }
  };

  const handleToggleStatus = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'Active' ? 'Closed' : 'Active' }
        : job
    ));
    toast({
      title: "Job Status Updated",
      description: "The job status has been successfully changed.",
    });
  };

  const handleDuplicateJob = (jobId: number) => {
    const jobToDuplicate = jobs.find(job => job.id === jobId);
    if (jobToDuplicate) {
      const newJob = {
        ...jobToDuplicate,
        id: Date.now(),
        title: `${jobToDuplicate.title} (Copy)`,
        status: 'Draft',
        applications: 0,
        datePosted: new Date().toISOString().split('T')[0]
      };
      setJobs([...jobs, newJob]);
      toast({
        title: "Job Duplicated",
        description: "The job has been successfully duplicated as a draft.",
      });
    }
  };

  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    toast({
      title: "Job Deleted",
      description: "The job posting has been successfully deleted.",
    });
  };

  const CreateJobForm = () => (
    <Dialog open={isCreatingJob} onOpenChange={setIsCreatingJob}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Job Posting</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" placeholder="e.g. Senior Frontend Developer" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. Remote, NYC" />
            </div>
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input id="salary" placeholder="e.g. ₹8.4L-10.9L" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea id="description" placeholder="Describe the role and responsibilities..." rows={4} />
          </div>

          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <Textarea id="skills" placeholder="List required skills and qualifications..." rows={3} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="attach-test" />
            <Label htmlFor="attach-test">Attach Assessment Test</Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsCreatingJob(false)}>
              Save as Draft
            </Button>
            <Button onClick={() => setIsCreatingJob(false)}>
              Publish Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600">Manage your job postings and track applications</p>
        </div>
        <Button onClick={() => setIsCreatingJob(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'Active').length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.applications, 0)}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Tests</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.hasTest).length}</p>
              </div>
              <TestTube className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Management */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs by title or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>
                    {job.hasTest ? (
                      <Badge variant="outline" className="text-green-600">
                        <TestTube className="h-3 w-3 mr-1" />
                        Attached
                      </Badge>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDuplicateJob(job.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleStatus(job.id)}
                        className={job.status === 'Active' ? 'text-red-600' : 'text-green-600'}
                      >
                        {job.status === 'Active' ? 'Close' : 'Activate'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateJobForm />
    </div>
  );
};

export default HRJobs;
