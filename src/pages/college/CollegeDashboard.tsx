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
import studentAPI, { StudentProfile } from '@/lib/api/student';

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('drives');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [recentPlaced,SetRecentPlaced]=useState<StudentProfile[]>([])
  const [dashboardData, setDashboardData] = useState<{
    stats: DashboardStats;
    upcomingDrives: PlacementDrive[];
    topCompanies: Company[];
  } | null>(null);

  
  const collegeId = localStorage.getItem("user_id"); 

  useEffect(() => {
    fetchDashboardData();
    fetchRecentPlacedStuents()
  }, []);
const fetchRecentPlacedStuents=async()=>{
try {
  if(!collegeId) return;
  const response= await studentAPI.getRecentPlacedStudents(collegeId);
  console.log(response)
SetRecentPlaced(response)
  
} catch (error:any) {
  console.log(error)
}
}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card
            className="relative cursor-pointer bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden group border-0"
            onClick={() => navigate(`/college/students/${collegeId}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine transition-all duration-1000"></div>

            <CardHeader className="relative z-10 pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col space-y-1 flex-1 min-w-0">
                <CardTitle className="text-sm sm:text-base md:text-lg font-bold tracking-wide leading-tight">
                  Student Management
                </CardTitle>
                <p className="text-xs sm:text-sm opacity-90 hidden sm:block leading-tight">
                  View and manage all student records
                </p>
              </div>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 opacity-90 flex-shrink-0 ml-2" />
            </CardHeader>
            <CardContent className="relative z-10 px-3 sm:px-4 pb-3 sm:pb-4">
              {/* <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {dashboardData?.stats?.totalDrives || 0}
              </div> */}
              
            </CardContent>
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
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-md min-w-max rounded-lg p-1 h-auto">
              <TabsTrigger
                value="drives"
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className=" xs:inline">Drives</span>
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className=" xs:inline">Students</span>
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className=" xs:inline">Companies</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-200"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className=" xs:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-200"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className=" xs:inline">Reports</span>
              </TabsTrigger>
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
                    <div key={drive._id || drive.id} className="border rounded-lg p-3 sm:p-4 bg-white/50 hover:bg-white/70 transition-colors">
                      <div className="flex flex-col gap-3">
                        {/* Header with Company and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex items-center flex-1 min-w-0">
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600 flex-shrink-0" />
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">{drive.company}</h3>
                          </div>
                          <Badge
                            className={`w-max text-xs ${placementDriveAPI.getStatusColor(drive.status)}`}
                          >
                            {drive.status === 'Open' ? 'Registration Open' : drive.status}
                          </Badge>
                        </div>

                        {/* Role */}
                        <p className="text-gray-600 text-sm sm:text-base font-medium">{drive.role}</p>

                        {/* Details Grid - Responsive */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-xs sm:text-sm text-gray-700 block">Date</span>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm truncate">{placementDriveAPI.formatDate(drive.drive_date)}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-xs sm:text-sm text-gray-700 block">Eligibility</span>
                            <p className="text-gray-600 mt-1 text-xs sm:text-sm line-clamp-2">{drive.eligibility_criteria}</p>
                          </div>

                          <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-xs sm:text-sm text-orange-700 block">Registrations</span>
                            <p className="text-orange-600 font-semibold mt-1 text-xs sm:text-sm">
                              {drive.registrations || 0} students
                            </p>
                          </div>

                          <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-xs sm:text-sm text-green-700 block">Package</span>
                            <p className="text-green-600 font-semibold mt-1 text-xs sm:text-sm truncate">
                              {drive.salary_package || 'Not specified'}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(drive._id || drive.id || '')}
                            className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">View Details</span>
                            <span className="xs:hidden">Details</span>
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-9 sm:h-10 bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm"
                            onClick={() => handleManage(drive._id || drive.id || '')}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Manage Drive</span>
                            <span className="xs:hidden">Manage</span>
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
                <CardContent className="space-y-2 sm:space-y-3">
                {recentPlaced.map((placement, index) => (
  <div
    key={index}
    className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
        {placement.full_name}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 truncate">
        {placement.department}
      </p>
    </div>
    <div className="text-right flex-shrink-0 ml-3">
      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
        {placement.placedAt?.drive_id.company || "N/A"}
      </p>
       <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
        {placement.placedAt?.drive_id.role || "N/A"}
      </p>
      <p className="text-xs sm:text-sm text-green-600 font-medium">
        {placement.placedAt?.package ? `${placement.placedAt.package} LPA` : "N/A"}
      </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {dashboardData?.topCompanies && dashboardData.topCompanies.length > 0 ? (
                    dashboardData.topCompanies.map((company, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100 hover:shadow-md transition-all duration-200 hover:border-orange-200"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{company.name}</p>
                            <div className="flex items-center mt-1">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1 flex-shrink-0" />
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{company.hires} hires</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="font-bold text-green-600 text-sm sm:text-base">{company.package}</p>
                          {company.totalDrives && (
                            <div className="flex items-center justify-end mt-1">
                              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1 flex-shrink-0" />
                              <p className="text-xs text-gray-600">{company.totalDrives} drives</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 sm:col-span-2 text-center py-8 sm:py-12 px-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No Company Data Available</h3>
                      <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                        Company statistics will appear here once placement drives are organized and companies start recruiting.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center text-sm sm:text-base md:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Total Drives
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                    {dashboardData?.stats?.totalDrives || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Placement drives created</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center text-sm sm:text-base md:text-lg">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                    Total Placements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-1">
                    {dashboardData?.stats?.totalPlacements || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Students placed successfully</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200 sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center text-sm sm:text-base md:text-lg">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                    Average Package
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                    ₹{dashboardData?.stats?.averagePackage || 0}L
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Average salary package</p>
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
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  <Button
                    variant="outline"
                    className="h-16 sm:h-18 md:h-20 flex flex-col items-center justify-center p-2 sm:p-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    disabled
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2 text-blue-500" />
                    <span className="text-xs sm:text-sm text-center leading-tight">Placement Report</span>
                    <span className="text-xs text-gray-500 mt-0.5">Coming Soon</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 sm:h-18 md:h-20 flex flex-col items-center justify-center p-2 sm:p-3 hover:bg-green-50 hover:border-green-200 transition-colors"
                    disabled
                  >
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2 text-green-500" />
                    <span className="text-xs sm:text-sm text-center leading-tight">Analytics Report</span>
                    <span className="text-xs text-gray-500 mt-0.5">Coming Soon</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 sm:h-18 md:h-20 flex flex-col items-center justify-center p-2 sm:p-3 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                    disabled
                  >
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2 text-purple-500" />
                    <span className="text-xs sm:text-sm text-center leading-tight">Student Report</span>
                    <span className="text-xs text-gray-500 mt-0.5">Coming Soon</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 sm:h-18 md:h-20 flex flex-col items-center justify-center p-2 sm:p-3 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    disabled
                  >
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2 text-orange-500" />
                    <span className="text-xs sm:text-sm text-center leading-tight">Company Report</span>
                    <span className="text-xs text-gray-500 mt-0.5">Coming Soon</span>
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