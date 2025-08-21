
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAdminAuth } from "@/contexts/AdminAuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import { getAdminStats } from "@/services/adminStatsService";
// import { getRecentAdminActivity } from "@/services/adminRecentActivityService";

// import { 
//   Users, 
//   Briefcase, 
//   TestTube, 
//   Calendar, 
//   FileText, 
//   BarChart3,
//   TrendingUp,
//   UserCheck,
//   Clock,
//   AlertTriangle,
//   Download
// } from "lucide-react";

// const AdminDashboard = () => {
//   const { admin } = useAdminAuth();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const isSuperAdmin = admin?.role === 'super_admin';

//   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
//   const [reportType, setReportType] = useState('');
//   const [dateRange, setDateRange] = useState('');

//   // Mock data - in real app, this would come from API
//   const [stats, setStats] = useState({
//   totalUsers: 0,
//   activeJobs: 0,
//   testsCreated: 0,
//   scheduledInterviews: 0,
//   pendingApprovals: 0,
//   documentsUploaded: 0,
//   activeEmployees: 0,
//   newApplications: 0
// });

// useEffect(() => {
//   const fetchStats = async () => {
//     const data = await getAdminStats();
//     setStats(data);
//   };
//   fetchStats();
// }, []);

// const [recentActivity, setRecentActivity] = useState([]);
// const [loadingActivity, setLoadingActivity] = useState(true);

// useEffect(() => {
//   const fetchActivity = async () => {
//     const data = await getRecentAdminActivity();
//     setRecentActivity(data);
//     setLoadingActivity(false);
//   };
//   fetchActivity();
// }, []);


//   const handleGenerateReport = async () => {
//     if (!reportType || !dateRange) {
//       toast({
//         title: "Missing Information",
//         description: "Please select report type and date range.",
//         variant: "destructive"
//       });
//       return;
//     }

//     setIsGeneratingReport(true);
    
//     // Simulate report generation
//     await new Promise(resolve => setTimeout(resolve, 3000));
    
//     setIsGeneratingReport(false);
//     toast({
//       title: "Report Generated",
//       description: `${reportType} report for ${dateRange} has been generated and downloaded.`,
//     });
//   };

//   const handleQuickAction = (action: string) => {
//     switch (action) {
//       case 'manage-users':
//         navigate('/admin/users');
//         break;
//       case 'approve-jobs':
//         navigate('/admin/jobs?filter=pending');
//         break;
//       case 'create-test':
//         navigate('/admin/tests');
//         break;
//       case 'view-reports':
//         navigate('/admin/reports');
//         break;
//       case 'onboard':
//         navigate('/admin/onboarding');
//         break;
//       case 'post-job':
//         navigate('/admin/hr-jobs');
//         break;
//       case 'schedule-interview':
//         navigate('/admin/hr-interviews');
//         break;
//         case 'manage-faqs':
//   navigate('/admin/faqs');
//   break;
//       case 'view-applications':
//         navigate('/admin/employees');
//         break;
//       default:
//         toast({
//           title: "Feature Coming Soon",
//           description: "This feature is being developed.",
//         });
//     }
//   };

//   const SuperAdminCards = () => (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//           <Users className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.totalUsers}</div>
//           <p className="text-xs text-muted-foreground">+12% from last month</p>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
//           <Briefcase className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.activeJobs}</div>
//           <p className="text-xs text-muted-foreground">+5% from last month</p>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Tests Created</CardTitle>
//           <TestTube className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.testsCreated}</div>
//           <p className="text-xs text-muted-foreground">+18% from last month</p>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
//           <AlertTriangle className="h-4 w-4 text-orange-500" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
//           <p className="text-xs text-orange-600">Requires attention</p>
//         </CardContent>
//       </Card>
//     </div>
//   );

//   const HRAdminCards = () => (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
//           <UserCheck className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.activeEmployees}</div>
//           <p className="text-xs text-muted-foreground">+8% from last month</p>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">New Applications</CardTitle>
//           <FileText className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.newApplications}</div>
//           <p className="text-xs text-muted-foreground">+15% from last week</p>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Scheduled Interviews</CardTitle>
//           <Calendar className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.scheduledInterviews}</div>
//           <p className="text-xs text-muted-foreground">This week</p>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
//           <Briefcase className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.activeJobs}</div>
//           <p className="text-xs text-muted-foreground">Currently hiring</p>
//         </CardContent>
//       </Card>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {admin?.name}!
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {isSuperAdmin ? 'Super Admin Dashboard' : 'HR Admin Dashboard'}
//           </p>
//         </div>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>
//               <BarChart3 className="h-4 w-4 mr-2" />
//               Generate Report
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Generate Report</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label>Report Type</Label>
//                 <Select value={reportType} onValueChange={setReportType}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select report type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {isSuperAdmin ? (
//                       <>
//                         <SelectItem value="users">User Analytics</SelectItem>
//                         <SelectItem value="jobs">Job Performance</SelectItem>
//                         <SelectItem value="tests">Test Analytics</SelectItem>
//                         <SelectItem value="interviews">Interview Reports</SelectItem>
//                         <SelectItem value="platform">Platform Overview</SelectItem>
//                       </>
//                     ) : (
//                       <>
//                         <SelectItem value="hires">Hired Candidates</SelectItem>
//                         <SelectItem value="test-results">Test Results</SelectItem>
//                         <SelectItem value="interview-stats">Interview Statistics</SelectItem>
//                         <SelectItem value="hr-activity">HR Activity</SelectItem>
//                       </>
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Date Range</Label>
//                 <Select value={dateRange} onValueChange={setDateRange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select date range" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="last-7-days">Last 7 days</SelectItem>
//                     <SelectItem value="last-30-days">Last 30 days</SelectItem>
//                     <SelectItem value="last-3-months">Last 3 months</SelectItem>
//                     <SelectItem value="last-6-months">Last 6 months</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex gap-2 justify-end">
//                 <Button variant="outline">Cancel</Button>
//                 <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
//                   {isGeneratingReport ? (
//                     <>
//                       <Clock className="h-4 w-4 mr-2 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Download className="h-4 w-4 mr-2" />
//                       Generate
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats Cards */}
//       {isSuperAdmin ? <SuperAdminCards /> : <HRAdminCards />}

