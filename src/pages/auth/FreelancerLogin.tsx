
import { Link } from 'react-router-dom';
import { ArrowLeft, Code } from 'lucide-react';
import LocalAuthForm from '@/components/auth/LocalAuthForm';

const FreelancerLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <LocalAuthForm
          userType="freelancer"
          title="Freelancer Portal"
          description="Showcase your skills and find projects"
          icon={<Code className="h-8 w-8 text-purple-600" />}
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Need to hire freelancers?{' '}
            <Link to="/client-login" className="text-blue-600 hover:text-blue-700 font-medium">
              Client Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Looking for full-time jobs?{' '}
            <Link to="/auth/jobseeker" className="text-blue-600 hover:text-blue-700 font-medium">
              Job Seeker Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerLogin;
