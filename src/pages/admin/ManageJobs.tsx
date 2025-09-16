import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react';
import { jobsApi, Job } from '@/lib/api/jobs';
import { useToast } from '@/hooks/use-toast';

interface JobStats {
  total: number;
  active: number;
  pending: number;
  closed: number;
  totalApplications: number;
}

const ManageJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
    loadStats();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      console.log('Loading jobs...');
      const data = await jobsApi.getAllJobs();
      console.log('Loaded jobs:', data);
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await jobsApi.getJobStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
  };

  const fetchJobs = loadJobs; // For backward compatibility

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'closed':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getApplicationCount = (job: Job) => {
    return job.job_applications?.[0]?.count || 0;
  };

  const handleStatusToggle = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await jobsApi.updateJob(jobId, { status: newStatus });

      toast({
        title: 'Success',
        description: `Job ${newStatus === 'active' ? 'activated' : 'closed'} successfully`,
      });

      loadJobs();
      loadStats();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (
      !window.confirm('Are you sure you want to delete this job? This action cannot be undone.')
    ) {
      return;
    }

    try {
      await jobsApi.deleteJob(jobId);

      toast({
        title: 'Success',
        description: 'Job deleted successfully',
      });

      loadJobs();
      loadStats();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const jobCardData = [
    {
      title: 'Total Jobs',
      value: stats.total,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Jobs',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Applications',
      value: stats.totalApplications,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const renderJobStatsCards = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {jobCardData.map((card, index) => (
        <Card key={index} className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{card.title}</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3">
                <card.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            View and manage all job postings across the platform
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Stats Cards */}
      {renderJobStatsCards()}

      {/* Jobs Management */}
      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Search Section */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 text-sm w-full h-11 sm:h-10"
                />
              </div>
            </div>

            {/* Filter and Clear Section */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full xs:w-auto xs:min-w-[140px] sm:w-48 h-11 sm:h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="w-full xs:w-auto xs:min-w-[80px] h-11 sm:h-10 px-4"
                size="sm"
              >
                <X className="h-4 w-4 mr-1.5" />
                Clear
              </Button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {filteredJobs.map(job => (
              <Card key={job.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{job.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{job.company_name}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(job.status)} className="ml-2 text-xs">
                      {job.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{job.location}</span>
                    <span>{getApplicationCount(job)} applications</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusToggle(job.id, job.status)}
                        className="h-8 px-2"
                      >
                        {job.status === 'active' ? (
                          <XCircle className="h-3 w-3 text-red-500" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company_name}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(job.status)}>{job.status}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(job.id, job.status)}
                          title={job.status === 'active' ? 'Close job' : 'Activate job'}
                        >
                          {job.status === 'active' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{getApplicationCount(job)}</span>
                    </TableCell>
                    <TableCell>{job.profiles?.full_name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="View job">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit job">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          title="Delete job"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageJobs;
