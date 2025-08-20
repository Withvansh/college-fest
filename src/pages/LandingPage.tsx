import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Search,  Star, Users, Code, Briefcase, Clock} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/Footer";
import LiveFeedsSection from "@/components/LiveFeedsSection";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import BlogSection from "@/components/BlogSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import WhyChooseUs from "@/sections/homepage/WhyChooseUs";
import HowItWorks from "@/sections/homepage/HowItWorks";
import Testimonials from "@/sections/homepage/Testimonials";
import CTA from "@/sections/homepage/CTA";

const LandingPage = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="relative overflow-hidden w-full min-h-screen flex items-center">
        {/* Enhanced Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-[32rem] h-[32rem] bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute top-32 right-10 w-[28rem] h-[28rem] bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/2 w-[30rem] h-[30rem] bg-gradient-to-r from-indigo-400/40 to-blue-400/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-[24rem] h-[24rem] bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-3000"></div>

        <div className="w-full px-6 py-16 relative">
          <div className="text-center max-w-6xl mx-auto">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100/90 to-purple-100/90 backdrop-blur-sm text-blue-700 text-sm font-semibold mb-6 animate-fade-in border border-blue-200/60 shadow-xl">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              🏆 #1 HR Platform for Modern Companies
            </div>

            {/* Enhanced Main Heading */}
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-lg">
                Smart Hiring Meets
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
                Seamless HRMS
              </span>
            </h1>
            
            {/* Enhanced Subheadline */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium">
              Transform your workforce with an all-in-one platform for intelligent hiring, 
              effortless onboarding, and complete employee lifecycle management.
            </p>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6 mb-10 animate-fade-in">
              <div className="flex items-center space-x-3 text-gray-700 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 text-lg">10,000+</span>
                <span className="font-medium">Companies Trust Us</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-bold text-gray-900 text-lg">95%</span>
                <span className="font-medium">Faster Hiring</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900 text-lg">4.9/5</span>
                <span className="font-medium">User Rating</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10 animate-fade-in">
              <Link to="/jobs">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <Search className="w-6 h-6 mr-3" />
                  Find Your Dream Job
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <Link to="/auth/recruiter">
                <Button size="lg" variant="outline" className="border-2 border-white/80 text-gray-700 hover:bg-white hover:text-gray-900 px-10 py-4 text-xl font-bold rounded-xl backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <Briefcase className="w-6 h-6 mr-3" />
                  Post a Job
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <Link to="/client-login">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <Code className="w-6 h-6 mr-3" />
                  Post a Project
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
      </div>

      <LiveFeedsSection />
      <WhyChooseUs/> 
      <HowItWorks/>
      <BlogSection />
      <SocialMediaSection />
      <Testimonials/> 
      <CTA/>
      <Footer />
      <FloatingActionButtons />
    </div>
  );
};

export default LandingPage;
