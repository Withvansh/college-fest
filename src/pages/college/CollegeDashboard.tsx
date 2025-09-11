import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Building2,
  GraduationCap,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Edit,
  Plus,
  BarChart3,
  FileText,
  Star,
  Trophy,
  Upload,
  User,
  MoveRight,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  placementDriveAPI,
  PlacementDrive,
  DashboardStats,
  Company,
} from '@/lib/api/placementDrives';
import { toast } from 'sonner';

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('drives');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState<{
    stats: DashboardStats;
    upcomingDrives: PlacementDrive[];
    topCompanies: Company[];
  } | null>(null);

  // For now, using a mock college ID - replace with actual college ID from auth context
  const collegeId = localStorage.getItem("user_id"); // Replace with actual college ID

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await placementDriveAPI.getCollegeDashboardStats(collegeId);
      console.log(data)
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      // Fallback to mock data for development
      setDashboardData({
        stats: {
          totalDrives: 0,
          activeDrives: 0,
          totalRegistrations: 0,
          totalPlacements: 0,
          averagePackage: 0,
        },
        upcomingDrives: [],
        topCompanies: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const studentStats = [
    // Your student stats data
  ];

  const handleViewDetails = (driveId: number | string) => {
    navigate(`/college/placement-drives/${driveId}/view`);
  };

  const handleManage = (driveId: number | string) => {
    navigate(`/college/placement-drives/${driveId}/manage`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">College Dashboard</h1>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/college/profile')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                <User className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Profile</span>
              </Button>

              <Button
                className="bg-orange-600 hover:bg-orange-700 text-sm"
                onClick={() => navigate('/college/placement-drives')}
              >
                <Plus className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Manage All Drives</span>
                <span className="lg:hidden">Drives</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/college/profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start border-gray-300 text-gray-700"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                className="w-full justify-start bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  navigate('/college/placement-drives');
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage All Drives
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card
            className="relative cursor-pointer bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group border-0"
            onClick={() => navigate(`/college/students/${collegeId}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine transition-all duration-1000"></div>

            <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-base md:text-lg font-bold tracking-wide">
                  Student Management
                </CardTitle>
                <p className="text-xs md:text-sm opacity-90 hidden sm:block">
                  View and manage all student records
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Active Drives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{dashboardData?.stats?.activeDrives || 0}</div>
              <div className="flex items-center mt-1 md:mt-2">
                <Building2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="text-xs md:text-sm opacity-90">Open for Registration</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {dashboardData?.stats?.totalRegistrations || 0}
              </div>
              <div className="flex items-center mt-1 md:mt-2">
                <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="text-xs md:text-sm opacity-90">This Year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Average Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                ₹{dashboardData?.stats?.averagePackage || 0}L
              </div>
              <div className="flex items-center mt-1 md:mt-2">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="text-xs md:text-sm opacity-90">Per Annum</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-white/80 backdrop-blur-md min-w-max">
              <TabsTrigger value="drives" className="text-xs md:text-sm px-2 md:px-4">Drives</TabsTrigger>
              <TabsTrigger value="students" className="text-xs md:text-sm px-2 md:px-4">Students</TabsTrigger>
              <TabsTrigger value="companies" className="text-xs md:text-sm px-2 md:px-4">Companies</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs md:text-sm px-2 md:px-4">Analytics</TabsTrigger>
              <TabsTrigger value="reports" className="text-xs md:text-sm px-2 md:px-4">Reports</TabsTrigger>
            </TabsList>
          </div>

          {/* Placement Drives Tab */}
          <TabsContent value="drives" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg md:text-xl">Active Placement Drives</CardTitle>
                  <Link to="/college/placement-drives">
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                      View All Drives
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.upcomingDrives && dashboardData.upcomingDrives.length > 0 ? (
                  dashboardData.upcomingDrives.map(drive => (
                    <div key={drive._id || drive.id} className="border rounded-lg p-3 md:p-4 bg-white/50">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-600" />
                              <h3 className="text-base md:text-lg font-semibold">{drive.company}</h3>
                            </div>
                            <Badge
                              className={`ml-0 sm:ml-3 w-max ${placementDriveAPI.getStatusColor(drive.status)}`}
                            >
                              {drive.status === 'Open' ? 'Registration Open' : drive.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2 text-sm md:text-base">{drive.role}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-sm">
                            <div>
                              <span className="font-medium text-xs md:text-sm">Date</span>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 text-gray-500" />
                                <span className="text-xs md:text-sm">{placementDriveAPI.formatDate(drive.drive_date)}</span>
                              </div>
                            </div>

                            <div>
                              <span className="font-medium text-xs md:text-sm">Eligibility</span>
                              <p className="text-gray-600 mt-1 text-xs md:text-sm">{drive.eligibility_criteria}</p>
                            </div>

                            <div>
                              <span className="font-medium text-xs md:text-sm">Registrations</span>
                              <p className="text-orange-600 font-semibold mt-1 text-xs md:text-sm">
                                {drive.registrations || 0} students
                              </p>
                            </div>

                            <div>
                              <span className="font-medium text-xs md:text-sm">Package</span>
                              <p className="text-green-600 font-semibold mt-1 text-xs md:text-sm">
                                {drive.salary_package || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 md:gap-2 self-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(drive._id || drive.id || '')}
                            className="text-xs md:text-sm"
                          >
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm"
                            onClick={() => handleManage(drive._id || drive.id || '')}
                          >
                            <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8">
                    <Building2 className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-base md:text-lg font-medium text-gray-600 mb-2">No Active Drives</h3>
                    <p className="text-gray-500 mb-4 text-sm md:text-base">
                      Create your first placement drive to get started
                    </p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm"
                      onClick={() => navigate('/college/placement-drives')}
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Create Drive
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Placement Statistics by Branch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {studentStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-xs md:text-sm">{stat.branch}</span>
                        <span className="text-xs md:text-sm text-gray-600">
                          {stat.placed}/{stat.total} ({stat.percentage}%)
                        </span>
                      </div>
                      <Progress value={stat.percentage} className="h-1 md:h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Recent Placements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-3">
                  {[
                    { name: 'Rajesh Kumar', company: 'Google', package: '₹32 LPA', branch: 'CSE' },
                    {
                      name: 'Priya Sharma',
                      company: 'Microsoft',
                      package: '₹28 LPA',
                      branch: 'IT',
                    },
                    { name: 'Amit Patel', company: 'Amazon', package: '₹25 LPA', branch: 'CSE' },
                    { name: 'Sneha Singh', company: 'Adobe', package: '₹30 LPA', branch: 'IT' },
                  ].map((placement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 md:p-3 bg-white/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-xs md:text-sm">{placement.name}</p>
                        <p className="text-xs text-gray-600">{placement.branch}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-xs md:text-sm">{placement.company}</p>
                        <p className="text-xs text-green-600">{placement.package}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl font-semibold">Top Recruiting Companies</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/college/companies" className="flex items-center text-xs md:text-sm">
                    <span>View All Companies</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {dashboardData?.topCompanies && dashboardData.topCompanies.length > 0 ? (
                    dashboardData.topCompanies.map((company, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mr-2 md:mr-4">
                            <Building2 className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-xs md:text-sm">{company.name}</p>
                            <div className="flex items-center mt-1">
                              <Users className="h-3 w-3 md:h-4 md:w-4 text-gray-500 mr-1" />
                              <p className="text-xs text-gray-600">{company.hires} hires</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600 text-xs md:text-sm">{company.package}</p>
                          {company.totalDrives && (
                            <div className="flex items-center justify-end mt-1">
                              <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-gray-500 mr-1" />
                              <p className="text-xs text-gray-600">{company.totalDrives} drives</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-6 md:py-8 px-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <Building2 className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base md:text-lg font-medium text-gray-600 mb-2">No Company Data Available</h3>
                      <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base">
                        Company statistics will appear here once placement drives are organized and companies start recruiting.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <BarChart3 className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Total Drives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    {dashboardData?.stats?.totalDrives || 0}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mt-2">Placement drives created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Trophy className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Total Placements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-green-600">
                    {dashboardData?.stats?.totalPlacements || 0}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mt-2">Students placed successfully</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Star className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Average Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">
                    ₹{dashboardData?.stats?.averagePackage || 0}L
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mt-2">Average salary package</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <Button variant="outline" className="h-16 md:h-20 flex flex-col p-2">
                    <FileText className="h-4 w-4 md:h-6 md:w-6 mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm">Placement Report Coming Soon....</span>
                  </Button>
                  <Button variant="outline" className="h-16 md:h-20 flex flex-col p-2">
                    <BarChart3 className="h-4 w-4 md:h-6 md:w-6 mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm">Analytics Report Coming Soon....</span>
                  </Button>
                  <Button variant="outline" className="h-16 md:h-20 flex flex-col p-2">
                    <Users className="h-4 w-4 md:h-6 md:w-6 mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm">Student Report Coming Soon....</span>
                  </Button>
                  <Button variant="outline" className="h-16 md:h-20 flex flex-col p-2">
                    <Building2 className="h-4 w-4 md:h-6 md:w-6 mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm">Company Report Coming Soon....</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollegeDashboard;