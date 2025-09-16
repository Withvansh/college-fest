import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { adminStatsService } from '@/services/adminStatsService';
import { adminRecentActivityService } from '@/services/adminRecentActivityService';

import {
  Users,
  Briefcase,
  TestTube,
  Calendar,
  FileText,
  BarChart3,
  TrendingUp,
  UserCheck,
  Clock,
  AlertTriangle,
  Download,
  Package,
  ShoppingCart,
  User,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'super_admin';
  const basePath = isSuperAdmin ? '/super-admin' : '/admin';

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    testsCreated: 0,
    scheduledInterviews: 0,
    pendingApprovals: 0,
    documentsUploaded: 0,
    activeEmployees: 0,
    newApplications: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await adminStatsService.getStats();

        // Map API response to our stats structure with fallbacks
        const apiData = data as any; // Type assertion for flexible API response
        setStats({
          totalUsers: apiData.totalUsers || 0,
          activeJobs: apiData.activeJobs || 0,
          testsCreated: apiData.testsCreated || apiData.totalInterviews || 0,
          scheduledInterviews: apiData.scheduledInterviews || 0,
          pendingApprovals: apiData.pendingApprovals || apiData.draftJobs || 0,
          documentsUploaded: apiData.documentsUploaded || 0,
          activeEmployees: apiData.activeEmployees || apiData.totalEmployees || 0,
          newApplications: apiData.newApplications || apiData.totalApplications || 0,
          totalProducts: apiData.totalProducts || 0,
          totalOrders: apiData.totalOrders || 0,
          totalRevenue: apiData.totalRevenue || 0,
          monthlyGrowth: apiData.monthlyGrowth || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard statistics. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      const data = await adminRecentActivityService.getRecentActivity();
      setRecentActivity(data);
      setLoadingActivity(false);
    };
    fetchActivity();
  }, []);

  const handleGenerateReport = async () => {
    if (!reportType || !dateRange) {
      toast({
        title: 'Missing Information',
        description: 'Please select report type and date range.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
    toast({
      title: 'Report Generated',
      description: `${reportType} report for ${dateRange} has been generated and downloaded.`,
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'manage-users':
        navigate(`${basePath}/users`);
        break;
      case 'approve-jobs':
        navigate(`${basePath}/jobs?filter=pending`);
        break;
      case 'create-test':
        navigate(`${basePath}/tests`);
        break;
      case 'view-reports':
        navigate(`${basePath}/reports`);
        break;
      case 'onboard':
        navigate(`${basePath}/onboarding`);
        break;
      case 'post-job':
        navigate(`${basePath}/hr-jobs`);
        break;
      case 'schedule-interview':
        navigate(`${basePath}/hr-interviews`);
        break;
      case 'manage-faqs':
        navigate(`${basePath}/faqs`);
        break;
      case 'view-applications':
        navigate(`${basePath}/employees`);
        break;
      default:
        toast({
          title: 'Feature Coming Soon',
          description: 'This feature is being developed.',
        });
    }
  };

  const cardData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12% from last month',
      changeColor: 'text-muted-foreground',
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      change: '+5% from last month',
      changeColor: 'text-muted-foreground',
    },
    {
      title: 'Tests Created',
      value: stats.testsCreated,
      icon: TestTube,
      change: '+18% from last month',
      changeColor: 'text-muted-foreground',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertTriangle,
      change: 'Requires attention',
      changeColor: 'text-orange-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      change: '+7% from last month',
      changeColor: 'text-muted-foreground',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: '+25% from last month',
      changeColor: 'text-muted-foreground',
    },
  ];

  const SuperAdminCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
      {cardData.map((card, index) => (
        <Card key={index} className="p-2 sm:p-3 md:p-4 min-h-[80px] sm:min-h-[90px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={`h-3 w-3 sm:h-4 sm:w-4 ${card.title === 'Pending Approvals' ? 'text-orange-500' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent className="pt-0 pb-1 sm:pb-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{card.value}</div>
            <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin ? 'Super Admin Dashboard' : 'HR Admin Dashboard'}
          </p>
        </div>
        <div className="flex flex-row items-center space-x-2 sm:space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to={`${basePath}/profile`}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {isSuperAdmin ? (
                        <>
                          <SelectItem value="users">User Analytics</SelectItem>
                          <SelectItem value="jobs">Job Performance</SelectItem>
                          <SelectItem value="tests">Test Analytics</SelectItem>
                          <SelectItem value="interviews">Interview Reports</SelectItem>
                          <SelectItem value="platform">Platform Overview</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="hires">Hired Candidates</SelectItem>
                          <SelectItem value="test-results">Test Results</SelectItem>
                          <SelectItem value="interview-stats">Interview Statistics</SelectItem>
                          <SelectItem value="hr-activity">HR Activity</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                      <SelectItem value="last-3-months">Last 3 months</SelectItem>
                      <SelectItem value="last-6-months">Last 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                    {isGeneratingReport ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isSuperAdmin && SuperAdminCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="h-fit">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingActivity ? (
              <p className="text-sm text-muted-foreground">Loading recent activity...</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{activity.action}</p>
                      <p className="text-xs text-gray-600 truncate">{activity.user}</p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {activity.type}
                      </Badge>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="h-14 sm:h-16 lg:h-20 flex-col p-2 sm:p-3"
                onClick={() => handleQuickAction('manage-users')}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                <span className="text-xs sm:text-sm">Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 sm:h-16 lg:h-20 flex-col p-2 sm:p-3"
                onClick={() => handleQuickAction('approve-jobs')}
              >
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                <span className="text-xs sm:text-sm">Approve Jobs</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 sm:h-16 lg:h-20 flex-col p-2 sm:p-3"
                onClick={() => handleQuickAction('create-test')}
              >
                <TestTube className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                <span className="text-xs sm:text-sm">Create Test</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 sm:h-16 lg:h-20 flex-col p-2 sm:p-3"
                onClick={() => handleQuickAction('view-reports')}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                <span className="text-xs sm:text-sm">View Reports</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 sm:h-16 lg:h-20 flex-col p-2 sm:p-3"
                onClick={() => handleQuickAction('manage-faqs')}
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                <span className="text-xs sm:text-sm">Manage FAQs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
