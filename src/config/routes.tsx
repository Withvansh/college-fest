import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load components
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const Index = lazy(() => import('@/pages/Index'));
const Services = lazy(() => import('@/pages/Services'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions'));
const RefundPolicy = lazy(() => import('@/pages/RefundPolicy'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const CheckPremium = lazy(() => import('@/pages/CheckPremium'));
const FreeTest = lazy(() => import('@/pages/FreeTest'));
const TakeTest = lazy(() => import('@/pages/TakeTest'));
const TestResults = lazy(() => import('@/pages/TestResults'));
const AIInterview = lazy(() => import('@/pages/AIInterview'));
const AIVideoInterview = lazy(() => import('@/pages/AIVideoInterview'));
const AITextInterview = lazy(() => import('@/pages/AITextInterview'));
const AIInterviewResults = lazy(() => import('@/pages/AIInterviewResults'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const FakePhonePe = lazy(() => import('@/pages/FakePhonePe'));

// Job-related pages
const JobListings = lazy(() => import('@/pages/jobs/JobListings'));
const JobDetailsPage = lazy(() => import('@/pages/jobs/JobDetailsPage'));

// Auth pages
const AuthCallback = lazy(() => import('@/pages/auth/AuthCallback'));
const JobSeekerLogin = lazy(() => import('@/pages/auth/JobSeekerLogin'));
const RecruiterLogin = lazy(() => import('@/pages/auth/RecruiterLogin'));
const FreelancerLogin = lazy(() => import('@/pages/auth/FreelancerLogin'));
const ClientLogin = lazy(() => import('@/pages/auth/ClientLogin'));
const CollegeLogin = lazy(() => import('@/pages/auth/CollegeLogin'));
const StudentLogin = lazy(() => import('@/pages/auth/StudentLogin'));

// Dashboard pages
const JobSeekerDashboard = lazy(() => import('@/pages/jobseeker/JobSeekerDashboard'));
const JobSeekerProfile = lazy(() => import('@/pages/jobseeker/JobSeekerProfile'));
const JobSeekerApplications = lazy(() => import('@/pages/jobseeker/JobSeekerApplications'));
const JobDetails = lazy(() => import('@/pages/jobseeker/JobDetails'));
const TestDetails = lazy(() => import('@/pages/jobseeker/TestDetails'));

const RecruiterDashboard = lazy(() => import('@/pages/recruiter/RecruiterDashboard'));
const RecruiterDashboardDynamic = lazy(() => import('@/pages/recruiter/RecruiterDashboardDynamic'));
const PostJob = lazy(() => import('@/pages/recruiter/PostJob'));
const CreateTest = lazy(() => import('@/pages/recruiter/CreateTest'));

const FreelancerDashboard = lazy(() => import('@/pages/freelancer/FreelancerDashboard'));
const FreelancerProfile = lazy(() => import('@/pages/freelancer/FreelancerProfile'));
const FreelancerPortfolio = lazy(() => import('@/pages/freelancer/FreelancerPortfolio'));
const FreelancerProposals = lazy(() => import('@/pages/freelancer/FreelancerProposals'));
const FreelancerEarnings = lazy(() => import('@/pages/freelancer/FreelancerEarnings'));
const GigDetails = lazy(() => import('@/pages/freelancer/GigDetails'));

const ClientDashboard = lazy(() => import('@/pages/client/ClientDashboard'));
const PostGig = lazy(() => import('@/pages/client/PostGig'));
const BrowseFreelancers = lazy(() => import('@/pages/client/BrowseFreelancers'));
const GigDetail = lazy(() => import('@/pages/client/GigDetail'));
const ClientChat = lazy(() => import('@/pages/client/ClientChat'));

const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'));
const StudentAnalytics = lazy(() => import('@/pages/student/StudentAnalytics'));

const CollegeDashboard = lazy(() => import('@/pages/college/CollegeDashboard'));
const Students = lazy(() => import('@/pages/college/Students'));
const Companies = lazy(() => import('@/pages/college/Companies'));
const PlacementDrives = lazy(() => import('@/pages/college/PlacementDrives'));
const ManagePlacementDrive = lazy(() => import('@/pages/college/ManagePlacementDrive'));
const ViewPlacementDrive = lazy(() => import('@/pages/college/ViewPlacementDrive'));
const Reports = lazy(() => import('@/pages/college/Reports'));

// Campus hiring
const CampusHiring = lazy(() => import('@/pages/CampusHiring'));
const BookCampusDrive = lazy(() => import('@/pages/BookCampusDrive'));

// Digital Products
const DigitalProducts = lazy(() => import('@/pages/DigitalProducts'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));

// Blog
const Blog = lazy(() => import('@/pages/Blog'));

// Profile
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ProfileSetup = lazy(() => import('@/components/profile/ProfileSetup'));

// Admin pages
const AdminAccess = lazy(() => import('@/pages/AdminAccess'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));
const ManageJobs = lazy(() => import('@/pages/admin/ManageJobs'));
const ManageTests = lazy(() => import('@/pages/admin/ManageTests'));
const ManageInterviews = lazy(() => import('@/pages/admin/ManageInterviews'));
const ManageDocuments = lazy(() => import('@/pages/admin/ManageDocuments'));
const ProductManagement = lazy(() => import('@/pages/admin/ProductManagement'));
const OrderManagement = lazy(() => import('@/pages/admin/OrderManagement'));
const BlogManagement = lazy(() => import('@/pages/admin/BlogManagement'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const HRJobs = lazy(() => import('@/pages/admin/HRJobs'));
const HRTests = lazy(() => import('@/pages/admin/HRTests'));
const HRInterviews = lazy(() => import('@/pages/admin/HRInterviews'));
const HRAnalytics = lazy(() => import('@/pages/admin/HRAnalytics'));
const Employees = lazy(() => import('@/pages/admin/Employees'));
const Onboarding = lazy(() => import('@/pages/admin/Onboarding'));
const SuperAdminLogin = lazy(() => import('@/pages/admin/SuperAdminLogin'));

import { UserRole } from '@/services/unifiedAuth';

export const dashboardRoutes: Record<UserRole, string> = {
  jobseeker: '/jobseeker/dashboard',
  recruiter: '/recruiter/dashboard',
  freelancer: '/freelancer/dashboard',
  client: '/client/dashboard',
  college: '/college/dashboard',
  student: '/student/dashboard',
  admin: '/admin/dashboard',
  hr_admin: '/admin/dashboard',
  super_admin: '/super-admin/dashboard',
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/about',
    element: <AboutUs />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/terms-conditions',
    element: <TermsAndConditions />,
  },
  {
    path: '/refund-policy',
    element: <RefundPolicy />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/check-premium',
    element: <CheckPremium />,
  },
  {
    path: '/free-test',
    element: <FreeTest />,
  },
  {
    path: '/take-test/:testId',
    element: <TakeTest />,
  },
  {
    path: '/test-results/:attemptId',
    element: <TestResults />,
  },
  {
    path: '/ai-interview',
    element: <AIInterview />,
  },
  {
    path: '/ai-video-interview/:interviewId',
    element: <AIVideoInterview />,
  },
  {
    path: '/ai-text-interview/:interviewId',
    element: <AITextInterview />,
  },
  {
    path: '/ai-interview-results/:interviewId',
    element: <AIInterviewResults />,
  },
  {
    path: '/payment-success',
    element: <PaymentSuccess />,
  },
  {
    path: '/fake-phonepe',
    element: <FakePhonePe />,
  },
  {
    path: '/campus-hiring',
    element: <CampusHiring />,
  },
  {
    path: '/book-campus-drive',
    element: <BookCampusDrive />,
  },
  {
    path: '/products',
    element: <DigitalProducts />,
  },
  {
    path: '/products/:id',
    element: <ProductDetail />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/profile-setup',
    element: <ProfileSetup />,
  },

  // Job routes
  {
    path: '/jobs',
    element: <JobListings />,
  },
  {
    path: '/jobs/:id',
    element: <JobDetailsPage />,
  },

  // Auth routes
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/auth/jobseeker-login',
    element: <JobSeekerLogin />,
  },
  {
    path: '/auth/recruiter-login',
    element: <RecruiterLogin />,
  },
  {
    path: '/auth/freelancer-login',
    element: <FreelancerLogin />,
  },
  {
    path: '/auth/client-login',
    element: <ClientLogin />,
  },
  {
    path: '/auth/college-login',
    element: <CollegeLogin />,
  },
  {
    path: '/auth/student-login',
    element: <StudentLogin />,
  },

  // JobSeeker routes
  {
    path: '/jobseeker/dashboard',
    element: <JobSeekerDashboard />,
  },
  {
    path: '/jobseeker/profile',
    element: <JobSeekerProfile />,
  },
  {
    path: '/jobseeker/applications',
    element: <JobSeekerApplications />,
  },
  {
    path: '/jobseeker/jobs/:id',
    element: <JobDetails />,
  },
  {
    path: '/jobseeker/tests/:id',
    element: <TestDetails />,
  },

  // Recruiter routes
  {
    path: '/recruiter/dashboard',
    element: <RecruiterDashboard />,
  },
  {
    path: '/recruiter/dashboard/:dashboardId',
    element: <RecruiterDashboardDynamic />,
  },
  {
    path: '/recruiter/hrms',
    element: <RecruiterDashboard />,
  },
  {
    path: '/recruiter/post-job',
    element: <PostJob />,
  },
  {
    path: '/recruiter/create-test',
    element: <CreateTest />,
  },

  // Freelancer routes
  {
    path: '/freelancer/dashboard',
    element: <FreelancerDashboard />,
  },
  {
    path: '/freelancer/profile',
    element: <FreelancerProfile />,
  },
  {
    path: '/freelancer/portfolio',
    element: <FreelancerPortfolio />,
  },
  {
    path: '/freelancer/proposals',
    element: <FreelancerProposals />,
  },
  {
    path: '/freelancer/earnings',
    element: <FreelancerEarnings />,
  },
  {
    path: '/freelancer/gigs/:id',
    element: <GigDetails />,
  },

  // Client routes
  {
    path: '/client/dashboard',
    element: <ClientDashboard />,
  },
  {
    path: '/client/post-gig',
    element: <PostGig />,
  },
  {
    path: '/client/browse-freelancers',
    element: <BrowseFreelancers />,
  },
  {
    path: '/client/gigs/:id',
    element: <GigDetail />,
  },
  {
    path: '/client/chat',
    element: <ClientChat />,
  },

  // Student routes
  {
    path: '/student/dashboard',
    element: <StudentDashboard />,
  },
  {
    path: '/student/analytics',
    element: <StudentAnalytics />,
  },

  // College routes
  {
    path: '/college/dashboard',
    element: <CollegeDashboard />,
  },
  {
    path: '/college/students',
    element: <Students />,
  },
  {
    path: '/college/companies',
    element: <Companies />,
  },
  {
    path: '/college/placement-drives',
    element: <PlacementDrives />,
  },
  {
    path: '/college/placement-drives/manage',
    element: <ManagePlacementDrive />,
  },
  {
    path: '/college/placement-drives/:id',
    element: <ViewPlacementDrive />,
  },
  {
    path: '/college/reports',
    element: <Reports />,
  },

  // Admin routes
  {
    path: '/admin-access',
    element: <AdminAccess />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/users',
    element: <ManageUsers />,
  },
  {
    path: '/admin/jobs',
    element: <ManageJobs />,
  },
  {
    path: '/admin/tests',
    element: <ManageTests />,
  },
  {
    path: '/admin/interviews',
    element: <ManageInterviews />,
  },
  {
    path: '/admin/documents',
    element: <ManageDocuments />,
  },
  {
    path: '/admin/products',
    element: <ProductManagement />,
  },
  {
    path: '/admin/orders',
    element: <OrderManagement />,
  },
  {
    path: '/admin/blog',
    element: <BlogManagement />,
  },
  {
    path: '/admin/reports',
    element: <Reports />,
  },
  {
    path: '/admin/settings',
    element: <Settings />,
  },
  {
    path: '/admin/hr-jobs',
    element: <HRJobs />,
  },
  {
    path: '/admin/hr-tests',
    element: <HRTests />,
  },
  {
    path: '/admin/hr-interviews',
    element: <HRInterviews />,
  },
  {
    path: '/admin/hr-analytics',
    element: <HRAnalytics />,
  },
  {
    path: '/admin/employees',
    element: <Employees />,
  },
  {
    path: '/admin/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/superadmin/login',
    element: <SuperAdminLogin />,
  },

  // 404 route
  {
    path: '*',
    element: <NotFound />,
  },
];
