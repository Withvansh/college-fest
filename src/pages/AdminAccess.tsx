import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Users, ArrowRight } from 'lucide-react';

const AdminAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Link
            to="/"
            className="flex items-center justify-center space-x-3 mb-4 md:mb-6 hover:opacity-80 transition-opacity"
          >
            <img
              src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png"
              alt="MinuteHire Logo"
              className="h-10 md:h-12 w-auto"
            />
            <span className="text-xl md:text-2xl font-bold text-gray-800">MinuteHire</span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4 px-4">
            Access Admin Dashboard
          </h1>
          <p className="text-base md:text-xl text-gray-600 px-4">
            Choose your admin access level to continue
          </p>
        </div>

        {/* Admin Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4">
          {/* Super Admin Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-3 md:pb-4">
              <div className="mx-auto mb-3 md:mb-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
                Super Admin
              </CardTitle>
              <p className="text-gray-600 text-sm md:text-base">
                Full platform control and management
              </p>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                  Manage all users and administrators
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                  Oversee job postings and approvals
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                  Access system analytics and reports
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                  Platform configuration and settings
                </div>
              </div>
              <Link to="/auth" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group text-sm md:text-base py-2 md:py-3">
                  Access Super Admin
                  <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* HR Admin Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-500">
            <CardHeader className="text-center pb-3 md:pb-4">
              <div className="mx-auto mb-3 md:mb-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
                HR Admin
              </CardTitle>
              <p className="text-gray-600 text-sm md:text-base">Recruit and manage employees</p>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                  Post jobs and manage candidates
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                  Conduct interviews and onboarding
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                  Manage employee records and HRMS
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                  Access hiring analytics and reports
                </div>
              </div>
              <Link to="/auth" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 group text-sm md:text-base py-2 md:py-3">
                  Access HR Admin
                  <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6 md:mt-8">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 text-sm md:text-base"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
