import { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Users,
  Clock,
  CreditCard,
  FileText,
  Plus,
  Upload,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Building,
  BarChart3,
  Settings,
  Folder,
  MapPin,
  Target,
  Award,
  FolderOpen,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hrmsApi } from '@/lib/api/hrms';
import { AuthContext } from '@/contexts/UnifiedAuthContext';

const HRMSLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const isMainDashboard =
    location.pathname === '/recruiter/hrms' || location.pathname === '/recruiter/hrms/dashboard';

  const navigationItems = [
    { path: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: 'analytics', label: 'Analytics', icon: BarChart3 },
    { path: 'onboard', label: 'Onboard Employee', icon: UserPlus },
    { path: 'employees', label: 'Employee Directory', icon: Users },
    { path: 'attendance', label: 'Attendance', icon: Clock },
    { path: 'leaves', label: 'Leave Manager', icon: Users },
    { path: 'payroll', label: 'Payroll', icon: CreditCard },
    { path: 'performance', label: 'Performance', icon: Award },
    { path: 'org-chart', label: 'Org Chart', icon: Building },
    { path: 'ta-da', label: 'TA/DA', icon: CreditCard },
    { path: 'documents', label: 'Document Vault', icon: FolderOpen },
    { path: 'projects', label: 'Project Management', icon: Briefcase },
    { path: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickActions = [
    { label: 'Onboard Employee', icon: Plus, path: 'onboard' },
    { label: 'Upload Payslip', icon: Upload, path: 'payroll/upload' },
    { label: 'Approve Leaves', icon: CheckCircle, path: 'leave/manager' },
    { label: 'View Feedback', icon: MessageSquare, path: 'performance/feedback' },
  ];

  const [dashboardCards, setDashboardCards] = useState([
    { title: 'Total Employees', value: '0', icon: Users, color: 'text-blue-600' },
    { title: "Today's Attendance", value: '0%', icon: Clock, color: 'text-green-600' },
    { title: 'Payroll Completion', value: '0%', icon: CreditCard, color: 'text-purple-600' },
    { title: 'Pending Approvals', value: '0', icon: FileText, color: 'text-orange-600' },
  ]);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get user ID from auth context
        const userId = auth?.getUserId();
        if (!userId) {
          console.log('No user ID available');
          return;
        }

        const metrics = await hrmsApi.getDashboardMetrics(userId);
        console.log('HRMS metrics received:', metrics);

        // Type the metrics properly with fallbacks
        const typedMetrics = metrics as any;
        setDashboardCards([
          {
            title: 'Total Employees',
            value: typedMetrics?.totalEmployees?.toString() || '0',
            icon: Users,
            color: 'text-blue-600',
          },
          {
            title: "Today's Attendance",
            value: `${typedMetrics?.todayAttendance?.percentage || 0}%`,
            icon: Clock,
            color: 'text-green-600',
          },
          { title: 'Payroll Completion', value: '78%', icon: CreditCard, color: 'text-purple-600' }, // Mock for now
          {
            title: 'Pending Approvals',
            value: typedMetrics?.pendingLeaveApprovals?.toString() || '0',
            icon: FileText,
            color: 'text-orange-600',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (isMainDashboard) {
      fetchDashboardData();
    }
  }, [isMainDashboard, auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/recruiter/dashboard" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">HR Management System</h1>
            </div>

            {/* Quick Actions - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:flex gap-2">
              {quickActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/recruiter/hrms/${action.path}`)}
                  className="flex items-center"
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {navigationItems.map(item => {
            const isActive =
              location.pathname === `/recruiter/hrms/${item.path}` ||
              (item.path === 'dashboard' && isMainDashboard);
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => navigate(`/recruiter/hrms/${item.path}`)}
                className="mb-2 text-xs md:text-sm"
                size="sm"
              >
                <item.icon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Dashboard Cards - Only show on main dashboard */}
        {isMainDashboard && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {dashboardCards.map((card, idx) => (
              <Card key={idx}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-3 w-3 md:h-4 md:w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HRMSLayout;
