import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Code,
  Users,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Clock,
  Target,
  Briefcase,
  FileText,
  Brain,
  TrendingUp,
  Building,
  UserCheck,
  Award,
  GraduationCap,
  Calendar,
  BarChart,
  ArrowRight,
  Star,
  Sparkles,
  Play,
  ChevronRight,
} from 'lucide-react';
import Footer from '@/components/Footer';
import FloatingActionButtons from '@/components/FloatingActionButtons';

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header with modern navigation */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 group transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to home</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Our Services
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm text-blue-700 text-sm font-semibold mb-6 sm:mb-8 border border-blue-200/50">
              <Sparkles className="w-4 h-4 mr-2" />
              Comprehensive HR & Career Solutions
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              One Platform,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Endless Possibilities
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              From job seekers to enterprises, we provide AI-powered solutions that transform how
              you hire, work, and grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/auth/jobseeker" className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 rounded-xl transition-all duration-300"
              >
                <Link to="/pricing" className="flex items-center">
                  View Pricing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: For Job Seekers */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-semibold mb-6">
                <Briefcase className="w-4 h-4 mr-2" />
                For Job Seekers
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your Career,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Accelerated.
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop searching. Start growing with our comprehensive career platform.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Create a professional profile in minutes
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Apply to jobs & gigs smartly</span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    AI-powered resume feedback & skill tests
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Get trained, track interviews, and land your dream job faster
                  </span>
                </div>
              </div>

              <div className="flex items-center text-emerald-600 font-semibold text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                "Stop searching. Start growing."
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 backdrop-blur-sm border border-green-200/50">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">Dream Job Found!</h4>
                        <p className="text-sm text-gray-600">Senior Developer • Google</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm inline-block">
                        Applied
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block ml-2">
                        Interview Scheduled
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Freelancers & Clients */}
      <section className="py-16 sm:py-24 bg-gray-50/50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-sm border border-purple-200/50">
                  <div className="bg-white rounded-2xl p-6 shadow-xl mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">E-commerce Website</h4>
                      <span className="text-green-600 font-bold">$2,500</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      Payment Protected
                    </div>
                    <div className="space-y-2">
                      <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm inline-block">
                        React
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block ml-2">
                        Node.js
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold mb-6">
                <Code className="w-4 h-4 mr-2" />
                For Freelancers & Clients
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Freelancing Made
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Secure & Simple.
                </span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    Freelancers
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Build portfolio</li>
                    <li>• Apply to projects</li>
                    <li>• Showcase verified skills</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-pink-600" />
                    Clients
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Post projects for free</li>
                    <li>• Hire trusted freelancers</li>
                    <li>• Smart dashboards</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700 font-medium">
                    Escrow-based secure payments & milestone tracking
                  </span>
                </div>
              </div>

              <div className="flex items-center text-purple-600 font-semibold text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                "Build trust. Deliver impact."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: For HR & Recruiters */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm font-semibold mb-6">
                <BarChart3 className="w-4 h-4 mr-2" />
                For HR & Recruiters
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Smarter Hiring,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Simplified HR.
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Transform your HR operations with intelligent automation and comprehensive
                management tools.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Post jobs & track applicants effortlessly
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    AI screening & interview automation for faster hiring decisions
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <BarChart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Full HRMS suite: Payroll, Attendance, Leave & Performance analytics
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Compliance kit for stress-free workforce management
                  </span>
                </div>
              </div>

              <div className="flex items-center text-blue-600 font-semibold text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                "Hire the right talent, every time."
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-8 backdrop-blur-sm border border-blue-200/50">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-gray-900">Hiring Dashboard</h4>
                      <div className="flex items-center text-green-600 text-sm font-semibold">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Live
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Applications Today</span>
                        <span className="text-lg font-bold text-blue-600">24</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">AI Screening</span>
                        <span className="text-lg font-bold text-green-600">12 Qualified</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Interviews Scheduled</span>
                        <span className="text-lg font-bold text-purple-600">8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: For Colleges & Campuses */}
      <section className="py-16 sm:py-24 bg-gray-50/50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 backdrop-blur-sm border border-indigo-200/50">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">Campus Drive 2024</h4>
                        <p className="text-sm text-gray-600">15 Companies • 200+ Students</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Placement Rate</span>
                        <span className="font-bold text-green-600">85%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: '85%' }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>170 Placed</span>
                        <span>200 Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold mb-6">
                <GraduationCap className="w-4 h-4 mr-2" />
                For Colleges & Campuses
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Transform
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Campus Placements.
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Empowering campuses to place smarter, not harder.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Placement Drive Manager – organize drives seamlessly
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Recruiter & industry connect for better opportunities
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    AI-driven student skill gap analysis & training roadmap
                  </span>
                </div>

                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <BarChart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Centralized student dashboards for CRC teams
                  </span>
                </div>
              </div>

              <div className="flex items-center text-indigo-600 font-semibold text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                "Empowering campuses to place smarter, not harder."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Why Choose MinuteHire */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6">
              <Star className="w-4 h-4 mr-2" />
              Why Choose MinuteHire?
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              One Platform.
              <br />
              Endless Possibilities.
            </h2>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              Because hiring isn't just about jobs – it's about building futures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-user Ecosystem</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Job Seekers, HR, Freelancers, Clients, Colleges - all in one platform
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Affordable Plans</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Starting free, scaling as you grow with transparent pricing
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-powered Insights</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Better hiring & career growth with intelligent automation
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">End-to-end Management</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Jobs, HRMS, Projects, Placements - comprehensive solution
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global-standard Security</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Enterprise-grade security & compliance for all users
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Round-the-clock assistance whenever you need help
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="flex items-center justify-center text-white font-semibold text-xl mb-8">
              <Sparkles className="w-6 h-6 mr-3" />
              "Because hiring isn't just about jobs – it's about building futures."
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/auth/recruiter" className="flex items-center">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 bg-transparent border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl transition-all duration-300"
              >
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActionButtons />
    </div>
  );
};

export default Services;
