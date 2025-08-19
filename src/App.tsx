import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalAuthProvider } from "./contexts/LocalAuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import LocalProtectedRoute from "./components/auth/LocalProtectedRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import FreeTest from "./pages/FreeTest";
import TakeTest from "./pages/TakeTest";
import TestResults from "./pages/TestResults";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import Pricing from "./pages/Pricing";
import CampusHiring from "./pages/CampusHiring";
import BookCampusDrive from "./pages/BookCampusDrive";
import AIInterview from "./pages/AIInterview";
import AITextInterview from "./pages/AITextInterview";
import AIInterviewResults from "./pages/AIInterviewResults";
import AIVideoInterview from "./pages/AIVideoInterview";
import JobSeekerLogin from "./pages/auth/JobSeekerLogin";
import RecruiterLogin from "./pages/auth/RecruiterLogin";
import FreelancerLogin from "./pages/auth/FreelancerLogin";
import ClientLogin from "./pages/auth/ClientLogin";
import CollegeLogin from "./pages/auth/CollegeLogin";
import StudentLogin from "./pages/auth/StudentLogin";
import AuthCallback from "./pages/auth/AuthCallback";
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import JobSeekerApplications from "./pages/jobseeker/JobSeekerApplications";
import JobSeekerProfile from "./pages/jobseeker/JobSeekerProfile";
import JobDetails from "./pages/jobseeker/JobDetails";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import JobListings from "./pages/jobs/JobListings";
import TestDetails from "./pages/jobseeker/TestDetails";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import CreateTest from "./pages/recruiter/CreateTest";
import HRMSLayout from "./components/hrms/HRMSLayout";
import HRDashboard from "./components/hrms/HRDashboard";
import HRAnalyticsDashboard from "./components/hrms/HRAnalyticsDashboard";
import OnboardEmployee from "./components/hrms/OnboardEmployee";
import EmployeeDirectory from "./components/hrms/EmployeeDirectory";
import AttendanceManagement from "./components/hrms/AttendanceManagement";
import AttendancePage from "./components/hrms/AttendancePage";
import LeaveManager from "./components/hrms/LeaveManager";
import PayrollPage from "./components/hrms/PayrollPage";
import PerformanceManagement from "./components/hrms/PerformanceManagement";
import OrganizationChart from "./components/hrms/OrganizationChart";
import TADAManagement from "./components/hrms/TADAManagement";
import DocumentVault from "./components/hrms/DocumentVault";
import ProjectManagement from "./components/hrms/ProjectManagement";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerProfile from "./pages/freelancer/FreelancerProfile";
import FreelancerProposals from "./pages/freelancer/FreelancerProposals";
import FreelancerPortfolio from "./pages/freelancer/FreelancerPortfolio";
import FreelancerEarnings from "./pages/freelancer/FreelancerEarnings";
import GigDetails from "./pages/freelancer/GigDetails";
import ClientDashboard from "./pages/client/ClientDashboard";
import PostGig from "./pages/client/PostGig";
import ClientChat from "./pages/client/ClientChat";
import GigDetail from "./pages/client/GigDetail";
import BrowseFreelancers from "./pages/client/BrowseFreelancers";
import CollegeDashboard from "./pages/college/CollegeDashboard";
import PlacementDrives from "./pages/college/PlacementDrives";
import ViewPlacementDrive from "./pages/college/ViewPlacementDrive";
import ManagePlacementDrive from "./pages/college/ManagePlacementDrive";
import Students from "./pages/college/Students";
import Companies from "./pages/college/Companies";
import Reports from "./pages/college/Reports";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAnalytics from "./pages/student/StudentAnalytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageTests from "./pages/admin/ManageTests";
import ManageInterviews from "./pages/admin/ManageInterviews";
import ManageDocuments from "./pages/admin/ManageDocuments";
import Settings from "./pages/admin/Settings";
import Onboarding from "./pages/admin/Onboarding";
import Employees from "./pages/admin/Employees";
import HRJobs from "./pages/admin/HRJobs";
import HRTests from "./pages/admin/HRTests";
import HRInterviews from "./pages/admin/HRInterviews";
import HRAnalytics from "./pages/admin/HRAnalytics";
import NotFound from "./pages/NotFound";
import AdminAccess from "./pages/AdminAccess";
import AdminLogin from "./pages/admin/AdminLogin";
import BlogManagement from "./pages/admin/BlogManagement";
import RecruiterDashboardDynamic from "./pages/recruiter/RecruiterDashboardDynamic";
import ProfilePage from './pages/ProfilePage';
import DigitalProducts from '@/pages/DigitalProducts';
import ProductManagement from "./pages/admin/ProductManagement";
import BlogDetailPage from "@/pages/BlogDetailPage";
import FaqPage from "@/pages/FaqPage";
import FaqManagement from "./pages/admin/FaqManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import PaymentSuccess from "./pages/PaymentSuccess";
import HirePage from "./pages/HirePage";
// import ProfileSetup from '@/pages/ProfileSetup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <LocalAuthProvider>
                <div className="min-h-screen w-full">
                  <Navbar />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/free-test" element={<FreeTest />} />
                    <Route path="/take-test/:testId" element={<TakeTest />} />
                    <Route path="/results/:testId" element={<TestResults />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/campus-hiring" element={<CampusHiring />} />
                    <Route path="/book-campus-drive" element={<BookCampusDrive />} />
                    <Route path="/products" element={<DigitalProducts />} />
                    <Route path="/hire" element={<HirePage />} />
                    <Route path="/auth/jobseeker-login" element={<JobSeekerLogin />} />
                    <Route path="/blog/:slug" element={<BlogDetailPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/admin/faqs" element={<FaqManagement />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
{/*                      <Route path="/profile-setup" element={<ProfileSetup />} /> */}

                    {/* Job Routes */}
                    <Route path="/jobs" element={<JobListings />} />
                    <Route path="/jobs/:id" element={<JobDetailsPage />} />
                    
                    {/* AI Interview Routes */}
                    <Route path="/ai-interview" element={<AIInterview />} />
                    <Route path="/ai-interview/text" element={<AITextInterview />} />
                    <Route path="/ai-interview/video" element={<AIVideoInterview />} />
                    <Route path="/ai-interview/results" element={<AIInterviewResults />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth/jobseeker" element={<JobSeekerLogin />} />
                    <Route path="/auth/recruiter" element={<RecruiterLogin />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/freelancer-login" element={<FreelancerLogin />} />
                    <Route path="/client-login" element={<ClientLogin />} />
                    <Route path="/college-login" element={<CollegeLogin />} />
                    <Route path="/student-login" element={<StudentLogin />} />
                    
                    {/* Protected Job Seeker Routes */}
                    <Route path="/jobseeker/dashboard" element={
                      <LocalProtectedRoute requiredRole={['jobseeker']}>
                        <JobSeekerDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/jobseeker/applications" element={
                      <LocalProtectedRoute requiredRole={['jobseeker']}>
                        <JobSeekerApplications />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/jobseeker/profile" element={
                      <LocalProtectedRoute requiredRole={['jobseeker']}>
                        <JobSeekerProfile />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/jobseeker/job/:id" element={
                      <LocalProtectedRoute requiredRole={['jobseeker']}>
                        <JobDetails />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/jobseeker/test/:id" element={
                      <LocalProtectedRoute requiredRole={['jobseeker']}>
                        <TestDetails />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Protected Recruiter Routes */}
                    <Route path="/recruiter/dashboard" element={
                      <LocalProtectedRoute requiredRole={['recruiter']}>
                        <RecruiterDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/recruiter/dashboard/:dashboardId" element={
                      <LocalProtectedRoute requiredRole={['recruiter']}>
                        <RecruiterDashboardDynamic />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/recruiter/post-job" element={
                      <LocalProtectedRoute requiredRole={['recruiter']}>
                        <PostJob />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/recruiter/create-test" element={
                      <LocalProtectedRoute requiredRole={['recruiter']}>
                        <CreateTest />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* HRMS Routes with nested structure */}
                    <Route path="/recruiter/hrms" element={
                      <LocalProtectedRoute requiredRole={['recruiter']}>
                        <HRMSLayout />
                      </LocalProtectedRoute>
                    }>
                      <Route index element={<HRDashboard />} />
                      <Route path="dashboard" element={<HRDashboard />} />
                      <Route path="analytics" element={<HRAnalyticsDashboard />} />
                      <Route path="onboard" element={<OnboardEmployee />} />
                      <Route path="employees" element={<EmployeeDirectory />} />
                      <Route path="attendance" element={<AttendanceManagement />} />
                      <Route path="leaves" element={<LeaveManager />} />
                      <Route path="leave/manager" element={<LeaveManager />} />
                      <Route path="payroll" element={<PayrollPage />} />
                      <Route path="payroll/upload" element={<PayrollPage />} />
                      <Route path="performance" element={<PerformanceManagement />} />
                      <Route path="performance/feedback" element={<PerformanceManagement />} />
                      <Route path="org-chart" element={<OrganizationChart />} />
                      <Route path="ta-da" element={<TADAManagement />} />
                      <Route path="documents" element={<DocumentVault />} />
                      <Route path="projects" element={<ProjectManagement />} />
                      <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">HRMS Settings</h2><p className="text-gray-600 mt-2">Settings and compliance module coming soon...</p></div>} />
                    </Route>
                    
                    {/* Protected Freelancer Routes */}
                    <Route path="/freelancer/dashboard" element={
                      <LocalProtectedRoute requiredRole={['freelancer']}>
                        <FreelancerDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/freelancer/profile" element={
                      <LocalProtectedRoute requiredRole={['freelancer']}>
                        <FreelancerProfile />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/freelancer/proposals" element={
                      <LocalProtectedRoute requiredRole={['freelancer']}>
                        <FreelancerProposals />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/freelancer/portfolio" element={
                      <LocalProtectedRoute requiredRole={['freelancer']}>
                        <FreelancerPortfolio />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/freelancer/earnings" element={
                      <LocalProtectedRoute requiredRole={['freelancer']}>
                        <FreelancerEarnings />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/gigs/:id" element={
                      <LocalProtectedRoute requiredRole={['freelancer']}>
                        <GigDetails />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Protected Client Routes - FIXED */}
                    <Route path="/client/dashboard" element={
                      <LocalProtectedRoute requiredRole={['client']}>
                        <ClientDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/client/dashboard/:id" element={
                      <LocalProtectedRoute requiredRole={['client']}>
                        <ClientDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/client/post-gig" element={
                      <LocalProtectedRoute requiredRole={['client']}>
                        <PostGig />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/client/chat" element={
                      <LocalProtectedRoute requiredRole={['client']}>
                        <ClientChat />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/client/gig/:id" element={
                      <LocalProtectedRoute requiredRole={['client']}>
                        <GigDetail />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/client/browse-freelancers" element={
                      <LocalProtectedRoute requiredRole={['client']}>
                        <BrowseFreelancers />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Protected College Routes */}
                    <Route path="/college/dashboard" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <CollegeDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/college/placement-drives" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <PlacementDrives />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/college/placement-drives/:driveId/view" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <ViewPlacementDrive />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/college/placement-drives/:driveId/manage" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <ManagePlacementDrive />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/college/students" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <Students />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/college/companies" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <Companies />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/college/reports" element={
                      <LocalProtectedRoute requiredRole={['college']}>
                        <Reports />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Protected Student Routes */}
                    <Route path="/student/dashboard" element={
                      <LocalProtectedRoute requiredRole={['student']}>
                        <StudentDashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/student/analytics" element={
                      <LocalProtectedRoute requiredRole={['student']}>
                        <StudentAnalytics />
                      </LocalProtectedRoute>
                    } />

                    <Route path="/profile" element={
                      <LocalProtectedRoute requiredRole={['jobseeker', 'recruiter', 'freelancer', 'client', 'college', 'student']}>
                        <ProfilePage />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Admin Routes - keeping original AuthGuard for admin */}
                    <Route path="/admin-access" element={<AdminAccess />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={
                      <ProtectedAdminRoute>
                        <AdminLayout />
                      </ProtectedAdminRoute>
                    }>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<ManageUsers />} />
                      <Route path="jobs" element={<ManageJobs />} />
                      <Route path="tests" element={<ManageTests />} />
                      <Route path="interviews" element={<ManageInterviews />} />
                      <Route path="documents" element={<ManageDocuments />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="onboarding" element={<Onboarding />} />
                      <Route path="employees" element={<Employees />} />
                      <Route path="hr-jobs" element={<HRJobs />} />
                      <Route path="hr-tests" element={<HRTests />} />
                      <Route path="hr-interviews" element={<HRInterviews />} />
                      <Route path="hr-analytics" element={<HRAnalytics />} />
                      <Route path="blog" element={<BlogManagement />} />
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="orders" element={<OrderManagement />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </LocalAuthProvider>
            </BrowserRouter>
          </AdminAuthProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
