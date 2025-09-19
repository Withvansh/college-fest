import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Eye,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Building,
  GraduationCap,
  Briefcase,
  UserCheck,
  Code,
  Play,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Globe,
  Rocket,
  ChevronRight,
  Calendar,
  Coffee,
  Brain,
  BarChart3,
  Sparkles,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import FloatingActionButtons from '@/components/FloatingActionButtons';

const AboutUs = () => {
  const [counters, setCounters] = useState({
    students: 0,
    recruiters: 0,
    assessments: 0,
    campuses: 0,
    projects: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      students: 12000,
      recruiters: 2000,
      assessments: 60000,
      campuses: 150,
      projects: 5000,
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 fps
    const increment = duration / steps;

    Object.keys(targets).forEach(key => {
      const target = targets[key as keyof typeof targets];
      const stepValue = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, increment);
    });
  }, []);

  const howItWorks = [
    {
      step: '01',
      title: 'Sign Up & Create Profile',
      description:
        'Register as a student, recruiter, or college and build your comprehensive profile with AI assistance.',
      icon: UserCheck,
      color: 'blue',
    },
    {
      step: '02',
      title: 'AI Matching & Assessment',
      description:
        'Our intelligent system matches candidates with opportunities and conducts skill assessments.',
      icon: Zap,
      color: 'purple',
    },
    {
      step: '03',
      title: 'Interview & Selection',
      description: 'Streamlined interview process with AI-powered scheduling and evaluation tools.',
      icon: Users,
      color: 'green',
    },
    {
      step: '04',
      title: 'Onboarding & Growth',
      description:
        'Complete HRMS integration for seamless onboarding and career development tracking.',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const impactStats = [
    {
      number: counters.students.toLocaleString() + '+',
      label: 'Students',
      sublabel: 'onboarded across colleges',
      icon: GraduationCap,
      color: 'blue',
    },
    {
      number: counters.recruiters.toLocaleString() + '+',
      label: 'Recruiters',
      sublabel: 'using the platform',
      icon: UserCheck,
      color: 'purple',
    },
    {
      number: counters.assessments.toLocaleString() + '+',
      label: 'Assessments',
      sublabel: 'conducted',
      icon: CheckCircle,
      color: 'green',
    },
    {
      number: counters.campuses + '+',
      label: 'Campuses',
      sublabel: 'powered by MinuteHire',
      icon: Building,
      color: 'orange',
    },
    {
      number: counters.projects.toLocaleString() + '+',
      label: 'Freelance Projects',
      sublabel: 'posted',
      icon: Briefcase,
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header with modern navigation */}

      <section className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-10 w-32 h-32 md:w-64 md:h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 md:w-96 md:h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="mb-4 px-3 md:px-4 py-2 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              🚀 Revolutionizing Hiring Since 2020
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in leading-tight">
              About MinuteHire
            </h1>
            {/*sub heading*/}
            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mb-4 md:mb-6 max-w-4xl mx-auto leading-relaxed px-2">
              One Platform Endless Hiring Possibilities Discover Talent | Unlock Careers With
              MinuteHire
            </h3>
            <p className="text-lg md:text-xl lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
              MinuteHire is your all-in-one talent hub—built for job seekers, recruiters, HR teams,
              and colleges alike. From AI-powered testing and smart placements to seamless HRMS and
              cross-industry hiring, we simplify every step of connecting people with opportunities.
              Fast, fair, and future-ready—hiring made limitless.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4">
              <Link to="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base md:text-lg px-6 md:px-10 py-3 md:py-4 rounded-xl group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-base md:text-lg px-6 md:px-10 py-3 md:py-4 rounded-xl group"
              >
                <Play className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-12 md:mt-16 px-2">
              {impactStats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${
                      stat.color === 'blue'
                        ? 'from-blue-500 to-blue-600'
                        : stat.color === 'purple'
                          ? 'from-purple-500 to-purple-600'
                          : stat.color === 'green'
                            ? 'from-green-500 to-green-600'
                            : stat.color === 'orange'
                              ? 'from-orange-500 to-orange-600'
                              : 'from-red-500 to-red-600'
                    } rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:rotate-12 transition-transform`}
                  >
                    <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 px-3 md:px-4 py-2 text-sm md:text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              ⚡ Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900">
              Unlocking Efficiency: The MinuteHire Process
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              MinuteHire is a unified platform that simplifies hiring by providing all the tools you
              need to find, hire, and manage top talent with unmatched efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* College Dashboard Block */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Building className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 text-center">
                  College Dashboard: Empowering Campus Placements
                </h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 text-center">
                  Simplify placement drives, track student progress, and manage campus hiring with
                  our intuitive College Dashboard. Designed to streamline your recruitment process
                  from start to finish.
                </p>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h4>
                  {[
                    'Placement management',
                    'Student tracking',
                    'Company partnerships',
                    'Analytics dashboard',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* HRMS Integration Block */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 text-center">
                  HRMS Integration: Corporate & Recruiter Solutions
                </h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 text-center">
                  Post jobs, shortlist candidates via AI, and manage end-to-end onboarding
                  seamlessly. Our robust HRMS integration tools provide a comprehensive platform for
                  all your hiring needs.
                </p>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h4>
                  {[
                    'AI-powered screening',
                    'Bulk hiring tools',
                    'HRMS integration',
                    'Analytics & reports',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-20">
            <div className="order-2 lg:order-1">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 md:mr-4">
                  <Target className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Purpose</h2>
              </div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">
                We are on a mission to simplify the complex world of hiring and empower every
                individual to own their career path. By creating a seamless bridge between education
                and employment, we ensure talent finds opportunity and companies build their best
                teams. Our platform is designed to make the journey from the classroom to the
                boardroom—and every step in between—more efficient, transparent, and equitable for
                everyone involved.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {[
                  { icon: Shield, text: 'Simplify the Process' },
                  { icon: Zap, text: 'Empower Individuals' },
                  { icon: Heart, text: 'Create Connections' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative mb-6 md:mb-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 w-full h-48 md:h-64 lg:h-80 object-cover"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative mb-6 md:mb-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Future of work"
                className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 w-full h-48 md:h-64 lg:h-80 object-cover"
              />
            </div>
            <div>
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 md:mr-4">
                  <Eye className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Envisioning the Future of Talent
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">
                We envision a future where talent discovery is instantaneous, fair, and beneficial
                for all. Our goal is to become the leading platform where the best talent and top
                opportunities converge without geographical or professional boundaries. We see a
                world where skills are the only currency that matters, and every individual is
                empowered to thrive in a career that fulfills them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {[
                  { icon: Globe, text: 'Seamless Connections' },
                  { icon: Rocket, text: 'Empowering Potential' },
                  { icon: Users, text: 'Beyond Boundaries' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-purple-600 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Who We Serve Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 px-3 md:px-4 py-2 text-sm md:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              🎯 Our Audience
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900">
              The MinuteHire Ecosystem
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Our platform is a comprehensive hub designed to serve every key player in the hiring
              ecosystem with intelligent, tailored solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Job Seekers */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-3 text-gray-900">
                  Students & Job Seekers
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 flex-grow">
                  Launch your career with an AI-powered platform that connects you directly to your
                  next opportunity.
                </p>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs md:text-sm font-semibold">
                    12,000+ Students
                  </Badge>
                </div>
                <div className="space-y-2">
                  {[
                    'Profile Building',
                    'Smart Applications',
                    'Skill Assessment',
                    'Career Guidance',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-xs md:text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colleges */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Building className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-3 text-gray-900">
                  Colleges & Universities
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 flex-grow">
                  Revolutionize campus placements with a centralized platform to connect students
                  with top companies.
                </p>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs md:text-sm font-semibold">
                    150+ Campuses
                  </Badge>
                </div>
                <div className="space-y-2">
                  {[
                    'Placement Automation',
                    'Industry Connections',
                    'Skill Gap Analysis',
                    'Centralized Dashboards',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-xs md:text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* HR & Recruiters */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-3 text-gray-900">
                  HR & Recruiters
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 flex-grow">
                  Streamline your entire talent acquisition process with smart, automated tools for
                  hiring and management.
                </p>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs md:text-sm font-semibold">
                    2,000+ Recruiters
                  </Badge>
                </div>
                <div className="space-y-2">
                  {[
                    'Applicant Tracking',
                    'AI-Powered Hiring',
                    'HRMS integration',
                    'Compliance & Management',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-xs md:text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Freelancers */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardContent className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Code className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-3 text-gray-900">
                  Freelancers & Clients
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 flex-grow">
                  Discover and deliver exceptional work with a seamless platform for project
                  management and talent discovery.
                </p>
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs md:text-sm font-semibold">
                    5,000+ Projects
                  </Badge>
                </div>
                <div className="space-y-2">
                  {[
                    'Project Discovery',
                    'Client Management',
                    'Secure Payments',
                    'Milestone Tracking',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-xs md:text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose MinuteHire */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 px-3 md:px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
              ✨ Why Choose MinuteHire?
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              One Platform.
              <br />
              Endless Possibilities.
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8 md:mb-12 px-2">
              Because hiring isn't just about jobs – it's about building futures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Multi-user Ecosystem',
                desc: 'Job Seekers, HR, Freelancers, Clients, Colleges - all in one platform',
              },
              {
                icon: Target,
                title: 'Affordable Plans',
                desc: 'Starting free, scaling as you grow with transparent pricing',
              },
              {
                icon: Brain,
                title: 'AI-powered Insights',
                desc: 'Better hiring & career growth with intelligent automation',
              },
              {
                icon: BarChart3,
                title: 'End-to-end Management',
                desc: 'Jobs, HRMS, Projects, Placements - comprehensive solution',
              },
              {
                icon: Shield,
                title: 'Global-standard Security',
                desc: 'Enterprise-grade security & compliance for all users',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                desc: 'Round-the-clock assistance whenever you need help',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
                  {item.title}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <div className="flex items-center justify-center text-white font-semibold text-lg md:text-xl mb-6 md:mb-8 px-4">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-3" />
              "Because hiring isn't just about jobs – it's about building futures."
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/" className="flex items-center">
                  Start Your Journey
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 bg-transparent border-white text-white hover:bg-white hover:text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300"
              >
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 px-3 md:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            💼 Join Our Team
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900">
            Join Our Revolution
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-2">
            Become Part of the Team That's Shaping the Future of Work Join us in building a platform
            that revolutionizes how everyone, from students to recruiters, connects with career
            opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {[
              {
                icon: Coffee,
                title: 'Flexible Work',
                desc: 'Thrive professionally and personally with flexible hours and remote options',
              },
              {
                icon: TrendingUp,
                title: 'Career Advancement',
                desc: 'Invest in your future with continuous learning and clear career paths',
              },
              {
                icon: Users,
                title: 'Collaborative Culture',
                desc: 'Work with passionate, talented, and supportive individuals. Collaborate with talented, passionate people',
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <benefit.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-8 md:py-12 px-4 md:px-6 text-center rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-8 left-8 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-20 h-20 md:w-32 md:h-32 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-20 md:h-20 bg-blue-300/20 rounded-full blur-lg animate-bounce"></div>
            </div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <Rocket className="h-6 w-6 md:h-8 md:w-8 text-white animate-bounce" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 animate-fade-in px-2">
                Ready to Revolutionize Your Career?
              </h2>
              <p className="text-base md:text-lg lg:text-xl mb-6 text-blue-100 max-w-2xl mx-auto leading-relaxed animate-slide-up px-2">
                Whether you're a student, recruiter, freelancer, or college, MinuteHire is the
                intelligent partner you've been looking for. Join thousands who have already
                streamlined their hiring and career journeys with our all-in-one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 md:mb-8 px-4">
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 text-sm md:text-base px-6 md:px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 group"
                  >
                    <Star className="mr-2 h-3 w-3 md:h-4 md:w-4 group-hover:rotate-12 transition-transform" />
                    Explore Plans
                  </Button>
                </Link>
                <Link to="/auth/jobseeker" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-black/20 border-2 border-white/30 text-white hover:bg-white/10 hover:scale-105 text-sm md:text-base px-6 md:px-8 py-3 rounded-lg font-semibold backdrop-blur-sm transition-all duration-300 group"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center px-2">
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Shield className="h-4 w-4 md:h-6 md:w-6 text-white group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-lg md:text-2xl font-bold mb-1">24/7</div>
                  <div className="text-blue-200 text-xs font-medium">Round-the-Clock Support</div>
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Zap className="h-4 w-4 md:h-6 md:w-6 text-white group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-lg md:text-2xl font-bold mb-1">99.9%</div>
                  <div className="text-blue-200 text-xs font-medium">Uninterrupted Service</div>
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Calendar className="h-4 w-4 md:h-6 md:w-6 text-white group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-lg md:text-2xl font-bold mb-1">30 Day</div>
                  <div className="text-blue-200 text-xs font-medium">Zero-Risk Trial</div>
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Heart className="h-4 w-4 md:h-6 md:w-6 text-white group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-lg md:text-2xl font-bold mb-1">NO</div>
                  <div className="text-blue-200 text-xs font-medium">Cost-Free Onboarding</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActionButtons />
    </div>
  );
};

export default AboutUs;
