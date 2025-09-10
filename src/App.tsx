import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { UnifiedAuthProvider } from './contexts/UnifiedAuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import UnifiedProtectedRoute from './components/auth/UnifiedProtectedRoute';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Blog from './pages/Blog';
import FreeTest from './pages/FreeTest';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import Pricing from './pages/Pricing';
import CampusHiring from './pages/CampusHiring';
import BookCampusDrive from './pages/BookCampusDrive';
import AIInterview from './pages/AIInterview';
import AITextInterview from './pages/AITextInterview';
import AIInterviewResults from './pages/AIInterviewResults';
import AIVideoInterview from './pages/AIVideoInterview';
import UnifiedAuth from './pages/auth/UnifiedAuth';
import AuthCallback from './pages/auth/AuthCallback';
import JobSeekerDashboard from './pages/jobseeker/JobSeekerDashboard';
import JobSeekerApplications from './pages/jobseeker/JobSeekerApplications';
import JobSeekerProfile from './pages/jobseeker/JobSeekerProfile';
import JobDetails from './pages/jobseeker/JobDetails';
import JobDetailsPage from './pages/jobs/JobDetailsPage';
import JobListings from './pages/jobs/JobListings';
import TestDetails from './pages/jobseeker/TestDetails';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import PostJob from './pages/recruiter/PostJob';
import CreateTest from './pages/recruiter/CreateTest';
import HRMSLayout from './components/hrms/HRMSLayout';
import HRDashboard from './components/hrms/HRDashboard';
import HRAnalyticsDashboard from './components/hrms/HRAnalyticsDashboard';
import OnboardEmployee from './components/hrms/OnboardEmployee';
import EmployeeDirectory from './components/hrms/EmployeeDirectory';
import AttendanceManagement from './components/hrms/AttendanceManagement';
import AttendancePage from './components/hrms/AttendancePage';
import LeaveManager from './components/hrms/LeaveManager';
import PayrollPage from './components/hrms/PayrollPage';
import PerformanceManagement from './components/hrms/PerformanceManagement';
import OrganizationChart from './components/hrms/OrganizationChart';
import TADAManagement from './components/hrms/TADAManagement';
import DocumentVault from './components/hrms/DocumentVault';
import ProjectManagement from './components/hrms/ProjectManagement';
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard';
import FreelancerProfile from './pages/freelancer/FreelancerProfile';
import FreelancerProposals from './pages/freelancer/FreelancerProposals';
import FreelancerPortfolio from './pages/freelancer/FreelancerPortfolio';
import FreelancerEarnings from './pages/freelancer/FreelancerEarnings';
import GigDetails from './pages/freelancer/GigDetails';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProfile from './pages/client/ClientProfile';
import PostGig from './pages/client/PostGig';
import ClientChat from './pages/client/ClientChat';
import GigDetail from './pages/client/GigDetail';
import BrowseFreelancers from './pages/client/BrowseFreelancers';
import CollegeDashboard from './pages/college/CollegeDashboard';
import CollegeProfile from './pages/college/CollegeProfile';
import PlacementDrives from './pages/college/PlacementDrives';
import ViewPlacementDrive from './pages/college/ViewPlacementDrive';
import ManagePlacementDrive from './pages/college/ManagePlacementDrive';
import Students from './pages/college/Students';
import Companies from './pages/college/Companies';
import Reports from './pages/college/Reports';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentAnalytics from './pages/student/StudentAnalytics';
import StartupDashboard from './pages/startup/StartupDashboard';
import StartupProfile from './pages/startup/StartupProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import ManageUsers from './pages/admin/ManageUsers';
import ManageJobs from './pages/admin/ManageJobs';
import ManageTests from './pages/admin/ManageTests';
import ManageInterviews from './pages/admin/ManageInterviews';
import ManageDocuments from './pages/admin/ManageDocuments';
import Settings from './pages/admin/Settings';
import Onboarding from './pages/admin/Onboarding';
import Employees from './pages/admin/Employees';
import HRJobs from './pages/admin/HRJobs';
import HRTests from './pages/admin/HRTests';
import HRInterviews from './pages/admin/HRInterviews';
import HRAnalytics from './pages/admin/HRAnalytics';
import NotFound from './pages/NotFound';
import AdminAccess from './pages/AdminAccess';
import AdminLogin from './pages/admin/AdminLogin';
import BlogManagement from './pages/admin/BlogManagement';
import RecruiterDashboardDynamic from './pages/recruiter/RecruiterDashboardDynamic';
import ProfilePage from './pages/ProfilePage';
import ProfileRedirect from './components/ProfileRedirect';
import DigitalProducts from '@/pages/DigitalProducts';
import ProductManagement from './pages/admin/ProductManagement';
import BlogDetailPage from '@/pages/BlogDetailPage';
import FaqPage from '@/pages/FaqPage';
import FaqManagement from './pages/admin/FaqManagement';
import OrderManagement from './pages/admin/OrderManagement';
import PaymentSuccess from './pages/PaymentSuccess';
import HirePage from './pages/HirePage';
import JobPostings from './pages/recruiter/AllJobs';
import ViewPosting from './pages/recruiter/ViewPosting';
import AllApplications from './pages/recruiter/AllApplications';
import UniversalProfile from './components/profile/UniversalProfile';
import ViewPlacementDriveStudent from './pages/student/ViewDrive';
import StartupsPage from './pages/StartUp';
import ViewStudentProfile from './pages/college/StudentProfile';
import Counsellor from './pages/student/Counsellor';
import ViewCompany from './pages/college/ViewCompany';
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
        <BrowserRouter>
          <UnifiedAuthProvider>
            <AdminAuthProvider>
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
                  <Route path="/startup-job" element={<StartupsPage />} />
                  <Route path="/auth" element={<UnifiedAuth />} />
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
                  <Route path="/auth/jobseeker" element={<UnifiedAuth />} />
                  <Route path="/auth/recruiter" element={<UnifiedAuth />} />
                  <Route path="/auth/freelancer" element={<UnifiedAuth />} />
                  <Route path="/auth/client" element={<UnifiedAuth />} />
                  <Route path="/auth/college" element={<UnifiedAuth />} />
                  <Route path="/auth/student" element={<UnifiedAuth />} />
                  <Route path="/auth/startup" element={<UnifiedAuth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/freelancer-login" element={<UnifiedAuth />} />
                  <Route path="/client-login" element={<UnifiedAuth />} />
                  <Route path="/college-login" element={<UnifiedAuth />} />
                  <Route path="/student-login" element={<UnifiedAuth />} />
                  <Route path="/startup-login" element={<UnifiedAuth />} />

                  {/* Protected Job Seeker Routes */}
                  <Route
                    path="/jobseeker/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['jobseeker']}>
                        <JobSeekerDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobseeker/applications"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['jobseeker','Student']}>
                        <JobSeekerApplications />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobseeker/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['jobseeker']}>
                        <JobSeekerProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobseeker/job/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['jobseeker']}>
                        <JobDetails />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobseeker/test/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['jobseeker']}>
                        <TestDetails />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* Protected Recruiter Routes */}
                  <Route
                    path="/recruiter/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <RecruiterDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/applications"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <AllApplications />
                      </UnifiedProtectedRoute>
                    }
                  />

                  <Route
                    path="/recruiter/dashboard/:dashboardId"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <RecruiterDashboardDynamic />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <RecruiterProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/post-job"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <PostJob />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/jobs"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <JobPostings />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/jobs/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <ViewPosting />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/create-test"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <CreateTest />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* HRMS Routes with nested structure */}
                  <Route
                    path="/recruiter/hrms"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['recruiter']}>
                        <HRMSLayout />
                      </UnifiedProtectedRoute>
                    }
                  >
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
                    <Route
                      path="settings"
                      element={
                        <div className="p-6">
                          <h2 className="text-2xl font-bold">HRMS Settings</h2>
                          <p className="text-gray-600 mt-2">
                            Settings and compliance module coming soon...
                          </p>
                        </div>
                      }
                    />
                  </Route>

                  {/* Protected Freelancer Routes */}
                  <Route
                    path="/freelancer/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['freelancer']}>
                        <FreelancerDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/freelancer/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['freelancer']}>
                        <FreelancerProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/freelancer/proposals"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['freelancer']}>
                        <FreelancerProposals />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/freelancer/portfolio"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['freelancer']}>
                        <FreelancerPortfolio />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/freelancer/earnings"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['freelancer']}>
                        <FreelancerEarnings />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/gigs/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['freelancer']}>
                        <GigDetails />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* Protected Client Routes - FIXED */}
                  <Route
                    path="/client/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <ClientDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/dashboard/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <ClientDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <ClientProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/post-gig"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <PostGig />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/chat"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <ClientChat />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/gig/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <GigDetail />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/browse-freelancers"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['client']}>
                        <BrowseFreelancers />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* Protected College Routes */}
                  <Route
                    path="/college/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <CollegeDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                   <Route
                    path="/college/company/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <ViewCompany />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <CollegeProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/placement-drives"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <PlacementDrives />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/placement-drives/:driveId/view"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <ViewPlacementDrive />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/placement-drives/:driveId/manage"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <ManagePlacementDrive />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/students/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <Students />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/companies"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <Companies />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/student/:id"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <ViewStudentProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/college/reports"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['college']}>
                        <Reports />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* Protected Student Routes */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['Student']}>
                        <StudentDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                   <Route
                    path="/student/counsellor"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['Student']}>
                        <Counsellor />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['Student']}>
                        <StudentProfile />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/drive/:driveId"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['Student']}>
                        <ViewPlacementDriveStudent />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/analytics"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['Student']}>
                        <StudentAnalytics />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* Protected Startup Routes */}
                  <Route
                    path="/startup/dashboard"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['startup']}>
                        <StartupDashboard />
                      </UnifiedProtectedRoute>
                    }
                  />
                  <Route
                    path="/startup/profile"
                    element={
                      <UnifiedProtectedRoute allowedRoles={['startup']}>
                        <StartupProfile />
                      </UnifiedProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <UnifiedProtectedRoute
                        allowedRoles={[
                          'jobseeker',
                          'recruiter',
                          'freelancer',
                          'client',
                          'college',
                          'Student',
                          'startup',
                        ]}
                      >
                        <ProfileRedirect />
                      </UnifiedProtectedRoute>
                    }
                  />

                  {/* Admin Routes - keeping original AuthGuard for admin */}
                  <Route path="/admin-access" element={<AdminAccess />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedAdminRoute>
                        <AdminLayout />
                      </ProtectedAdminRoute>
                    }
                  >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="profile" element={<AdminProfile />} />
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

                  {/* startUp Routes */}

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AdminAuthProvider>
          </UnifiedAuthProvider>
        </BrowserRouter>
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
