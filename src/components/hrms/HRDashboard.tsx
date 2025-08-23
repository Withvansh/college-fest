import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  Plus,
  Upload,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { hrmsApi } from '@/lib/api/hrms';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardMetrics {
  totalEmployees: number;
  todayAttendance: {
    present: number;
    absent: number;
    onLeave: number;
    percentage: number;
  };
  pendingLeaveApprovals: number;
  openPositions: number;
  trainingHours: number;
  employees: any[];
  positions: any[];
  trainingSessions: any[];
}

const HRDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEmployees: 0,
    todayAttendance: { present: 0, absent: 0, onLeave: 0, percentage: 0 },
    pendingLeaveApprovals: 0,
    openPositions: 0,
    trainingHours: 0,
    employees: [],
    positions: [],
    trainingSessions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading dashboard data for user:', user.id);
      const data = await hrmsApi.getDashboardMetrics(user.id);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: 'Onboard Employee',
      icon: Plus,
      href: '/recruiter/hrms/onboard',
      variant: 'default' as const,
    },
    {
      label: 'Upload Payslip',
      icon: Upload,
      href: '/recruiter/hrms/payroll/upload',
      variant: 'outline' as const,
    },
    {
      label: 'Approve Leaves',
      icon: CheckCircle,
      href: '/recruiter/hrms/leave/manager',
      variant: 'outline' as const,
    },
    {
      label: 'View Feedback',
      icon: MessageSquare,
      href: '/recruiter/hrms/performance/feedback',
      variant: 'outline' as const,
    },
  ];

  const recentActivities = [
    ...metrics.employees.slice(0, 2).map(emp => ({
      action: `New employee ${emp.profiles?.full_name || 'Unknown'} onboarded`,
      time: new Date(emp.created_at).toLocaleDateString(),
      type: 'onboard',
    })),
    ...metrics.trainingSessions.slice(0, 2).map(session => ({
      action: `Training session "${session.title}" ${session.status}`,
      time: new Date(session.created_at).toLocaleDateString(),
      type: 'training',
    })),
  ];

  const upcomingTasks = [
    {
      task: 'Employee performance reviews',
      count: Math.floor(metrics.totalEmployees * 0.3),
      priority: 'high' as const,
    },
    {
      task: 'Training sessions to schedule',
      count: metrics.trainingSessions.filter(s => s.status === 'scheduled').length,
      priority: 'medium' as const,
    },
    {
      task: 'Open positions to fill',
      count: metrics.openPositions,
      priority: 'medium' as const,
    },
    {
      task: 'Leave approvals pending',
      count: metrics.pendingLeaveApprovals,
      priority: metrics.pendingLeaveApprovals > 5 ? 'high' : ('low' as const),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back! 👋</h2>
        <p className="text-gray-600">
          Here's what's happening with your team today. You have {metrics.totalEmployees} employees
          and {metrics.openPositions} open positions.
        </p>
      </div>

      {/* Alerts */}
      {(metrics.pendingLeaveApprovals > 0 || metrics.openPositions > 3) && (
        <div className="space-y-2">
          {metrics.pendingLeaveApprovals > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-orange-50 border-orange-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">
                  {metrics.pendingLeaveApprovals} leave applications need approval
                </span>
              </div>
              <Button size="sm" variant="outline">
                Review Now
              </Button>
            </div>
          )}
          {metrics.openPositions > 3 && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {metrics.openPositions} positions are open for hiring
                </span>
              </div>
              <Button size="sm" variant="outline">
                Post Jobs
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.todayAttendance.percentage}%</div>
            <div className="flex space-x-2 text-xs">
              <span className="text-green-600">Present: {metrics.todayAttendance.present}</span>
              <span className="text-red-600">Absent: {metrics.todayAttendance.absent}</span>
              <span className="text-yellow-600">Leave: {metrics.todayAttendance.onLeave}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openPositions}</div>
            <p className="text-xs text-muted-foreground">Hiring opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingLeaveApprovals}</div>
            <p className="text-xs text-muted-foreground">Leave requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Hours</CardTitle>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.trainingHours}</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto py-3 px-4 flex flex-col items-center space-y-2"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'attendance'
                          ? 'bg-green-500'
                          : activity.type === 'leave'
                            ? 'bg-blue-500'
                            : activity.type === 'training'
                              ? 'bg-purple-500'
                              : 'bg-orange-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity. Start by onboarding employees!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks
                .filter(task => task.count > 0)
                .map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.task}</p>
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'destructive'
                            : task.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <Badge variant="outline">{task.count}</Badge>
                  </div>
                ))}
              {upcomingTasks.every(task => task.count === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Great! No urgent tasks pending.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
