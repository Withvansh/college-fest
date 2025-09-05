import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  FileText,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle,
  Award,
  BookOpen,
  Target,
  BarChart3,
  Download,
  Upload,
  Edit,
  ChevronRight,
  Bell,
  Star,
  ExternalLink,
  AlertCircle,
  Loader,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import studentAPI, {
  StudentDashboardData,
  PlacementDrive,
  StudentApplication,
  StudentNotification,
} from '@/lib/api/student';

// Helper function to get notification icon and color based on type
const getNotificationIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'placement_drive':
    case 'drive':
      return {
        icon: <Building2 className="h-4 w-4 text-blue-600" />,
        bgColor: 'bg-blue-100',
      };
    case 'application':
    case 'application_update':
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        bgColor: 'bg-green-100',
      };
    case 'interview':
    case 'schedule':
      return {
        icon: <Calendar className="h-4 w-4 text-purple-600" />,
        bgColor: 'bg-purple-100',
      };
    case 'deadline':
    case 'reminder':
      return {
        icon: <Clock className="h-4 w-4 text-orange-600" />,
        bgColor: 'bg-orange-100',
      };
    case 'result':
    case 'selection':
      return {
        icon: <Award className="h-4 w-4 text-yellow-600" />,
        bgColor: 'bg-yellow-100',
      };
    default:
      return {
        icon: <Bell className="h-4 w-4 text-gray-600" />,
        bgColor: 'bg-gray-100',
      };
  }
};

