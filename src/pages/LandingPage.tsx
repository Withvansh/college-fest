import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Search, Star, Users, Code, Briefcase, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import LiveFeedsSection from '@/components/LiveFeedsSection';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import BlogSection from '@/components/BlogSection';
import MarqueeSection from '@/components/MarqueeSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import WhyChooseUs from '@/sections/homepage/WhyChooseUs';
import HowItWorks from '@/sections/homepage/HowItWorks';
import Testimonials from '@/sections/homepage/Testimonials';
import CTA from '@/sections/homepage/CTA';
import { useAuth } from '@/hooks/useAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Use your existing auth hook
  const { user, isAuthenticated, loading } = useAuth();

  // Debug current auth state
  useEffect(() => {
    console.log('LandingPage - Auth Debug:', {
      isAuthenticated,
      loading,
      user: user
        ? {
            id: user._id,
            role: user.role,
            email: user.email,
          }
        : null,
      localStorage: {
        token: !!localStorage.getItem('token'),
        authToken: !!localStorage.getItem('authToken'),
        user: !!localStorage.getItem('user'),
        userRole: localStorage.getItem('userRole'),
        role: localStorage.getItem('role'),
      },
    });
  }, [isAuthenticated, loading, user]);

  // Handle Post a Job click
  const handlePostJobClick = (e: React.MouseEvent) => {
    e.preventDefault();

    console.log('Post Job clicked - Auth:', isAuthenticated, 'Loading:', loading, 'User:', user);

    // If still loading, show loading message
    if (loading) {
      toast.info('Loading', {
        description: 'Please wait while we check your authentication status...',
        duration: 2000,
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast.info('Authentication Required', {
        description: 'Please sign up or log in to post a job.',
        duration: 3000,
      });
      navigate('/auth?tab=signup&redirect=post-job&type=recruiter');
      return;
    }

    // Get user role - check multiple possible properties
    const userRole = user.role || localStorage.getItem('userRole') || localStorage.getItem('role');

    console.log('User role for job posting:', userRole);

    // Check if user role has permission to post jobs
    const allowedRoles = ['recruiter', 'hr', 'admin', 'employer', 'company'];
    const currentRole = userRole?.toLowerCase();

    if (allowedRoles.includes(currentRole || '')) {
      console.log('User has permission, redirecting to /recruiter/post-job');
      navigate('/recruiter/post-job');
    } else {
      console.log('User does not have permission. Current role:', userRole);
      toast.error('Access Denied', {
        description: `You don't have permission to post jobs. Only recruiters, HR personnel, and employers can post jobs. Your current role: ${userRole || 'Unknown'}`,
        duration: 5000,
        action: {
          label: 'Switch to Recruiter',
          onClick: () => navigate('/auth?tab=signup&type=recruiter'),
        },
      });
    }
  };

  // Handle Post a Project click
  const handlePostProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();

    console.log(
      'Post Project clicked - Auth:',
      isAuthenticated,
      'Loading:',
      loading,
      'User:',
      user
    );

    // If still loading, show loading message
    if (loading) {
      toast.info('Loading', {
        description: 'Please wait while we check your authentication status...',
        duration: 2000,
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast.info('Authentication Required', {
        description: 'Please sign up or log in to post a project.',
        duration: 3000,
      });
      navigate('/auth?tab=signup&redirect=post-project&type=client');
      return;
    }

    // Get user role - check multiple possible properties
    const userRole = user.role || localStorage.getItem('userRole') || localStorage.getItem('role');

    console.log('User role for project posting:', userRole);

    // Check if user role has permission to post projects
    const allowedRoles = ['client', 'admin', 'employer', 'company', 'freelancer'];
    const currentRole = userRole?.toLowerCase();

    if (allowedRoles.includes(currentRole || '')) {
      console.log('User has permission, redirecting to /post-project');
      navigate('/post-project');
    } else {
      console.log('User does not have permission. Current role:', userRole);
      toast.error('Access Denied', {
        description: `You don't have permission to post projects. Only clients and employers can post projects. Your current role: ${userRole || 'Unknown'}`,
        duration: 5000,
        action: {
          label: 'Switch to Client',
          onClick: () => navigate('/auth?tab=signup&type=client'),
        },
      });
    }
  };

  useEffect(() => {
    // Security: Handle OAuth callback tokens if they mistakenly end up on landing page
    const handleOAuthTokens = async () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);

      if (hash && hash.includes('access_token')) {
        console.log('OAuth tokens detected on landing page - redirecting to callback handler');

        // Extract role from URL if available, default to recruiter for Google OAuth
        const role = urlParams.get('role') || 'recruiter';

        // Preserve the hash when redirecting to callback handler
        const callbackUrl = `/auth/callback?role=${role}${hash}`;
        window.location.href = callbackUrl;
        return;
      }
    };

    handleOAuthTokens();
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full">
      {/* Hero Section - Enhanced */}
      <div className="relative overflow-hidden w-full min-h-screen flex items-center bg-white">
        {/* Noise Texture (Darker Dots) Background */}
        {/* <div
          className="absolute inset-0 z-0"
          style={{
            background: '#ffffff',
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
            backgroundSize: '15px 15px',
          }}
        /> */}
        {/* Enhanced Animated Background Shapes - Responsive */}
        <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-48 h-48 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl animate-pulse"></div>
        <div className="absolute top-16 sm:top-32 right-5 sm:right-10 w-44 h-44 sm:w-72 sm:h-72 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-5 sm:bottom-10 left-1/2 w-48 h-48 sm:w-80 sm:h-80 lg:w-[30rem] lg:h-[30rem] bg-gradient-to-r from-indigo-400/40 to-blue-400/40 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 sm:w-64 sm:h-64 lg:w-[24rem] lg:h-[24rem] bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl animate-pulse delay-3000"></div>

        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="text-center max-w-7xl mx-auto">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-100/90 to-purple-100/90 backdrop-blur-sm text-blue-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-fade-in border border-blue-200/60 shadow-xl">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-500" />
              <span className="hidden sm:inline">🏆 #1 HR Platform for Modern Companies</span>
              <span className="sm:hidden">🏆 #1 HR Platform</span>
            </div>

            {/* Enhanced Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-4xl xl:text-6xl font-extrabold mb-4 sm:mb-6  animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent 
               drop-shadow-lg">
                Find your dream job in Minutes
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
                Daily Job Offers & Freelance Projects
              </span>
            </h1>

            {/* Enhanced Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium px-4 sm:px-0">
              Hire or Get Hired Everything at MinuteHire Transform your workforce with an all-in-one platform for intelligent hiring,
              effortless onboarding, and complete employee lifecycle management.
            </p>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 animate-fade-in px-4 sm:px-0">
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700 bg-white/70 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-bold text-gray-900 text-base sm:text-lg">10,000+</span>
                <span className="font-medium text-sm sm:text-base">Companies Trust Us</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700 bg-white/70 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span className="font-bold text-gray-900 text-base sm:text-lg">99%</span>
                <span className="font-medium text-sm sm:text-base">Faster Hiring</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700 bg-white/70 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto justify-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                <span className="font-bold text-gray-900 text-base sm:text-lg">5/5</span>
                <span className="font-medium text-sm sm:text-base">Highest Rating</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 animate-fade-in px-4 sm:px-0">
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">Find Your Dream Job</span>
                  <span className="sm:hidden">Find Jobs</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/80 text-gray-700 hover:bg-white hover:text-gray-900 px-6 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                onClick={handlePostJobClick}
                disabled={loading}
              >
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <span className="hidden sm:inline">Post a Job</span>
                <span className="sm:hidden">Post Job</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                onClick={handlePostProjectClick}
                disabled={loading}
              >
                <Code className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <span className="hidden sm:inline">Post a Project</span>
                <span className="sm:hidden">Post Project</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LiveFeedsSection />
      <WhyChooseUs />
      <HowItWorks />
      <BlogSection />
      <MarqueeSection />
      <SocialMediaSection />
      <Testimonials />
      <CTA />
      <Footer />
      <FloatingActionButtons />
    </div>
  );
};

export default LandingPage;
