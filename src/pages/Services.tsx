
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Code, Users, BarChart3, Zap, Globe, Shield, Clock, Target } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive HR and recruitment solutions designed to scale with your business
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Recruitment Workflow Automation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Recruitment Workflow Automation</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Streamline your entire hiring process with intelligent automation that reduces manual work by 90%.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Automated job posting to multiple platforms</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Smart candidate screening and filtering</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Automated interview scheduling</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Real-time status updates and notifications</span>
              </li>
            </ul>
          </div>

          {/* Candidate Testing */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Advanced Candidate Testing</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Comprehensive skill assessments that go beyond traditional interviews to find the perfect fit.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Programming challenges and code reviews</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Personality and cultural fit assessments</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Cognitive ability and aptitude tests</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Multi-language support and localization</span>
              </li>
            </ul>
          </div>

          {/* Onboarding Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Seamless Onboarding Management</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Create memorable first experiences with structured onboarding workflows that ensure success.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Digital document collection and e-signatures</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Automated task assignments and tracking</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Training module integration</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Progress monitoring and feedback loops</span>
              </li>
            </ul>
          </div>

          {/* HR Dashboard Integration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Comprehensive HR Dashboard</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get complete visibility into your workforce with powerful analytics and reporting tools.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Real-time hiring metrics and KPIs</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Employee performance tracking</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Complete HRMS and attendance management</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Custom reports and data exports</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Additional Features */}
        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Choose Our Platform?</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Global Reach</h3>
              <p className="text-gray-600">Multi-language support for international hiring</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level security and data protection</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance and guidance</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Perfect Matches</h3>
              <p className="text-gray-600">AI-powered candidate-job matching</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Transform your hiring process today with our comprehensive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/recruiter">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6 rounded-xl shadow-2xl">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/free-test">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-6 rounded-xl">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
