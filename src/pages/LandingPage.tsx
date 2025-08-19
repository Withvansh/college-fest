import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Search, FileText, LayoutDashboard, Star, Users, TrendingUp, ChevronDown, Code, Brain, Globe, Briefcase, Building2, DollarSign, BarChart3, Clock, CheckCircle, Target, Zap, Award, Rocket, UserCheck, Settings, User, Calendar, MessageSquare, FileCheck, TestTube, Filter, Shield, GraduationCap, MonitorPlay, PenTool, Coffee } from "lucide-react";
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
        {/* Enhanced Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-indigo-900/30"></div>
        
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

            {/* New Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <Brain className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
                <h3 className="font-bold text-gray-900 mb-2">AI-Powered Matching</h3>
                <p className="text-sm text-gray-600">Advanced algorithms ensure perfect candidate-job fits</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <Zap className="w-8 h-8 text-yellow-600 mb-3 mx-auto" />
                <h3 className="font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Reduce hiring time by up to 95% with automation</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <Settings className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
                <h3 className="font-bold text-gray-900 mb-2">Complete HRMS</h3>
                <p className="text-sm text-gray-600">End-to-end employee management system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feeds Section */}
      <LiveFeedsSection />

      {/* Why Choose Us Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16 w-full">
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose MinuteHire?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Experience the future of hiring with our comprehensive platform</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Reduce hiring time by 95% with our AI-powered matching and automated workflows.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Perfect Matches</h3>
              <p className="text-gray-600 leading-relaxed">Advanced algorithms ensure perfect candidate-job fit based on skills and culture.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">End-to-End Solution</h3>
              <p className="text-gray-600 leading-relaxed">From job posting to employee management - everything in one platform.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Integrated HRMS System</h3>
              <p className="text-gray-600 leading-relaxed">Manage employee records, leave, attendance, payroll, performance, and documents — all in one place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - UPDATED WITH IMMEDIATE CTA BUTTONS */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 w-full">
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works – For Everyone</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Simple steps to revolutionize your hiring process and career journey</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-12">
            {/* For Job Seekers */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-3">For Job Seekers</h3>
                <p className="text-gray-600 mb-4">Your path to finding the perfect career opportunity</p>
                <Link to="/auth/jobseeker">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300">
                    <User className="mr-2 h-4 w-4" />
                    Login as Job Seeker
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1, 
                    title: "Build Your Profile", 
                    desc: "Create a rich, professional profile with your skills, experience, and preferences", 
                    icon: User 
                  },
                  { 
                    step: 2, 
                    title: "Apply & Take Tests", 
                    desc: "Search for jobs, apply with one click, and take role-based tests to showcase your strengths", 
                    icon: TestTube 
                  },
                  { 
                    step: 3, 
                    title: "Get Hired & Onboard", 
                    desc: "Track your progress, get feedback, and complete onboarding with ease", 
                    icon: CheckCircle 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mt-2 text-xs font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Recruiters & HR Teams */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600 mb-3">For Recruiters & HR Teams</h3>
                <p className="text-gray-600 mb-4">Your complete hiring and employee management solution</p>
                <Link to="/auth/recruiter">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6 py-2 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Login as Recruiter
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1, 
                    title: "Post Jobs & Create Tests", 
                    desc: "List openings with detailed criteria and attach smart skill assessments", 
                    icon: FileCheck 
                  },
                  { 
                    step: 2, 
                    title: "Shortlist & Interview", 
                    desc: "Filter candidates using test results, schedule interviews, and communicate seamlessly", 
                    icon: Filter 
                  },
                  { 
                    step: 3, 
                    title: "Onboard & Manage", 
                    desc: "Hire top talent, complete onboarding, and manage employees through the HRMS dashboard", 
                    icon: Settings 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mt-2 text-xs font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Section: For Freelancers & Clients */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-12">
            {/* For Freelancers & Clients */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-3">For Freelancers & Clients</h3>
                <p className="text-gray-600 mb-4">Connect, collaborate, and deliver projects seamlessly</p>
                <div className="flex gap-3 justify-center">
                  <Link to="/freelancer-login">
                    <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-2 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                      <Coffee className="mr-2 h-4 w-4" />
                      Freelancer Login
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/client-login">
                    <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Client Login
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1, 
                    title: "Create Profile or Post Gig", 
                    desc: "Freelancers list services; clients post short-term projects or hourly jobs", 
                    icon: PenTool 
                  },
                  { 
                    step: 2, 
                    title: "Collaborate & Deliver", 
                    desc: "Work is managed via milestones, secure chat, and file delivery system", 
                    icon: MessageSquare 
                  },
                  { 
                    step: 3, 
                    title: "Payment & Rating", 
                    desc: "Secure payment released after approval. Ratings help build trust", 
                    icon: Star 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mt-2 text-xs font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Colleges & Students */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-600 mb-3">For Colleges & Students</h3>
                <p className="text-gray-600 mb-4">Streamlined campus placement and career tracking</p>
                <div className="flex gap-3 justify-center">
                  <Link to="/college-login">
                    <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-4 py-2 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      College Login
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/student-login">
                    <Button variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                      <User className="mr-2 h-4 w-4" />
                      Student Login
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1, 
                    title: "Register as College or Student", 
                    desc: "Colleges create placement drives; students build verified academic profiles", 
                    icon: GraduationCap 
                  },
                  { 
                    step: 2, 
                    title: "Participate in Drives", 
                    desc: "Companies book slots, post roles; students apply and take tests/interviews", 
                    icon: Calendar 
                  },
                  { 
                    step: 3, 
                    title: "Track Selections & Reports", 
                    desc: "Placement outcomes are auto-tracked for analytics and reporting", 
                    icon: BarChart3 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mt-2 text-xs font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Section - Added above footer */}
      <BlogSection />

      {/* Social Media Section */}
      <SocialMediaSection />

      {/* Enhanced Auto-scrolling Testimonials Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16 w-full">
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 text-sm font-bold mb-6">
              <Star className="w-5 h-5 mr-2 fill-current" />
              Trusted by Industry Leaders
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-light">
              Join thousands of companies transforming their hiring process
            </p>
          </div>

          {/* Floating testimonial cards with different animations */}
          <div className="relative max-w-6xl mx-auto h-[400px] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid md:grid-cols-3 gap-6 w-full animate-float">
            {[
              { 
                name: "Sarah Johnson", 
                role: "HR Director at TechCorp", 
                content: "MinuteHire reduced our hiring time from weeks to days. The AI matching is incredibly accurate and has transformed our recruitment process completely!",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                company: "TechCorp"
              },
              { 
                name: "Michael Chen", 
                role: "Founder at StartupX", 
                content: "The testing platform helped us find developers with exactly the skills we needed. It's a complete game changer for startups looking to scale quickly!",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                company: "StartupX"
              },
              { 
                name: "Emily Rodriguez", 
                role: "Talent Manager at GlobalFirm", 
                content: "Best investment we made this year. The HRMS features streamlined our entire workflow and improved our employee satisfaction significantly.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                company: "GlobalFirm"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100 relative overflow-hidden transform hover:scale-105 ${
                  index === 0 ? 'animate-bounce-slow' : 
                  index === 1 ? 'animate-pulse-slow' : 
                  'animate-float-slow'
                }`}
                style={{
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: `${3 + index}s`
                }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Stars with animation */}
                  <div className="flex mb-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300" 
                        style={{ transitionDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  
                  {/* Quote with elegant typography */}
                  <p className="text-gray-700 mb-6 text-base leading-relaxed font-light">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-gray-500 text-xs">{testimonial.role}</div>
                      <div className="text-blue-600 text-xs font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
                
                {/* Subtle quote decoration */}
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
          
          {/* Minimalist Trust Indicators */}
          <div className="text-center mt-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <div className="font-light text-3xl text-gray-900 mb-1">10K+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Companies</div>
                </div>
                <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <div className="font-light text-3xl text-gray-900 mb-1">500K+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Hires</div>
                </div>
                <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <div className="font-light text-3xl text-gray-900 mb-1">95%</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Faster</div>
                </div>
                <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <div className="font-light text-3xl text-gray-900 mb-1">4.9★</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 w-full">
        <div className="w-full container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 10,000+ companies using MinuteHire to build better teams faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/recruiter">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-2xl">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/free-test">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl">
                Take a Free Test
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingActionButtons />
    </div>
  );
};

export default LandingPage;
