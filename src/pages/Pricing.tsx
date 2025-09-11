import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import {
  Check,
  Star,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  Sparkles,
  Crown,
  Shield,
  Zap,
  Rocket,
  Heart,
  ArrowRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PremiumSubscriptionModal } from '@/components/PremiumSubscriptionModal';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import Footer from '@/components/Footer';

// Custom styles for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(0.5deg); }
    50% { transform: translateY(-10px) rotate(0deg); }
    75% { transform: translateY(-5px) rotate(-0.5deg); }
  }
  
  @keyframes gradient-x {
    0%, 100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  
  .animate-gradient-x {
    animation: gradient-x 3s ease infinite;
    background-size: 200% 200%;
  }
  
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }

  /* Responsive adjustments for small screens */
  @media (max-width: 640px) {
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  }
`;

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [activeTab, setActiveTab] = useState('individual');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const individualPlans = [
    {
      name: 'Free',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'Job Seekers',
      icon: <Heart className="h-6 w-6" />,
      popular: false,
      gradient: 'from-emerald-400 to-teal-500',
      description: 'Perfect for getting started on your career journey',
      features: [
        'Create professional profile',
        'Apply to jobs',
        'Basic skill tests (1/month)',
        'Basic job recommendations',
        'Email support',
      ],
      cta: 'Get Started Free',
      ctaLink: '/auth/jobseeker',
    },
    {
      name: 'Elite',
      price: '₹699',
      yearlyPrice: '₹6,990',
      category: 'Job Seekers',
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      gradient: 'from-blue-500 to-indigo-600',
      description: 'AI-powered career acceleration with coaching',
      features: [
        'Everything in Free',
        'AI Resume Feedback',
        'Unlimited Applications',
        'Career Coaching',
        'Premium Training',
        'Interview Preparation',
        'Unlimited skill tests',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/jobseeker',
    },
    {
      name: 'Basic',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'Freelancers',
      icon: <Briefcase className="h-6 w-6" />,
      popular: false,
      gradient: 'from-orange-400 to-red-500',
      description: 'Explore freelancing opportunities',
      features: [
        'Explore available gigs',
        'Build freelancer profile',
        'Basic project browsing',
        'Contact freelancers',
        'Community access',
      ],
      cta: 'Start Free',
      ctaLink: '/freelancer-login',
    },
    {
      name: 'Pro',
      price: '₹599',
      yearlyPrice: '₹5,990',
      category: 'Freelancers',
      icon: <Rocket className="h-6 w-6" />,
      popular: false,
      gradient: 'from-cyan-400 to-blue-500',
      description: 'Professional freelancing with full features',
      features: [
        'Everything in Basic',
        'Apply to gigs',
        'Unlimited bids',
        'Portfolio hosting',
        'Payment protection',
        'Project management tools',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      ctaLink: '/freelancer-login',
    },
    {
      name: 'Client Free',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'Clients (Hiring Freelancers)',
      icon: <Building2 className="h-6 w-6" />,
      popular: false,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Start hiring freelancers',
      features: [
        'Post projects',
        'Browse freelancers',
        'Basic communication',
        'View portfolios',
        'Community access',
      ],
      cta: 'Start Hiring',
      ctaLink: '/client-login',
    },
    {
      name: 'Client Pro',
      price: '₹599',
      yearlyPrice: '₹5,990',
      category: 'Clients (Hiring Freelancers)',
      icon: <Shield className="h-6 w-6" />,
      popular: false,
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Advanced project management for clients',
      features: [
        'Everything in Free',
        'Project management dashboard',
        'Milestone tracking',
        'Escrow payments',
        'Advanced freelancer search',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      ctaLink: '/client-login',
    },
  ];

  const businessPlans = [
    {
      name: 'HR Free',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'HR / Recruiters',
      icon: <Building2 className="h-6 w-6" />,
      popular: false,
      gradient: 'from-green-400 to-emerald-500',
      description: 'Essential hiring tools for small teams',
      features: [
        'Post jobs',
        'View applicants',
        'Basic candidate management',
        'Email notifications',
        'Basic analytics',
      ],
      cta: 'Start Free',
      ctaLink: '/auth/recruiter',
    },
    {
      name: 'HRMS',
      price: '₹599',
      yearlyPrice: '₹5,990',
      category: 'HR / Recruiters',
      icon: <Shield className="h-6 w-6" />,
      popular: false,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Complete HR management system',
      features: [
        'Everything in Free',
        'Attendance management',
        'Payroll processing',
        'Leave management',
        'Employee database',
        'HR analytics',
        'Document management',
      ],
      cta: 'Get HRMS',
      ctaLink: '/auth/recruiter',
    },
    {
      name: 'AI Screening & Interview',
      price: '₹1,499',
      yearlyPrice: '₹14,990',
      category: 'HR / Recruiters',
      icon: <Sparkles className="h-6 w-6" />,
      popular: true,
      gradient: 'from-purple-500 to-pink-600',
      description: 'AI-powered recruitment automation',
      features: [
        'Everything in HRMS',
        'AI-driven candidate shortlisting',
        'Automated interview scheduling',
        'Video interview platform',
        'AI assessment tools',
        'Candidate scoring',
        'Interview automation',
      ],
      cta: 'Try AI Screening',
      ctaLink: '/auth/recruiter',
    },
    {
      name: 'Complete Package',
      price: '₹1,999',
      yearlyPrice: '₹19,990',
      category: 'HR / Recruiters',
      icon: <Crown className="h-6 w-6" />,
      popular: false,
      gradient: 'from-indigo-600 to-purple-700',
      description: 'All-in-one HR & recruitment solution',
      features: [
        'HRMS + AI Screening',
        'Advanced job posting',
        'Compliance management',
        'Advanced analytics',
        'Custom integrations',
        'Priority support',
        'Training & onboarding',
      ],
      cta: 'Get Complete Package',
      ctaLink: '/auth/recruiter',
    },
    {
      name: 'Campus Basic',
      price: '₹199',
      yearlyPrice: '₹1,990',
      category: 'Campus (Colleges / CRC)',
      icon: <GraduationCap className="h-6 w-6" />,
      popular: false,
      gradient: 'from-emerald-400 to-green-500',
      description: 'Essential placement management for colleges',
      features: [
        'Placement Drive Manager (1 drive/month)',
        'Student dashboard',
        'Basic analytics',
        'Email notifications',
        'Student registration',
      ],
      cta: 'Start Basic',
      ctaLink: '/college-login',
    },
    {
      name: 'Campus Growth',
      price: '₹699',
      yearlyPrice: '₹6,990',
      category: 'Campus (Colleges / CRC)',
      icon: <Rocket className="h-6 w-6" />,
      popular: false,
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Expand placement opportunities',
      features: [
        'Everything in Basic',
        'Multiple placement drives',
        'Recruiter connect',
        'Advanced analytics',
        'Student performance tracking',
        'Company management',
      ],
      cta: 'Upgrade to Growth',
      ctaLink: '/college-login',
    },
    {
      name: 'Campus Elite',
      price: '₹1,499',
      yearlyPrice: '₹14,990',
      category: 'Campus (Colleges / CRC)',
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Complete campus placement automation',
      features: [
        'Everything in Growth',
        'Unlimited placement drives',
        'Automated scheduling',
        'AI skill gap analysis',
        'Recruiter CRM',
        'Custom reporting',
        'Dedicated support',
      ],
      cta: 'Go Elite',
      ctaLink: '/college-login',
    },
  ];

  const comparisonFeatures = [
    {
      category: 'Individual Plans',
      features: [
        {
          name: 'Create Profile',
          free: '✅',
          elite: '✅',
          freelancerPro: '✅',
          clientPro: '✅',
        },
        {
          name: 'Apply to Jobs/Gigs',
          free: '5/month',
          elite: 'Unlimited',
          freelancerPro: 'Unlimited',
          clientPro: 'Unlimited Projects',
        },
        {
          name: 'Resume Builder',
          free: 'Basic',
          elite: 'AI-enhanced',
          freelancerPro: 'Advanced Portfolio',
          clientPro: '—',
        },
        {
          name: 'Skill Tests',
          free: '1/month',
          elite: 'Unlimited + Coaching',
          freelancerPro: 'Verified Skills',
          clientPro: '—',
        },
        {
          name: 'Project Management',
          free: '—',
          elite: '—',
          freelancerPro: 'Basic',
          clientPro: 'Advanced',
        },
        {
          name: 'Payment Protection',
          free: '—',
          elite: '—',
          freelancerPro: '✅',
          clientPro: '✅',
        },
      ],
    },
    {
      category: 'Organization Plans',
      features: [
        {
          name: 'Job Posting',
          hrFree: '✅',
          hrms: '✅',
          aiInterview: '✅',
          complete: '✅',
          campusElite: '✅',
        },
        {
          name: 'HRMS (Payroll, Attendance)',
          hrFree: '—',
          hrms: '✅',
          aiInterview: '✅',
          complete: '✅',
          campusElite: '—',
        },
        {
          name: 'AI Screening & Interview',
          hrFree: '—',
          hrms: '—',
          aiInterview: '✅',
          complete: '✅',
          campusElite: '—',
        },
        {
          name: 'Compliance Kit',
          hrFree: '—',
          hrms: '—',
          aiInterview: '—',
          complete: '✅',
          campusElite: '—',
        },
        {
          name: 'Placement Drive Manager',
          hrFree: '—',
          hrms: '—',
          aiInterview: '—',
          complete: '—',
          campusElite: '✅ (Unlimited)',
        },
        {
          name: 'Recruiter CRM',
          hrFree: '—',
          hrms: '—',
          aiInterview: '—',
          complete: '—',
          campusElite: '✅',
        },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Can I start with a free plan and upgrade later?',
      answer:
        'Yes! You can start free and upgrade anytime without losing data. All your profiles, applications, and progress will be preserved when you upgrade.',
    },
    {
      question: 'Do colleges get onboarding support?',
      answer:
        'Campus Growth and Elite plans include dedicated onboarding support and training sessions. Our team will help you set up placement drives and train your staff.',
    },
    {
      question: 'How does billing work for teams?',
      answer:
        'Team plans are billed monthly or annually. You can add or remove team members anytime, and billing adjustments are made automatically on your next cycle.',
    },
    {
      question: 'Do freelancers/clients get secure payment options?',
      answer:
        'Yes. All Pro freelancer & client plans include escrow-based payment protection to ensure secure transactions and milestone-based payments.',
    },
    {
      question: 'Is billing monthly or yearly?',
      answer:
        'Monthly by default, with discounts available for yearly subscriptions. Annual plans save you up to 16% compared to monthly billing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. Enterprise customers can also pay via bank transfer.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, we use enterprise-grade security with 256-bit SSL encryption, regular security audits, and comply with data protection regulations.',
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        "Yes, you can cancel your subscription anytime. You'll continue to have access until the end of your current billing period, then automatically switch to the free plan.",
    },
  ];

  const handleGetStarted = (plan: any) => {
    if (plan.price === 'Custom' || plan.cta === 'Talk to Sales') {
      // Handle contact sales
      window.location.href = '#contact';
      return;
    }

    if (plan.price === 'Free') {
      // Direct to login/signup
      window.location.href = plan.ctaLink;
      return;
    }

    setSelectedPlan({
      name: plan.name,
      price: isYearly ? plan.yearlyPrice : plan.price,
    });
    setShowSubscriptionModal(true);
  };

  const PricingCard = ({ plan, isPopular = false }) => {
    const isHovered = hoveredCard === plan.name;

    return (
      <Card
        className={`relative flex flex-col h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] transition-all duration-500 group cursor-pointer ${
          isPopular
            ? 'border-2 border-blue-500 shadow-2xl shadow-blue-500/25 scale-[1.02] sm:scale-105 z-10'
            : 'border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl hover:shadow-gray-500/10'
        } ${isHovered ? 'transform -translate-y-1 sm:-translate-y-2' : ''} overflow-hidden bg-white rounded-xl`}
        onMouseEnter={() => setHoveredCard(plan.name)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />

        <CardHeader className="text-center pb-4 sm:pb-6 relative z-10 px-4 sm:px-6 pt-6 sm:pt-8">
          {/* Icon with gradient background */}
          <div
            className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${plan.gradient} text-white mb-3 sm:mb-4 mx-auto shadow-lg`}
          >
            {plan.icon}
          </div>

          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
            {plan.category}
          </CardDescription>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 h-8 sm:h-10 overflow-hidden">
            {plan.description}
          </p>

          {/* Price */}
          <div className="space-y-1 mb-3 sm:mb-4">
            <div className="flex items-baseline justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {plan.price === 'Custom' ? 'Custom' : isYearly ? plan.yearlyPrice : plan.price}
              </span>
              {plan.price !== 'Custom' && plan.price !== 'Free' && (
                <span className="text-xs sm:text-sm text-gray-500 ml-1">
                  /{isYearly ? 'year' : 'month'}
                </span>
              )}
            </div>

            {isYearly && plan.price !== 'Custom' && plan.price !== 'Free' && (
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  Save 17%
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-3 sm:pb-4 relative z-10 flex-1">
          <ul className="space-y-1.5 sm:space-y-2">
            {plan.features.slice(0, 8).map((feature, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs">
                <div
                  className={`flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mt-0.5`}
                >
                  <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                </div>
                <span className="text-gray-700 leading-relaxed">{feature}</span>
              </li>
            ))}
            {plan.features.length > 8 && (
              <li className="text-xs text-gray-500 text-center pt-2">
                +{plan.features.length - 8} more features
              </li>
            )}
          </ul>
        </CardContent>

        <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 mt-auto relative z-10">
          <div className="w-full space-y-2">
            <Button
              onClick={() => handleGetStarted(plan)}
              className={`w-full py-2 sm:py-2.5 font-semibold transition-all duration-300 text-xs sm:text-sm ${
                isPopular
                  ? `bg-gradient-to-r ${plan.gradient} hover:shadow-2xl hover:shadow-blue-500/40 text-white border-0`
                  : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl border-0 hover:scale-105`
              }`}
              size="sm"
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {plan.price !== 'Custom' && plan.price !== 'Free' && (
              <p className="text-xs text-gray-500 text-center">
                14-day free trial • No credit card required
              </p>
            )}
          </div>
        </CardFooter>

        {/* Hover Effect Border */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}
        />
      </Card>
    );
  };

  return (
    <>
      {/* Inject custom styles */}
      <style>{customStyles}</style>

      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" />
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />

        {/* Hero Section */}
        <section className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-12 lg:pb-32 overflow-hidden">
          {/* Parallax Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-4 left-4 sm:top-10 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-blue-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: '0s', animationDuration: '3s' }}
            />
            <div
              className="absolute top-16 right-4 sm:top-32 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-purple-400/20 rounded-full blur-lg animate-bounce"
              style={{ animationDelay: '1s', animationDuration: '4s' }}
            />
            <div
              className="absolute bottom-32 left-8 sm:bottom-40 sm:left-32 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: '2s', animationDuration: '3.5s' }}
            />
            <div
              className="absolute bottom-8 right-4 sm:bottom-20 sm:right-10 w-12 h-12 sm:w-18 sm:h-18 bg-cyan-400/20 rounded-full blur-lg animate-bounce"
              style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              {/* Animated Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-blue-200/50 text-blue-700 text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-2xl backdrop-blur-md hover:scale-105 transition-all duration-500 cursor-pointer group">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
                  Trusted by 50,000+ professionals worldwide
                </span>
                <div className="ml-2 sm:ml-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              {/* Main Headline with Responsive Typography */}
              <div className="mb-8 sm:mb-10 relative">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.9] sm:leading-[0.85] mb-6">
                  <span className="block relative mb-2">
                    <span className="relative z-10">Choose Your</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-lg sm:rounded-2xl blur-xl sm:blur-2xl transform rotate-1 scale-105"></div>
                  </span>
                  <span className="block relative">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x relative z-10">
                      Perfect Plan
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-lg sm:rounded-2xl blur-xl sm:blur-3xl transform -rotate-1 scale-105"></div>
                  </span>
                </h1>

                {/* Floating Achievement Badges - Improved Responsive Positioning */}
                <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 hidden md:block">
                  <div
                    className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-blue-200/50 animate-float "
                    style={{ animationDelay: '0s' }}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2 ">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-900">98% Success Rate</div>
                        <div className="text-xs text-gray-500 hidden sm:block">Career Growth</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 -right-2 sm:top-8 sm:-right-4 lg:-right-6 hidden md:block">
                  <div
                    className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-purple-200/50 animate-float"
                    style={{ animationDelay: '1s' }}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-900">24/7 Support</div>
                        <div className="text-xs text-gray-500 hidden sm:block">Premium Care</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 sm:-bottom-4 hidden lg:block z-20">
                  <div
                    className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-green-200/50 animate-float"
                    style={{ animationDelay: '2s' }}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-900">Instant Setup</div>
                        <div className="text-xs text-gray-500 hidden sm:block">Ready in 2 mins</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="relative mb-8 sm:mb-12">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed font-medium max-w-4xl mx-auto">
                  <p className="mb-3 sm:mb-4">
                    From{' '}
                    <span className="relative inline-block mx-1">
                      <span className="relative z-10 text-emerald-600 font-bold px-2">
                        free starter plans
                      </span>
                      <div className="absolute inset-0 bg-emerald-100 rounded-md transform rotate-1 scale-105"></div>
                    </span>{' '}
                    to{' '}
                    <span className="relative inline-block mx-1">
                      <span className="relative z-10 text-blue-600 font-bold px-2">
                        enterprise solutions
                      </span>
                      <div className="absolute inset-0 bg-blue-100 rounded-md transform -rotate-1 scale-105"></div>
                    </span>
                    , we have the perfect pricing tier to
                  </p>
                  <p>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
                      accelerate your career
                    </span>{' '}
                    or{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
                      transform your hiring process
                    </span>
                  </p>
                </div>

                {/* Statistics Row */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-8 sm:mt-10 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span>50,000+ Active Users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    <span>1M+ Jobs Posted</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                    <span>98% Satisfaction Rate</span>
                  </div>
                </div>
              </div>

              {/* Interactive Billing Toggle */}
              <div className="flex items-center justify-center mb-10 sm:mb-12">
                <div className="relative bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-center space-x-6 sm:space-x-8 lg:space-x-10 px-2 sm:px-4">
                    <div className="text-center min-w-[70px]">
                      <span
                        className={`font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 cursor-pointer block ${
                          !isYearly
                            ? 'text-blue-600 scale-110'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setIsYearly(false)}
                      >
                        Monthly
                      </span>
                      {!isYearly && (
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-1 rounded-full"></div>
                      )}
                    </div>

                    <div className="relative flex items-center">
                      <Toggle
                        pressed={isYearly}
                        onPressedChange={setIsYearly}
                        className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-500 data-[state=on]:to-purple-600 data-[state=off]:bg-gray-200 border-0 w-14 h-7 sm:w-16 sm:h-8 rounded-full shadow-lg transition-all duration-500"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
                          isYearly ? 'shadow-lg shadow-blue-500/30' : 'shadow-md'
                        }`}
                      ></div>
                    </div>

                    <div className="text-center relative min-w-[70px]">
                      <span
                        className={`font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 cursor-pointer block ${
                          isYearly ? 'text-blue-600 scale-110' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setIsYearly(true)}
                      >
                        Yearly
                      </span>
                      {isYearly && (
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-1 rounded-full"></div>
                      )}
                      {isYearly && (
                        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 sm:px-3 py-1 animate-bounce shadow-lg whitespace-nowrap">
                            <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                            Save 17%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-bold rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 border border-white/20"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300">
                      <Rocket className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500"></div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 sm:border-3 border-gray-300 hover:border-blue-400 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-bold rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                    </div>
                    <span>Compare Plans</span>
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-y-1 transition-transform duration-300" />
                  </div>
                </Button>
              </div>

              {/* Social Proof & Trust Indicators */}
              <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12 text-gray-600">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex -space-x-1 sm:-space-x-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="font-bold text-gray-900">Join 50,000+ users</div>
                    <div className="text-gray-500">Growing every day</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-gray-900">Bank-level Security</div>
                      <div className="text-gray-500">Your data is safe</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-gray-900">Instant Access</div>
                      <div className="text-gray-500">Setup in minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="relative z-10 py-16 sm:py-20 bg-white/60 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
              <div className="text-center mb-12 sm:mb-16">
                <TabsList className="grid w-full h-auto max-w-md sm:max-w-lg mx-auto grid-cols-2 mb-8 bg-white shadow-lg border border-gray-200 p-2 rounded-2xl">
                  <TabsTrigger
                    value="individual"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-300 text-xs sm:text-sm"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Individual Plans
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-300 text-xs sm:text-sm"
                  >
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Business & Campus
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="individual" className="space-y-8">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Individual & Freelancer Plans
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Accelerate your career with plans designed for job seekers and freelancers at
                    every stage
                  </p>
                </div>

                {/* Individual Plans Grid */}
                <div className="relative px-2 sm:px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center max-w-7xl mx-auto">
                    {individualPlans.map((plan, index) => (
                      <div key={index} className="w-full max-w-[320px]">
                        <PricingCard plan={plan} isPopular={plan.popular} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-8">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Business & Educational Plans
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Comprehensive solutions for educational institutions and corporate hiring teams
                  </p>
                </div>

                {/* Business Plans Grid */}
                <div className="relative px-2 sm:px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
                    {businessPlans.map((plan, index) => (
                      <div key={index} className="w-full max-w-[320px] lg:max-w-none">
                        <PricingCard plan={plan} isPopular={plan.popular} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="relative z-10 py-20 bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50 text-blue-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <Shield className="w-5 h-5 mr-2" />
                Detailed Comparison
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Compare All Features
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                See exactly what's included in each plan to make the best choice for your needs
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-x-auto">
              <Tabs defaultValue="individuals" className="w-full min-w-[340px]">
                <TabsList className="grid w-full h-auto max-w-xs sm:max-w-md mx-auto grid-cols-2 m-4 sm:m-6 bg-white shadow-lg border border-gray-200 p-1 sm:p-2 rounded-xl sm:rounded-2xl">
                  <TabsTrigger
                    value="individuals"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm"
                  >
                    Individual Plans
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizations"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm"
                  >
                    Organization Plans
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="individuals">
                  {comparisonFeatures
                    .filter(category => category.category === 'Individual Plans')
                    .map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        {/* Category Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-3 sm:px-6 py-3 sm:py-4">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            {category.category}
                          </h3>
                        </div>

                        {/* Header Row */}
                        <div className="grid grid-cols-5 gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-4 bg-gray-50/50 text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-100">
                          <div className="col-span-1">Feature</div>
                          <div className="text-center">Free</div>
                          <div className="text-center">Elite (₹699)</div>
                          <div className="text-center">Freelancer Pro (₹599)</div>
                          <div className="text-center">Client Pro (₹599)</div>
                        </div>

                        {/* Feature Rows */}
                        {category.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="border-b border-gray-50 last:border-b-0"
                          >
                            <div className="grid grid-cols-5 gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-4 hover:bg-blue-50/30 transition-colors duration-200">
                              <div className="col-span-1 font-medium text-gray-900 text-xs sm:text-sm">
                                {feature.name}
                              </div>

                              {[
                                feature.free,
                                feature.elite,
                                feature.freelancerPro,
                                feature.clientPro,
                              ].map((value, valueIndex) => (
                                <div
                                  key={valueIndex}
                                  className="text-center flex items-center justify-center"
                                >
                                  {value === '✅' ? (
                                    <div className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100">
                                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                    </div>
                                  ) : value === '—' ? (
                                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                  ) : (
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                      {value}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="organizations">
                  {comparisonFeatures
                    .filter(category => category.category === 'Organization Plans')
                    .map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        {/* Category Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-3 sm:px-6 py-3 sm:py-4">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            {category.category}
                          </h3>
                        </div>

                        {/* Header Row */}
                        <div className="grid grid-cols-6 gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-4 bg-gray-50/50 text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-100">
                          <div className="col-span-1">Feature</div>
                          <div className="text-center">HR Free</div>
                          <div className="text-center">HRMS (₹599)</div>
                          <div className="text-center">AI + Interview (₹1499)</div>
                          <div className="text-center">Complete (₹1999)</div>
                          <div className="text-center">Campus Elite (₹1499)</div>
                        </div>

                        {/* Feature Rows */}
                        {category.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="border-b border-gray-50 last:border-b-0"
                          >
                            <div className="grid grid-cols-6 gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-4 hover:bg-blue-50/30 transition-colors duration-200">
                              <div className="col-span-1 font-medium text-gray-900 text-xs sm:text-sm">
                                {feature.name}
                              </div>

                              {[
                                feature.hrFree,
                                feature.hrms,
                                feature.aiInterview,
                                feature.complete,
                                feature.campusElite,
                              ].map((value, valueIndex) => (
                                <div
                                  key={valueIndex}
                                  className="text-center flex items-center justify-center"
                                >
                                  {value === '✅' || value?.includes('✅') ? (
                                    <div className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100">
                                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                    </div>
                                  ) : value === '—' ? (
                                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                  ) : (
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                      {value}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50 text-amber-700 text-sm font-semibold mb-6">
                <Sparkles className="w-5 h-5 mr-2" />
                Frequently Asked Questions
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Got Questions? We've Got Answers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about our pricing, features, and policies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                        Q
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                        {faq.question}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pl-11">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our friendly support team is here to help you choose the perfect plan and get
                  started quickly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-6 py-3 font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-8">
              <Crown className="w-5 h-5 mr-2" />
              Join 50,000+ Satisfied Users
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Career Journey?
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals and organizations who've accelerated their success
              with MinuteHire. Start your free trial today - no credit card required!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/auth/jobseeker">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-2xl backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">No setup fees</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Subscription Modal */}
        <PremiumSubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          planName={selectedPlan?.name || ''}
          planPrice={selectedPlan?.price || ''}
        />
      </div>
      <Footer />
      <FloatingActionButtons />
    </>
  );
};

export default Pricing;
