
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, Eye, Users, Lightbulb, Award, ArrowRight, CheckCircle, Star, 
  Building, GraduationCap, Briefcase, UserCheck, Code, Play, TrendingUp,
  Shield, Zap, Heart, Globe, Rocket, ChevronRight, Quote, MapPin,
  Calendar, Trophy, Newspaper, Coffee
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import FloatingActionButtons from "@/components/FloatingActionButtons";

const AboutUs = () => {
  const [counters, setCounters] = useState({
    students: 0,
    recruiters: 0,
    assessments: 0,
    campuses: 0,
    projects: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      students: 12000,
      recruiters: 2000,
      assessments: 60000,
      campuses: 150,
      projects: 5000
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 fps
    const increment = duration / steps;

    Object.keys(targets).forEach((key) => {
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

  const services = [
    {
      title: "AI-Powered Job Matching",
      description: "Advanced algorithms match candidates with perfect job opportunities based on skills, experience, and culture fit.",
      icon: Target,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Skill-Based Testing Platform",
      description: "Comprehensive testing solutions to evaluate candidates' technical and soft skills accurately.",
      icon: CheckCircle,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Complete HRMS Solution",
      description: "End-to-end employee lifecycle management from hiring to retirement.",
      icon: Building,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Campus Placement Management",
      description: "Streamlined campus recruitment process connecting colleges with top employers.",
      icon: Users,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Sign Up & Create Profile",
      description: "Register as a student, recruiter, or college and build your comprehensive profile with AI assistance.",
      icon: UserCheck,
      color: "blue"
    },
    {
      step: "02", 
      title: "AI Matching & Assessment",
      description: "Our intelligent system matches candidates with opportunities and conducts skill assessments.",
      icon: Zap,
      color: "purple"
    },
    {
      step: "03",
      title: "Interview & Selection",
      description: "Streamlined interview process with AI-powered scheduling and evaluation tools.",
      icon: Users,
      color: "green"
    },
    {
      step: "04",
      title: "Onboarding & Growth",
      description: "Complete HRMS integration for seamless onboarding and career development tracking.",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  const whoWeServe = [
    {
      title: "Students & Job Seekers",
      description: "Launch your career by building a verified profile, taking AI tests, and applying to top jobs",
      icon: GraduationCap,
      stats: "12,000+ Students",
      benefits: ["AI-powered resume builder", "Skill assessments", "Job matching", "Career guidance"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Colleges & Universities",
      description: "Simplify placement drives, track student progress, and manage campus hiring",
      icon: Building,
      stats: "150+ Campuses",
      benefits: ["Placement management", "Student tracking", "Company partnerships", "Analytics dashboard"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Corporates & Recruiters",
      description: "Post jobs, shortlist via AI, and manage end-to-end onboarding from one place",
      icon: Briefcase,
      stats: "2,000+ Recruiters",
      benefits: ["AI-powered screening", "Bulk hiring tools", "HRMS integration", "Analytics & reports"],
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Freelancers & Clients",
      description: "List gigs or find talent, collaborate with milestones, and deliver securely",
      icon: Code,
      stats: "5,000+ Projects",
      benefits: ["Project management", "Secure payments", "Milestone tracking", "Quality assurance"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const impactStats = [
    { 
      number: counters.students.toLocaleString() + "+", 
      label: "Students", 
      sublabel: "onboarded across colleges", 
      icon: GraduationCap,
      color: "blue"
    },
    { 
      number: counters.recruiters.toLocaleString() + "+", 
      label: "Recruiters", 
      sublabel: "using the platform", 
      icon: UserCheck,
      color: "purple"
    },
    { 
      number: counters.assessments.toLocaleString() + "+", 
      label: "Assessments", 
      sublabel: "conducted", 
      icon: CheckCircle,
      color: "green"
    },
    { 
      number: counters.campuses + "+", 
      label: "Campuses", 
      sublabel: "powered by MinuteHire", 
      icon: Building,
      color: "orange"
    },
    { 
      number: counters.projects.toLocaleString() + "+", 
      label: "Freelance Projects", 
      sublabel: "posted", 
      icon: Briefcase,
      color: "red"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      position: "HR Director, TCS",
      company: "TCS",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      quote: "MinuteHire transformed our hiring process. We reduced time-to-hire by 70% and improved candidate quality significantly.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      position: "Placement Officer",
      company: "IIT Delhi",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      quote: "The campus placement management system is exceptional. Our placement success rate increased by 45% this year.",
      rating: 5
    },
    {
      name: "Amit Patel",
      position: "Software Engineer",
      company: "Fresh Graduate",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      quote: "Got my dream job through MinuteHire's AI matching. The process was smooth and the support was incredible.",
      rating: 5
    }
  ];

  const awards = [
    { title: "Best HR Tech Startup 2024", organization: "TechCrunch", icon: Trophy },
    { title: "AI Innovation Award", organization: "NASSCOM", icon: Lightbulb },
    { title: "Top 50 EdTech Companies", organization: "Forbes India", icon: Star },
    { title: "Excellence in Hiring", organization: "HR Leadership Awards", icon: Award }
  ];

  const partners = [
    { name: "Microsoft", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
    { name: "Google Cloud", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
    { name: "AWS", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
    { name: "LinkedIn", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              🚀 Revolutionizing Hiring Since 2020
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in">
              About MinuteHire
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              We're not just transforming hiring—we're reimagining the entire talent ecosystem with AI-powered solutions, 
              fairness at our core, and a commitment to connecting the right people with the right opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth/jobseeker">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-4 rounded-xl group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-10 py-4 rounded-xl group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-16">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color === 'blue' ? 'from-blue-500 to-blue-600' : 
                    stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    stat.color === 'green' ? 'from-green-500 to-green-600' :
                    stat.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    'from-red-500 to-red-600'} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              ⚡ Simple Process
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">How MinuteHire Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From signup to success in just four simple steps. Our AI-powered platform makes hiring and job searching effortless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative group">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 z-0"></div>
                )}
                <Card className="relative z-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${
                      step.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      step.color === 'purple' ? 'from-purple-500 to-purple-600' :
                      step.color === 'green' ? 'from-green-500 to-green-600' :
                      'from-orange-500 to-orange-600'
                    } rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-400 mb-2">{step.step}</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To transform the hiring landscape by providing intelligent, efficient, and fair recruitment solutions 
                that connect the right talent with the right opportunities. We believe in creating a world where every 
                job seeker finds their dream career and every employer builds their ideal team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Shield, text: "Fair & Unbiased" },
                  { icon: Zap, text: "Lightning Fast" },
                  { icon: Heart, text: "Human-Centered" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <item.icon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Future of work"
                className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To become the global leader in intelligent hiring solutions, creating a future where talent discovery 
                is instantaneous, fair, and mutually beneficial. We envision a world where geographic boundaries don't 
                limit opportunities and where skills are the only currency that matters.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Globe, text: "Global Reach" },
                  { icon: Rocket, text: "Innovation First" },
                  { icon: Users, text: "Community Driven" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <item.icon className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Who We Serve Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              🎯 Our Audience
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering every stakeholder in the hiring and career ecosystem with tailored solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whoWeServe.map((item, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4 flex-grow">{item.description}</p>
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-sm font-semibold">
                      {item.stats}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {item.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              🛠️ Our Solutions
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Services We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions covering every aspect of talent acquisition and management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 flex-grow">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
              💬 Success Stories
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who transformed their careers and businesses with MinuteHire
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-blue-300 mb-4" />
                  <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.position}</div>
                      <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
              🏆 Recognition
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Awards & Achievements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognized by industry leaders for innovation and excellence in HR technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                    <award.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-gray-600 text-sm">{award.organization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Integrations */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white">
              🤝 Partners
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Technology Partners</h2>
            <p className="text-xl text-gray-600">
              Powered by industry-leading technology partners
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {partner.name}
                  </div>
                  <img 
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            💼 Join Our Team
          </Badge>
          <h2 className="text-5xl font-bold mb-6 text-gray-900">Career at MinuteHire</h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of the team that's revolutionizing the future of work. We're always looking for passionate individuals 
            who want to make a difference in the world of hiring and human resources.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Coffee, title: "Work-Life Balance", desc: "Flexible hours and remote work options" },
              { icon: TrendingUp, title: "Growth Opportunities", desc: "Continuous learning and career advancement" },
              { icon: Users, title: "Amazing Team", desc: "Collaborate with talented, passionate people" }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
          
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-10 py-4 rounded-xl">
            <MapPin className="mr-2 h-5 w-5" />
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16 px-8 text-center rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Future?</h2>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Whether you're a student, recruiter, freelancer, or college — MinuteHire is your intelligent hiring companion. 
                Join thousands who've already transformed their careers and businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 rounded-xl font-semibold shadow-lg">
                    <Star className="mr-2 h-5 w-5" />
                    Explore Plans
                  </Button>
                </Link>
                <Link to="/auth/jobseeker">
                  <Button size="lg" className="bg-black/20 border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4 rounded-xl font-semibold backdrop-blur-sm">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-blue-200">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-blue-200">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">30 Day</div>
                  <div className="text-blue-200">Free Trial</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">No</div>
                  <div className="text-blue-200">Setup Fee</div>
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
