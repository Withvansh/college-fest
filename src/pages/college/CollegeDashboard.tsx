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
  const [dashboardData, setDashboardData] = useState<{
    stats: DashboardStats;
    upcomingDrives: PlacementDrive[];
    topCompanies: Company[];
  } | null>(null);

  // For now, using a mock college ID - replace with actual college ID from auth context
  const collegeId = '507f1f77bcf86cd799439011'; // Replace with actual college ID

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await placementDriveAPI.getCollegeDashboardStats(collegeId);
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

  // Mock data for students - this can be fetched from a separate API later
  const studentStats = [
    { branch: 'Computer Science', total: 120, placed: 95, percentage: 79 },
    { branch: 'Information Technology', total: 80, placed: 68, percentage: 85 },
    { branch: 'Electronics', total: 90, placed: 72, percentage: 80 },
    { branch: 'Mechanical', total: 100, placed: 75, percentage: 75 },
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">College Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate('/college/placement-drives')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage All Drives
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,250</div>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm opacity-90">Active Students</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Drives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData?.stats?.activeDrives || 0}</div>
              <div className="flex items-center mt-2">
                <Building2 className="h-4 w-4 mr-1" />
                <span className="text-sm opacity-90">Open for Registration</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {dashboardData?.stats?.totalRegistrations || 0}
              </div>
              <div className="flex items-center mt-2">
                <GraduationCap className="h-4 w-4 mr-1" />
                <span className="text-sm opacity-90">This Year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Average Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{dashboardData?.stats?.averagePackage || 0}L
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm opacity-90">Per Annum</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-md">
            <TabsTrigger value="drives">Placement Drives</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Placement Drives Tab */}
          <TabsContent value="drives" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Placement Drives</CardTitle>
                  <Link to="/college/placement-drives">
                    <Button variant="outline">View All Drives</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.upcomingDrives && dashboardData.upcomingDrives.length > 0 ? (
                  dashboardData.upcomingDrives.map(drive => (
                    <div key={drive._id || drive.id} className="border rounded-lg p-4 bg-white/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Building2 className="h-5 w-5 mr-2 text-gray-600" />
                            <h3 className="text-lg font-semibold">{drive.company}</h3>
                            <Badge
                              className={`ml-3 ${placementDriveAPI.getStatusColor(drive.status)}`}
                            >
                              {drive.status === 'Open' ? 'Registration Open' : drive.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{drive.role}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Date</span>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {placementDriveAPI.formatDate(drive.drive_date)}
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">Eligibility</span>
                              <p className="text-gray-600 mt-1">{drive.eligibility_criteria}</p>
                            </div>

                            <div>
                              <span className="font-medium">Registrations</span>
                              <p className="text-orange-600 font-semibold mt-1">
                                {drive.registrations || 0} students
                              </p>
                            </div>

                            <div>
                              <span className="font-medium">Package</span>
                              <p className="text-green-600 font-semibold mt-1">
                                {drive.salary_package || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(drive._id || drive.id || '')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => handleManage(drive._id || drive.id || '')}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Drives</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first placement drive to get started
                    </p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/college/placement-drives')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Drive
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Placement Statistics by Branch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{stat.branch}</span>
                        <span className="text-sm text-gray-600">
                          {stat.placed}/{stat.total} ({stat.percentage}%)
                        </span>
                      </div>
                      <Progress value={stat.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Placements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{placement.name}</p>
                        <p className="text-sm text-gray-600">{placement.branch}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{placement.company}</p>
                        <p className="text-sm text-green-600">{placement.package}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Recruiting Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData?.topCompanies && dashboardData.topCompanies.length > 0 ? (
                    dashboardData.topCompanies.map((company, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <Building2 className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-gray-600">{company.hires} hires</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{company.package}</p>
                          {company.totalDrives && (
                            <p className="text-sm text-gray-600">{company.totalDrives} drives</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No Company Data</h3>
                      <p className="text-gray-500">
                        Company statistics will appear here once placement drives are created
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Total Drives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {dashboardData?.stats?.totalDrives || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Placement drives created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Total Placements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {dashboardData?.stats?.totalPlacements || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Students placed successfully</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Average Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    ₹{dashboardData?.stats?.averagePackage || 0}L
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Average salary package</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Placement Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span>Analytics Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Student Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Building2 className="h-6 w-6 mb-2" />
                    <span>Company Report</span>
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
