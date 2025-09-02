import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import studentAPI, {
  StudentDashboardData,
  PlacementDrive,
  StudentApplication,
  StudentNotification,
} from '@/lib/api/student';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for UI
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [activeTab, setActiveTab] = useState('drives');

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
  }, [user]);

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
      const notifsData = await studentAPI.getStudentNotifications(user!._id, { limit: 20 });
      setNotifications(notifsData.notifications);
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
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-purple-50"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-5 w-5" />
                {dashboardData.stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {dashboardData.stats.unreadNotifications}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/profile')}
                className="hover:scale-105 transition-transform"
              >
                <Download className="h-4 w-4 mr-2" />
                Resume
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
            <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm border">
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
                value="notifications"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Profile
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
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
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

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {dashboardData.stats.unreadNotifications} unread
                </Badge>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <Card
                        key={notification._id}
                        className={`transition-all duration-300 cursor-pointer ${
                          notification.is_read
                            ? 'bg-gray-50'
                            : 'bg-white border-l-4 border-l-blue-500 shadow-md'
                        }`}
                        onClick={() =>
                          !notification.is_read && handleMarkNotificationRead(notification._id)
                        }
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {notification.title}
                                </h4>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                              <p className="text-xs text-gray-500">
                                {studentAPI.formatDate(notification.created_at)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
                <Button
                  onClick={() => navigate('/student/profile')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-600">Name:</span>{' '}
                            {dashboardData.student.full_name}
                          </p>
                          <p>
                            <span className="text-gray-600">Email:</span>{' '}
                            {dashboardData.student.email}
                          </p>
                          <p>
                            <span className="text-gray-600">Enrollment No:</span>{' '}
                            {dashboardData.student.enrollment_no}
                          </p>
                          {dashboardData.student.phone && (
                            <p>
                              <span className="text-gray-600">Phone:</span>{' '}
                              {dashboardData.student.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Academic Information</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-600">Course:</span>{' '}
                            {dashboardData.student.course}
                          </p>
                          <p>
                            <span className="text-gray-600">Department:</span>{' '}
                            {dashboardData.student.department || 'Not specified'}
                          </p>
                          <p>
                            <span className="text-gray-600">Year:</span>{' '}
                            {dashboardData.student.year}
                          </p>
                          {dashboardData.student.cgpa && (
                            <p>
                              <span className="text-gray-600">CGPA:</span>{' '}
                              {dashboardData.student.cgpa}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Application Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {dashboardData.stats.totalApplications > 0
                        ? Math.round(
                            (dashboardData.stats.selectedApplications /
                              dashboardData.stats.totalApplications) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-gray-600">
                      {dashboardData.stats.selectedApplications} selected out of{' '}
                      {dashboardData.stats.totalApplications} applications
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dashboardData.stats.pendingApplications}
                    </div>
                    <p className="text-sm text-gray-600">Applications under review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {dashboardData.student.profile_complete ? '100%' : '75%'}
                    </div>
                    <p className="text-sm text-gray-600">
                      {dashboardData.student.profile_complete
                        ? 'Profile complete'
                        : 'Complete your profile'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StudentDashboard;
