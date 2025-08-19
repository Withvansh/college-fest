
import { Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import LocalAuthForm from '@/components/auth/LocalAuthForm';

const JobSeekerLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <LocalAuthForm
          userType="jobseeker"
          title="Job Seeker Portal"
          description="Find your dream job today"
          icon={<User className="h-8 w-8 text-blue-600" />}
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Looking to hire?{' '}
            <Link to="/auth/recruiter" className="text-blue-600 hover:text-blue-700 font-medium">
              Recruiter Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Need freelancers?{' '}
            <Link to="/client-login" className="text-blue-600 hover:text-blue-700 font-medium">
              Client Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerLogin;
