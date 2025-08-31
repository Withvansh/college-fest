import React, { useState } from 'react';
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
import { Check, Star, Users, GraduationCap, Building2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PremiumSubscriptionModal } from '@/components/PremiumSubscriptionModal';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import Footer from '@/components/Footer';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

  const individualPlans = [
    {
      name: 'Starter',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'Job Seekers',
      icon: <Star className="h-6 w-6" />,
      popular: false,
      features: ['Create profile', 'Apply to jobs', 'Take free tests', 'Basic dashboard'],
      cta: 'Get Started',
      ctaLink: '/auth/jobseeker',
    },
    {
      name: 'Pro',
      price: '₹99',
      yearlyPrice: '₹999',
      category: 'Job Seekers',
      icon: <Star className="h-6 w-6" />,
      popular: true,
      features: [
        'Unlimited test attempts',
        'Resume boost tools',
        'Interview tracker',
        'Access to premium jobs',
      ],
      cta: 'Get Started',
      ctaLink: '/auth/jobseeker',
    },
    {
      name: 'Elite',
      price: '₹299',
      yearlyPrice: '₹2,999',
      category: 'Job Seekers',
      icon: <Star className="h-6 w-6" />,
      popular: false,
      features: ['AI Resume feedback', '1-on-1 career coaching', 'Premium onboarding toolkit'],
      cta: 'Get Started',
      ctaLink: '/auth/jobseeker',
    },
    {
      name: 'Freelancer Basic',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'Freelancers',
      icon: <Briefcase className="h-6 w-6" />,
      popular: false,
      features: ['Create profile', 'Apply to gigs', 'Limited milestones'],
      cta: 'Get Started',
      ctaLink: '/freelancer-login',
    },
    {
      name: 'Freelancer Pro',
      price: '₹199',
      yearlyPrice: '₹1,999',
      category: 'Freelancers',
      icon: <Briefcase className="h-6 w-6" />,
      popular: false,
      features: ['Unlimited gigs', 'Project delivery tracker', 'Priority listing'],
      cta: 'Get Started',
      ctaLink: '/freelancer-login',
    },
    {
      name: 'Client Plan',
      price: '₹499',
      yearlyPrice: '₹4,999',
      category: 'Clients',
      icon: <Users className="h-6 w-6" />,
      popular: false,
      features: ['Post projects', 'Access to verified freelancers', 'Secure chat'],
      cta: 'Get Started',
      ctaLink: '/client-login',
    },
  ];

  const businessPlans = [
    {
      name: 'Basic',
      price: 'Free',
      yearlyPrice: 'Free',
      category: 'Colleges',
      icon: <GraduationCap className="h-6 w-6" />,
      popular: false,
      features: ['Register college', 'Add students', 'Basic placement dashboard'],
      cta: 'Get Started',
      ctaLink: '/college-login',
    },
    {
      name: 'Campus+',
      price: '₹1,999',
      yearlyPrice: '₹19,999',
      category: 'Colleges',
      icon: <GraduationCap className="h-6 w-6" />,
      popular: true,
      features: ['Placement drives', 'Resume validation', 'Test management', 'College insights'],
      cta: 'Get Started',
      ctaLink: '/college-login',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      yearlyPrice: 'Custom',
      category: 'Colleges',
      icon: <GraduationCap className="h-6 w-6" />,
      popular: false,
      features: ['Branded portals', 'Dedicated support', 'Advanced reporting'],
      cta: 'Talk to Sales',
      ctaLink: '#contact',
    },
    {
      name: 'Startup',
      price: '₹999',
      yearlyPrice: '₹9,999',
      category: 'Corporate',
      icon: <Building2 className="h-6 w-6" />,
      popular: false,
      features: ['Post up to 10 jobs', 'Use pre-built tests', 'Basic analytics'],
      cta: 'Get Started',
      ctaLink: '/auth/recruiter',
    },
    {
      name: 'Growth',
      price: '₹2,499',
      yearlyPrice: '₹24,999',
      category: 'Corporate',
      icon: <Building2 className="h-6 w-6" />,
      popular: true,
      features: ['Unlimited job posts', 'Custom assessments', 'Interview scheduling'],
      cta: 'Get Started',
      ctaLink: '/auth/recruiter',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      yearlyPrice: 'Custom',
      category: 'Corporate',
      icon: <Building2 className="h-6 w-6" />,
      popular: false,
      features: ['Full HRMS suite', 'ATS integration', 'Dedicated HR dashboard'],
      cta: 'Talk to Sales',
      ctaLink: '#contact',
    },
  ];

  const addOns = [
    {
      name: 'AI-Powered Interview Prep',
      price: '₹149/month',
      description: 'Get personalized interview coaching with AI',
    },
    {
      name: 'Dedicated Account Manager',
      price: '₹999/month',
      description: 'Personal support for your hiring needs',
    },
    {
      name: 'Resume Branding Pack',
      price: '₹499 one-time',
      description: 'Professional resume templates and branding',
    },
  ];

  const comparisonFeatures = [
    {
      name: 'Create Profile',
      free: true,
      pro: true,
      campus: true,
      corporate: true,
      freelancer: true,
    },
    {
      name: 'Job/Gig Applications',
      free: 'Limited',
      pro: 'Unlimited',
      campus: '–',
      corporate: '–',
      freelancer: 'Unlimited',
    },
    {
      name: 'AI Tests & Feedback',
      free: false,
      pro: true,
      campus: true,
      corporate: true,
      freelancer: true,
    },
    {
      name: 'Dedicated Support',
      free: false,
      pro: false,
      campus: true,
      corporate: true,
      freelancer: true,
    },
    {
      name: 'Custom Branding',
      free: false,
      pro: false,
      campus: true,
      corporate: true,
      freelancer: false,
    },
    {
      name: 'Analytics Dashboard',
      free: false,
      pro: true,
      campus: true,
      corporate: true,
      freelancer: true,
    },
  ];

  const faqs = [
    {
      question: 'Can I upgrade anytime?',
      answer:
        'Yes, you can upgrade your plan at any time. The changes will be reflected immediately in your account.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required.',
    },
    {
      question: 'Do colleges get onboarding support?',
      answer:
        'Campus+ and Enterprise plans include dedicated onboarding support and training sessions.',
    },
    {
      question: 'How does billing work for teams?',
      answer:
        'Team plans are billed monthly or annually. You can add or remove team members anytime.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, UPI, net banking, and bank transfers for enterprise plans.',
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

  const PricingCard = ({ plan, isPopular = false }) => (
    <Card className={`relative h-full ${isPopular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
          Most Popular
        </Badge>
      )}
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">{plan.icon}</div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{plan.category}</CardDescription>
        <div className="text-3xl font-bold">
          {plan.price === 'Custom' ? 'Custom' : isYearly ? plan.yearlyPrice : plan.price}
          {plan.price !== 'Custom' && plan.price !== 'Free' && (
            <span className="text-sm font-normal text-gray-600">
              /{isYearly ? 'year' : 'month'}
            </span>
          )}
        </div>
        {isYearly && plan.price !== 'Custom' && plan.price !== 'Free' && (
          <div className="text-sm text-green-600">Save 17%</div>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => handleGetStarted(plan)}
          className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-8 animate-fade-in">
            <Star className="w-5 h-5 mr-2 fill-current" />
            💰 Transparent & Flexible Pricing
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Pricing That{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Scales
            </span>
            <br />
            With Your Success
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Whether you're just starting out or scaling rapidly, we have the perfect plan to
            accelerate your hiring journey and career growth.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`font-semibold text-lg ${!isYearly ? 'text-white' : 'text-blue-200'}`}>
              Monthly
            </span>
            <Toggle
              pressed={isYearly}
              onPressedChange={setIsYearly}
              className="data-[state=on]:bg-white/30 bg-white/20 border-0"
            />
            <span className={`font-semibold text-lg ${isYearly ? 'text-white' : 'text-blue-200'}`}>
              Yearly{' '}
              <Badge className="ml-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0">
                Save 17%
              </Badge>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Compare All Plans
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/80 text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-xl backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="individual">Individual Plans</TabsTrigger>
              <TabsTrigger value="business">Business & Campus Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {individualPlans.map((plan, index) => (
                  <PricingCard key={index} plan={plan} isPopular={plan.popular} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businessPlans.map((plan, index) => (
                  <PricingCard key={index} plan={plan} isPopular={plan.popular} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Optional Add-Ons</h2>
            <p className="text-lg text-gray-600">
              Enhance your experience with these premium features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addOns.map((addon, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <CardDescription>{addon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{addon.price}</div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Add to Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare All Plans</h2>
            <p className="text-lg text-gray-600">See what's included in each plan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free User</th>
                  <th className="text-center p-4">Student Pro</th>
                  <th className="text-center p-4">Campus+</th>
                  <th className="text-center p-4">Corporate Growth</th>
                  <th className="text-center p-4">Freelancer Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="text-center p-4">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          '❌'
                        )
                      ) : (
                        feature.free
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          '❌'
                        )
                      ) : (
                        feature.pro
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.campus === 'boolean' ? (
                        feature.campus ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          '❌'
                        )
                      ) : (
                        feature.campus
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.corporate === 'boolean' ? (
                        feature.corporate ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          '❌'
                        )
                      ) : (
                        feature.corporate
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.freelancer === 'boolean' ? (
                        feature.freelancer ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          '❌'
                        )
                      ) : (
                        feature.freelancer
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our pricing</p>
          </div>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to revolutionize your hiring or job search?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies and job seekers who trust MinuteHire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/jobseeker">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started for Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Talk to Sales
            </Button>
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
      {/* <Footer />
      <FloatingActionButtons /> */}
    </div>
  );
};

export default Pricing;