//       {/* Recent Activity & Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//        {/* Recent Activity */}
// <Card>
//   <CardHeader>
//     <CardTitle className="flex items-center">
//       <Clock className="h-5 w-5 mr-2" />
//       Recent Activity
//     </CardTitle>
//   </CardHeader>
//   <CardContent>
//     {loadingActivity ? (
//       <p className="text-sm text-muted-foreground">Loading recent activity...</p>
//     ) : (
//       <div className="space-y-4">
//         {recentActivity.map((activity) => (
//           <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//             <div>
//               <p className="font-medium text-sm">{activity.action}</p>
//               <p className="text-xs text-gray-600">{activity.user}</p>
//             </div>
//             <div className="text-right">
//               <Badge variant="secondary" className="text-xs">
//                 {activity.type}
//               </Badge>
//               <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </CardContent>
// </Card>


//         {/* Quick Actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <TrendingUp className="h-5 w-5 mr-2" />
//               Quick Actions
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-3">
//               {isSuperAdmin ? (
//                 <>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('manage-users')}>
//                     <Users className="h-6 w-6 mb-2" />
//                     <span className="text-sm">Manage Users</span>
//                   </Button>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('approve-jobs')}>
//                     <Briefcase className="h-6 w-6 mb-2" />
//                     <span className="text-sm">Approve Jobs</span>
//                   </Button>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('create-test')}>
//                     <TestTube className="h-6 w-6 mb-2" />
//                     <span className="text-sm">Create Test</span>
//                   </Button>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('view-reports')}>
//                     <BarChart3 className="h-6 w-6 mb-2" />
//                     <span className="text-sm">View Reports</span>
//                   </Button>
//                     <Button
//   variant="outline"
//   className="h-20 flex-col"
//   onClick={() => handleQuickAction('manage-faqs')}
// >
//   <FileText className="h-6 w-6 mb-2" />
//   <span className="text-sm">Manage FAQs</span>
// </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('onboard')}>
//                     <UserCheck className="h-6 w-6 mb-2" />
//                     <span className="text-sm">Onboard</span>
//                   </Button>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('post-job')}>
//                     <Briefcase className="h-6 w-6 mb-2" />
//                     <span className="text-sm">Post Job</span>
//                   </Button>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('schedule-interview')}>
//                     <Calendar className="h-6 w-6 mb-2" />
//                     <span className="text-sm">Schedule Interview</span>
//                   </Button>
//                   <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction('view-applications')}>
//                     <FileText className="h-6 w-6 mb-2" />
//                     <span className="text-sm">View Applications</span>
//                   </Button>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { adminStatsService } from "@/services/adminStatsService";
import { adminRecentActivityService } from "@/services/adminRecentActivityService";


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
} from "lucide-react";

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isSuperAdmin = admin?.role === "super_admin";

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    testsCreated: 0,
    scheduledInterviews: 0,
    pendingApprovals: 0,
    documentsUploaded: 0,
    activeEmployees: 0,
    newApplications: 0,
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await adminStatsService.getStats();
      setStats(data);

      // Mock data for products and orders
      setTotalProducts(25);
      setTotalOrders(150);
    };
    fetchStats();
  }, []);

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
        title: "Missing Information",
        description: "Please select report type and date range.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingReport(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
    toast({
      title: "Report Generated",
      description: `${reportType} report for ${dateRange} has been generated and downloaded.`,
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "manage-users":
        navigate("/admin/users");
        break;
      case "approve-jobs":
        navigate("/admin/jobs?filter=pending");
        break;
      case "create-test":
        navigate("/admin/tests");
        break;
      case "view-reports":
        navigate("/admin/reports");
        break;
      case "onboard":
        navigate("/admin/onboarding");
        break;
      case "post-job":
        navigate("/admin/hr-jobs");
        break;
      case "schedule-interview":
        navigate("/admin/hr-interviews");
        break;
      case "manage-faqs":
        navigate("/admin/faqs");
        break;
      case "view-applications":
        navigate("/admin/employees");
        break;
      default:
        toast({
          title: "Feature Coming Soon",
          description: "This feature is being developed.",
        });
    }
  };

  const SuperAdminCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeJobs}</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tests Created</CardTitle>
          <TestTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.testsCreated}</div>
          <p className="text-xs text-muted-foreground">+18% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
          <p className="text-xs text-orange-600">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {admin?.name}!</h1>
          <p className="text-gray-600 mt-1">{isSuperAdmin ? "Super Admin Dashboard" : "HR Admin Dashboard"}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
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

      {isSuperAdmin && SuperAdminCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <p className="text-sm text-muted-foreground">Loading recent activity...</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction("manage-users")}>
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction("approve-jobs")}>
                <Briefcase className="h-6 w-6 mb-2" />
                <span className="text-sm">Approve Jobs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction("create-test")}>
                <TestTube className="h-6 w-6 mb-2" />
                <span className="text-sm">Create Test</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction("view-reports")}>
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleQuickAction("manage-faqs")}>
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage FAQs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

