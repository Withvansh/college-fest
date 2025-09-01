import { useState } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import ApplyDriveModal from '@/components/student/ApplyDriveModal';
import ApplicationDetailsModal from '@/components/student/ApplicationDetailsModal';
import ScheduleInterviewModal from '@/components/student/ScheduleInterviewModal';
import UploadResumeModal from '@/components/student/UploadResumeModal';
import EditProfileModal from '@/components/student/EditProfileModal';
import CalendarView from '@/components/student/CalendarView';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [activeTab, setActiveTab] = useState('drives');

  const upcomingDrives = [
    {
      id: 1,
      company: 'Google Inc.',
      role: 'Software Engineer',
      date: 'Jan 15, 2025',
      deadline: 'Jan 10, 2025',
      package: '₹25 LPA',
      eligibility: 'CSE, IT - 7.5+ CGPA',
      status: 'Open',
      urgent: true,
    },
    {
      id: 2,
      company: 'Microsoft',
      role: 'Product Manager',
      date: 'Jan 22, 2025',
      deadline: 'Jan 18, 2025',
      package: '₹22 LPA',
      eligibility: 'All Branches - 8.0+ CGPA',
      status: 'Open',
      urgent: false,
    },
  ];

  const appliedDrives = [
    {
      id: 1,
      company: 'Amazon',
      role: 'SDE-1',
      appliedDate: 'Dec 15, 2024',
      status: 'Test Completed',
      testScore: '85%',
      nextRound: 'Technical Interview',
    },
    {
      id: 2,
      company: 'Flipkart',
      role: 'Data Analyst',
      appliedDate: 'Dec 10, 2024',
      status: 'Selected',
      testScore: '92%',
      nextRound: 'HR Interview',
    },
  ];

  const handleApplyClick = drive => {
    setSelectedDrive(drive);
    setApplyModalOpen(true);
    toast.success('Opening application form...');
  };

  const handleViewDetails = application => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleScheduleInterview = company => {
    setSelectedCompany(company);
    setScheduleModalOpen(true);
  };

  const handleDownloadReport = () => {
    toast.success('Application report download started!');
    setTimeout(() => {
      const element = document.createElement('a');
      element.href =
        'data:text/plain;charset=utf-8,' +
        encodeURIComponent(
          `Student Application Report\n\nName: Rahul Sharma\nCollege: MIT College of Engineering\nApplications: ${appliedDrives.length}\nAverage Score: 87%\n\nDetailed History:\n${appliedDrives.map(app => `${app.company} - ${app.status} - ${app.testScore}`).join('\n')}`
        );
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

  if (showCalendarView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadModalOpen(true)}
                  className="hover:scale-105 transition-transform"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all"
                  asChild
                >
                  <Link to="/student/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <CalendarView onBack={() => setShowCalendarView(false)} />
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
              <Button variant="ghost" size="sm" className="relative hover:bg-purple-50">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadModalOpen(true)}
                className="hover:scale-105 transition-transform"
              >
                <Download className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all"
                asChild
              >
                <Link to="/student/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
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
                  Welcome back, Rahul! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  CSE Final Year • MIT College of Engineering • CGPA: 8.5
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-semibold">Top Performer</span>
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
                <div className="text-3xl font-bold mb-1">12</div>
                <p className="text-purple-100 text-sm">3 interviews pending</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Tests Taken
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">8</div>
                <p className="text-blue-100 text-sm">Avg score: 87%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Shortlisted
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">5</div>
                <p className="text-green-100 text-sm">41% success rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Offers
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">2</div>
                <p className="text-orange-100 text-sm">Best: ₹18 LPA</p>
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
                value="tests"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
              >
                Test History
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
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCalendarView(true)}
                    className="hover:scale-105 transition-transform"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </Button>
                  <Button variant="outline" className="hover:scale-105 transition-transform">
                    <Bell className="h-4 w-4 mr-2" />
                    Set Alerts
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {upcomingDrives.map((drive, index) => (
                    <Card
                      key={drive.id}
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
                                {drive.urgent && (
                                  <Badge variant="destructive" className="ml-2 animate-pulse">
                                    Urgent
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-base">{drive.role}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 mb-2">
                              {drive.status}
                            </Badge>
                            <p className="text-xl font-bold text-green-600">{drive.package}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Drive Date</p>
                            <p className="font-semibold flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-purple-600" />
                              {drive.date}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Apply By</p>
                            <p className="font-semibold text-red-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {drive.deadline}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Eligibility</p>
                            <p className="font-semibold text-sm">{drive.eligibility}</p>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all shadow-lg"
                              onClick={() => handleApplyClick(drive)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                  {appliedDrives.map((application, index) => (
                    <Card
                      key={application.id}
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
                              <CardTitle className="text-lg">{application.company}</CardTitle>
                              <CardDescription>{application.role}</CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant={application.status === 'Selected' ? 'secondary' : 'outline'}
                            className={`${application.status === 'Selected' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-yellow-100 text-yellow-700'} font-semibold`}
                          >
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Applied Date</p>
                            <p className="font-semibold">{application.appliedDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Test Score</p>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000"
                                  style={{ width: application.testScore }}
                                ></div>
                              </div>
                              <p className="font-semibold text-purple-600">
                                {application.testScore}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Next Round</p>
                            <p className="font-semibold text-sm">{application.nextRound}</p>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(application)}
                              className="hover:scale-105 transition-transform"
                            >
                              View Details
                            </Button>
                            {application.status === 'Test Completed' && (
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all"
                                onClick={() => handleScheduleInterview(application.company)}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Schedule Interview
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Test History */}
            <TabsContent value="tests" className="space-y-6 animate-fade-in">
              <div className="text-center py-12">
                <FileText className="h-20 w-20 text-gray-400 mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Test Performance Dashboard
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Track your assessment journey and performance metrics
                </p>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <Card className="hover:scale-105 transition-all duration-300 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <Target className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-3 text-lg">Average Score</h4>
                      <p className="text-4xl font-bold text-purple-600 mb-2">87%</p>
                      <p className="text-sm text-gray-500">Above industry average</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:scale-105 transition-all duration-300 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-3 text-lg">Improvement</h4>
                      <p className="text-4xl font-bold text-green-600 mb-2">+15%</p>
                      <p className="text-sm text-gray-500">Last 3 months</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:scale-105 transition-all duration-300 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <Award className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-3 text-lg">Best Score</h4>
                      <p className="text-4xl font-bold text-orange-600 mb-2">95%</p>
                      <p className="text-sm text-gray-500">Personal record</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User className="h-6 w-6 mr-3 text-purple-600" />
                    Student Profile
                  </CardTitle>
                  <CardDescription>Manage your academic and personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">
                        Academic Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">College:</span>
                          <span className="font-semibold">MIT College of Engineering</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Branch:</span>
                          <span className="font-semibold">Computer Science</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-semibold">Final Year</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">CGPA:</span>
                          <span className="font-semibold text-green-600">8.5/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">
                        Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {[
                          'Java',
                          'Python',
                          'React.js',
                          'Node.js',
                          'MongoDB',
                          'AWS',
                          'Docker',
                          'Kubernetes',
                        ].map(skill => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setUploadModalOpen(true)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditProfileModalOpen(true)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6 animate-fade-in">
              <div className="text-center py-16">
                <BarChart3 className="h-24 w-24 text-gray-400 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                  Get detailed insights into your placement journey, performance trends, and
                  improvement recommendations
                </p>
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all shadow-lg px-8 py-3"
                  onClick={handleViewAnalytics}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Modals */}
      <ApplyDriveModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        drive={selectedDrive}
      />

      <ApplicationDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        application={selectedApplication}
      />

      <ScheduleInterviewModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        companyName={selectedCompany}
      />

      <UploadResumeModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />

      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
      />
    </div>
  );
};

export default StudentDashboard;
