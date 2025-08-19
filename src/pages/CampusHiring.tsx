
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Target
} from 'lucide-react';

const CampusHiring = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Student Portal",
      description: "Access campus drives, apply to opportunities, and track your placement journey",
      link: "/student-login",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Building2 className="h-8 w-8 text-orange-600" />,
      title: "College Dashboard",
      description: "Manage students, coordinate with companies, and track placement statistics",
      link: "/college-login",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      title: "Book Campus Drive",
      description: "Companies can schedule recruitment drives and connect with top talent",
      link: "/book-campus-drive",
      color: "from-green-500 to-green-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Partner Colleges", icon: <GraduationCap className="h-5 w-5" /> },
    { number: "50,000+", label: "Students Placed", icon: <Users className="h-5 w-5" /> },
    { number: "1,200+", label: "Companies", icon: <Building2 className="h-5 w-5" /> },
    { number: "85%", label: "Placement Rate", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Campus Hiring Platform
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connecting talented students with leading companies through seamless campus recruitment drives. 
            Empowering colleges, students, and recruiters with cutting-edge placement solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-5 w-5 mr-2" />
              Student Portal
            </Button>
            <Button size="lg" variant="outline">
              <Building2 className="h-5 w-5 mr-2" />
              College Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.link}>
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-12">How Campus Hiring Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Setup & Registration</h3>
              <p className="text-gray-600">Colleges register their programs, students create profiles, and companies join our network.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Schedule Drives</h3>
              <p className="text-gray-600">Companies book campus drives, set requirements, and coordinate with college placement cells.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Connect & Hire</h3>
              <p className="text-gray-600">Students apply, take assessments, attend interviews, and get placed in their dream companies.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">For Students & Colleges</h3>
            <div className="space-y-4">
              {[
                "Access to top companies and startups",
                "Streamlined application process",
                "Real-time placement tracking",
                "Skill assessment and feedback",
                "Career guidance and mentorship"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">For Companies</h3>
            <div className="space-y-4">
              {[
                "Access to pre-screened talent pool",
                "Efficient campus recruitment process",
                "Advanced candidate filtering",
                "Analytics and hiring insights",
                "Brand visibility among students"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Star className="h-5 w-5 text-blue-500 mr-3" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusHiring;