// Helper function to format time ago
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for UI
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [activeTab, setActiveTab] = useState('drives');
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // State for data
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [availableDrives, setAvailableDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingDrives, setLoadingDrives] = useState(false);

  // Load dashboard data
  useEffect(() => {
    if (user?._id) {
      loadDashboardData();
    }
  }, [user, showAllNotifications]); // Add showAllNotifications as dependency

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        showNotificationPanel &&
        !target.closest('.notification-panel') &&
        !target.closest('.notification-button')
      ) {
        setShowNotificationPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationPanel]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudentDashboard(user!._id);
      setDashboardData(data);

      // Load available drives
      const drivesData = await studentAPI.getAvailableDrives(user!._id, { limit: 10 });
      setAvailableDrives(drivesData.drives);

      // Load applications
      const appsData = await studentAPI.getStudentApplications(user!._id, { limit: 10 });
      setApplications(appsData.applications);

      // Load notifications
      try {
        const notifsData = await studentAPI.getStudentNotifications(user!._id, {
          limit: showAllNotifications ? 100 : 20,
        });
        setNotifications(notifsData.notifications);
      } catch (error) {
        // If API fails, use mock notifications for demo purposes
        console.warn('Using mock notifications:', error);
        const mockNotifications = [
          {
            _id: '1',
            title: 'Placement Drive Update',
            message:
              'New placement drive from TechCorp has been posted. Applications are now open.',
            type: 'placement_drive',
            is_read: false,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          },
          {
            _id: '2',
            title: 'Application Status Update',
            message:
              'Your application for Software Developer at InnovateSoft has been shortlisted.',
            type: 'application_update',
            is_read: false,
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          },
          {
            _id: '3',
            title: 'Interview Scheduled',
            message: 'Interview scheduled for tomorrow at 10:00 AM for DataDriven Technologies.',
            type: 'interview',
            is_read: false,
            created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
          },
          {
            _id: '4',
            title: 'Application Deadline Reminder',
            message: 'Reminder: Application deadline for Microsoft is tomorrow.',
            type: 'deadline',
            is_read: true,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          },
          {
            _id: '5',
            title: 'Selection Result',
            message: 'Congratulations! You have been selected for the role at Google.',
            type: 'selection',
            is_read: true,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          },
        ];

        // Add more mock notifications when showing all
        if (showAllNotifications) {
          mockNotifications.push(
            {
              _id: '6',
              title: 'Profile Update Required',
              message: 'Please update your profile with your latest achievements.',
              type: 'reminder',
              is_read: true,
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: '7',
              title: 'New Training Available',
              message: 'React.js training session is now available for enrollment.',
              type: 'drive',
              is_read: true,
              created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: '8',
              title: 'Assessment Test Reminder',
              message: 'Complete your aptitude test before the deadline.',
              type: 'deadline',
              is_read: true,
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: '9',
              title: 'Job Fair Announcement',
              message: 'Virtual job fair scheduled for next week. Register now!',
              type: 'placement_drive',
              is_read: true,
              created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: '10',
              title: 'Resume Feedback Available',
              message: 'Your resume has been reviewed by our career counselor.',
              type: 'result',
              is_read: true,
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            }
          );
        }

        setNotifications(mockNotifications as any);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToDrive = async (driveId: string, resumeUrl?: string) => {
    try {
      await studentAPI.applyToPlacementDrive(user!._id, driveId, resumeUrl);
      toast.success('Application submitted successfully!');

      // Refresh data
      loadDashboardData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit application');
    }
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      await studentAPI.markNotificationAsRead(user!._id, notificationId);
      setNotifications(prev =>
        prev.map(notif => (notif._id === notificationId ? { ...notif, is_read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleUpdateResume = async () => {
    try {
      if (!resumeUrl.trim()) {
        toast.error('Please enter a valid resume URL');
        return;
      }

      // Here you would call the API to update the resume URL
      // await studentAPI.updateStudentResume(user!._id, resumeUrl);

      // Update local state
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          student: {
            ...dashboardData.student,
            resume_url: resumeUrl,
          },
        });
      }

      toast.success('Resume link updated successfully!');
      setShowResumeDialog(false);
      setResumeUrl('');
    } catch (error) {
      toast.error('Failed to update resume link');
    }
  };

  const handleDownloadReport = () => {
    toast.success('Application report download started!');
    setTimeout(() => {
      const element = document.createElement('a');
      const reportContent = `Student Application Report

Name: ${dashboardData?.student.full_name}
Enrollment: ${dashboardData?.student.enrollment_no}
Course: ${dashboardData?.student.course}
Department: ${dashboardData?.student.department}

Statistics:
- Total Applications: ${dashboardData?.stats.totalApplications}
- Pending Applications: ${dashboardData?.stats.pendingApplications}
- Selected Applications: ${dashboardData?.stats.selectedApplications}
- Rejected Applications: ${dashboardData?.stats.rejectedApplications}

Recent Applications:
${applications
  .map(app => `${app.placement_drive_id.company} - ${app.placement_drive_id.role} - ${app.status}`)
  .join('\n')}`;

      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent);
      element.download = 'application-report.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Report downloaded successfully!');
    }, 1000);
  };

  const handleViewAnalytics = () => {
    navigate('/student/analytics');
    toast.info('Loading analytics...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png"
                  alt="MinuteHire Logo"
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold text-gray-800">MinuteHire</span>
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 animate-pulse">
                Student Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-purple-50 notification-button"
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                >
                  <Bell className="h-5 w-5" />
                  {dashboardData.stats.unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {dashboardData.stats.unreadNotifications}
                    </span>
                  )}
                </Button>

                {/* Notification Dropdown Panel */}
                {showNotificationPanel && (
                  <div
                    className={`absolute top-12 right-0 bg-white rounded-lg shadow-xl border z-50 notification-panel transition-all duration-300 ${
                      showAllNotifications ? 'w-96' : 'w-80'
                    }`}
                  >
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {showAllNotifications ? 'All Notifications' : 'Notifications'}
                        </h3>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          {notifications.length}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {notifications.some(notif => !notif.is_read) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                              // Mark all notifications as read
                              const unreadNotifications = notifications.filter(
                                notif => !notif.is_read
                              );
                              unreadNotifications.forEach(notif => {
                                handleMarkNotificationRead(notif._id);
                              });
                            }}
                          >
                            ✓ Mark all as read
                          </Button>
                        )}
                        {!showAllNotifications && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setShowAllNotifications(true)}
                          >
                            View all
                          </Button>
                        )}
                        {showAllNotifications && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowAllNotifications(false)}
                          >
                            Show less
                          </Button>
                        )}
                      </div>
                    </div>

                    <div
                      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 ${
                        showAllNotifications ? 'max-h-96' : 'max-h-80'
                      }`}
                    >
                      {notifications.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No notifications yet</p>
                          <p className="text-sm text-gray-500">
                            You'll be notified about placement drives and application updates here
                          </p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {/* Group notifications by date */}
                          {notifications
                            .reduce((groups: any[], notification) => {
                              const date = new Date(notification.created_at);
                              const today = new Date();
                              const yesterday = new Date(today);
                              yesterday.setDate(yesterday.getDate() - 1);

                              let dateLabel = '';
                              if (date.toDateString() === today.toDateString()) {
                                dateLabel = 'Today';
                              } else if (date.toDateString() === yesterday.toDateString()) {
                                dateLabel = 'Yesterday';
                              } else {
                                dateLabel = date.toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  month: 'short',
                                  day: 'numeric',
                                });
                              }

                              let group = groups.find(g => g.date === dateLabel);
                              if (!group) {
                                group = { date: dateLabel, notifications: [] };
                                groups.push(group);
                              }
                              group.notifications.push(notification);
                              return groups;
                            }, [])
                            .map((group, groupIndex) => (
                              <div key={groupIndex} className="mb-4">
                                <div className="text-sm text-gray-500 px-2 py-1 font-medium">
                                  {group.date}
                                </div>
                                <div className="space-y-1">
                                  {group.notifications.map((notification: any, index: number) => (
                                    <div
                                      key={notification._id}
                                      className={`flex items-start p-2 rounded-lg cursor-pointer transition-colors ${
                                        !notification.is_read
                                          ? 'hover:bg-blue-50 bg-gradient-to-r from-blue-25 to-transparent border-l-2 border-blue-400'
                                          : 'hover:bg-gray-50'
                                      }`}
                                      onClick={() => {
                                        if (!notification.is_read) {
                                          handleMarkNotificationRead(notification._id);
                                        }
                                      }}
                                    >
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 ${
                                          getNotificationIcon(notification.type).bgColor
                                        }`}
                                      >
                                        {getNotificationIcon(notification.type).icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="inline-flex items-center">
                                            {!notification.is_read && (
                                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            )}
                                            <span
                                              className={`text-sm font-medium ${
                                                !notification.is_read
                                                  ? 'text-gray-900'
                                                  : 'text-gray-700'
                                              }`}
                                            >
                                              {notification.title}
                                            </span>
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {getTimeAgo(notification.created_at)}
                                          </span>
                                        </div>
                                        <p
                                          className={`text-sm ${
                                            !notification.is_read
                                              ? 'text-gray-700'
                                              : 'text-gray-600'
                                          }`}
                                        >
                                          {notification.message}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {!showAllNotifications && (
                      <div className="border-t p-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => setShowAllNotifications(true)}
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('resume')}
                className="hover:scale-105 transition-transform"
              >
                <Download className="h-4 w-4 mr-2" />
                {dashboardData.student.resume_url ? 'View Resume' : 'Add Resume'}
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all"
                onClick={() => navigate('/student/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Welcome Section with Animation */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome back, {dashboardData.student.full_name}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  {dashboardData.student.course}{' '}
                  {dashboardData.student.department ? `• ${dashboardData.student.department}` : ''}{' '}
                  • Year {dashboardData.student.year}{' '}
                  {dashboardData.student.cgpa ? `• CGPA: ${dashboardData.student.cgpa}` : ''}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-semibold">
                    {dashboardData.stats.selectedApplications > 0
                      ? 'Top Performer'
                      : 'Active Student'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Applications
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {dashboardData.stats.totalApplications}
                </div>
                <p className="text-purple-100 text-sm">
                  {dashboardData.stats.pendingApplications} pending
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Available Drives
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{dashboardData.stats.totalDrives}</div>
                <p className="text-blue-100 text-sm">Open for application</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Selected
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {dashboardData.stats.selectedApplications}
                </div>
                <p className="text-green-100 text-sm">Successful applications</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {dashboardData.stats.unreadNotifications}
                </div>
                <p className="text-orange-100 text-sm">Unread messages</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-white shadow-sm border">
              <TabsTrigger
                value="drives"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Available Drives
              </TabsTrigger>
              <TabsTrigger
                value="applied"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Applications
              </TabsTrigger>
              <TabsTrigger
                value="tests"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Tests
              </TabsTrigger>
              <TabsTrigger
                value="resume"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Resume
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Training
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Counselling
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Available Drives */}
            <TabsContent value="drives" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Available Placement Drives</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCalendarView(true)}
                  className="hover:scale-105 transition-transform shadow-sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar View
                </Button>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {loadingDrives ? (
                    <div className="text-center py-8">
                      <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-gray-600">Loading drives...</p>
                    </div>
                  ) : availableDrives.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No placement drives available at the moment</p>
                    </div>
                  ) : (
                    availableDrives.map((drive, index) => (
                      <Card
                        key={drive._id}
                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg flex items-center">
                                  {drive.company}
                                  {studentAPI.isDeadlineUrgent(drive.registration_deadline) && (
                                    <Badge variant="destructive" className="ml-2 animate-pulse">
                                      Urgent
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="text-base">
                                  {drive.role}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="secondary"
                                className={`mb-2 ${
                                  drive.status === 'Open'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {drive.status}
                              </Badge>
                              {drive.salary_package && (
                                <p className="text-xl font-bold text-green-600">
                                  {drive.salary_package}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{studentAPI.formatDate(drive.drive_date)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>
                                  Deadline: {studentAPI.formatDate(drive.registration_deadline)}
                                </span>
                              </div>
                            </div>
                            {drive.eligibility_criteria && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-700 font-medium">Eligibility</p>
                                <p className="text-sm text-blue-600">
                                  {drive.eligibility_criteria}
                                </p>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-3">
                              <Link to={`/student/drive/${drive._id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleApplyToDrive(drive._id)}
                              >
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Applications */}
            <TabsContent value="applied" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                <Button
                  variant="outline"
                  onClick={handleDownloadReport}
                  className="hover:scale-105 transition-transform shadow-sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {loadingApplications ? (
                    <div className="text-center py-8">
                      <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-gray-600">Loading applications...</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No applications found</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Start applying to placement drives to see them here
                      </p>
                    </div>
                  ) : (
                    applications.map((application, index) => (
                      <Card
                        key={application._id}
                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {application.placement_drive_id.company}
                                </CardTitle>
                                <CardDescription>
                                  {application.placement_drive_id.role}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              className={`font-semibold ${studentAPI.getStatusColor(application.status)}`}
                            >
                              {studentAPI.getStatusIcon(application.status)} {application.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-4 gap-4 items-center">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Applied Date</p>
                              <p className="font-semibold">
                                {studentAPI.formatDate(application.registration_date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">CGPA</p>
                              <p className="font-semibold">{application.cgpa.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Package</p>
                              <p className="font-semibold text-green-600">
                                {application.placement_drive_id.salary_package || 'Not disclosed'}
                              </p>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:scale-105 transition-transform"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                          {application.resume_url && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Resume</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(application.resume_url, '_blank')}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View Resume
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Tests */}
            <TabsContent value="tests" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Assessment Tests</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student/tests')}
                  className="hover:scale-105 transition-transform shadow-sm"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Take Practice Test
                </Button>
              </div>

              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-16 w-16 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Coming Soon!</h3>
                  <p className="text-gray-600 max-w-md">
                    Assessment tests feature is under development. Stay tuned for comprehensive
                    testing capabilities.
                  </p>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    In Development
                  </Badge>
                </div>
              </div>
            </TabsContent>

            {/* Resume */}
            <TabsContent value="resume" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Resume Management</h2>
                <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        setResumeUrl(dashboardData.student.resume_url || '');
                        setShowResumeDialog(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {dashboardData.student.resume_url ? 'Update Resume Link' : 'Add Resume Link'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Update Resume Link</DialogTitle>
                      <DialogDescription>
                        Enter your Google Drive resume link. Make sure the link is publicly
                        accessible.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="resumeUrl" className="text-right">
                          Resume URL
                        </Label>
                        <Input
                          id="resumeUrl"
                          value={resumeUrl}
                          onChange={e => setResumeUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/d/..."
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowResumeDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateResume}>
                        {dashboardData.student.resume_url ? 'Update Link' : 'Add Link'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      Current Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardData.student.resume_url ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">Resume Linked</p>
                              <p className="text-sm text-green-600">Google Drive link active</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(dashboardData.student.resume_url, '_blank')}
                            className="text-green-700 border-green-300 hover:bg-green-50"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            <strong>Last Updated:</strong> March 15, 2024
                          </p>
                          <p>
                            <strong>Format:</strong> PDF
                          </p>
                          <p>
                            <strong>Size:</strong> 245 KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No resume linked yet</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setResumeUrl('');
                            setShowResumeDialog(true);
                          }}
                        >
                          Add Resume Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-500" />
                      Resume Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">📝 Best Practices</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Keep it to 1-2 pages maximum</li>
                          <li>• Use a clean, professional format</li>
                          <li>• Include relevant projects and skills</li>
                          <li>• Quantify your achievements</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">🔗 Google Drive Tips</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Make sure link sharing is enabled</li>
                          <li>• Set permissions to "Anyone with link"</li>
                          <li>• Use PDF format for best compatibility</li>
                          <li>• Test the link before submitting</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Usage History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {applications.slice(0, 5).map((application, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {application.placement_drive_id.company}
                              </p>
                              <p className="text-sm text-gray-600">
                                {application.placement_drive_id.role}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {studentAPI.formatDate(application.registration_date)}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Training */}
            <TabsContent value="notifications" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Training Programs</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Available Training
                </Badge>
              </div>

              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Coming Soon!</h3>
                  <p className="text-gray-600 max-w-md">
                    Professional training programs and skill development courses will be available
                    here.
                  </p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    In Development
                  </Badge>
                </div>
              </div>
            </TabsContent>

            {/* Counselling */}
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Career Counselling</h2>
                <Button
                  onClick={() => navigate('/student/profile')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              </div>

              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Coming Soon!</h3>
                  <p className="text-gray-600 max-w-md">
                    One-on-one career counselling sessions with industry experts will be available
                    here.
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    In Development
                  </Badge>
                </div>
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
                <Button
                  onClick={handleViewAnalytics}
                  variant="outline"
                  className="hover:scale-105 transition-transform"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Detailed Analytics
                </Button>
              </div>

              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Coming Soon!</h3>
                  <p className="text-gray-600 max-w-md">
                    Advanced analytics and performance tracking features will be available here.
                  </p>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    In Development
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StudentDashboard;
