
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import LocalAuthForm from '@/components/auth/LocalAuthForm';

const StudentLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <LocalAuthForm
          userType="student"
          title="Student Portal"
          description="Access campus drives and internships"
          icon={<GraduationCap className="h-8 w-8 text-indigo-600" />}
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            College administrator?{' '}
            <Link to="/college-login" className="text-blue-600 hover:text-blue-700 font-medium">
              College Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Looking for jobs?{' '}
            <Link to="/auth/jobseeker" className="text-blue-600 hover:text-blue-700 font-medium">
              Job Seeker Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
