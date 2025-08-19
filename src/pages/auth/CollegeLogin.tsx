
import { Link } from 'react-router-dom';
import { ArrowLeft, School } from 'lucide-react';
import LocalAuthForm from '@/components/auth/LocalAuthForm';

const CollegeLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <LocalAuthForm
          userType="college"
          title="College Portal"
          description="Manage campus drives and student placements"
          icon={<School className="h-8 w-8 text-emerald-600" />}
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Student?{' '}
            <Link to="/student-login" className="text-blue-600 hover:text-blue-700 font-medium">
              Student Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Recruiter?{' '}
            <Link to="/auth/recruiter" className="text-blue-600 hover:text-blue-700 font-medium">
              Recruiter Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollegeLogin;
