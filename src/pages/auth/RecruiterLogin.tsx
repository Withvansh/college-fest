
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import LocalAuthForm from '@/components/auth/LocalAuthForm';

const RecruiterLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <LocalAuthForm
          userType="recruiter"
          title="Recruiter Portal"
          description="Find top talent for your company"
          icon={<Briefcase className="h-8 w-8 text-green-600" />}
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Looking for jobs?{' '}
            <Link to="/auth/jobseeker" className="text-blue-600 hover:text-blue-700 font-medium">
              Job Seeker Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Campus hiring?{' '}
            <Link to="/college-login" className="text-blue-600 hover:text-blue-700 font-medium">
              College Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;
