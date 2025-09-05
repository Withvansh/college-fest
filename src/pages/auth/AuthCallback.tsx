import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthCallback = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log('⏳ Waiting for user to load...');
      return;
    }

    if (!user) {
      console.warn('🚫 No user found in context. Redirecting to /auth/recruiter');
      navigate('/auth/recruiter');
      return;
    }

    console.log('✅ Authenticated user:', user);

    if (!user.profile_complete) {
      console.log('🧩 Profile incomplete. Redirecting to /profile-setup');
      navigate('/profile-setup');
      return;
    }

    switch (user.role) {
      case 'recruiter':
        if (user.dashboardId) {
          console.log(
            `📊 Redirecting recruiter to dashboard: /recruiter/dashboard/${user.dashboardId}`
          );
          navigate(`/recruiter/dashboard/${user.dashboardId}`);
        } else {
          console.warn('⚠️ Recruiter has no dashboardId. Redirecting to fallback /recruiter/hrms');
          navigate('/recruiter/hrms');
        }
        break;

      case 'jobseeker':
        console.log('🧍 Redirecting jobseeker to dashboard');
        navigate('/jobseeker/dashboard');
        break;

      case 'freelancer':
        console.log('🧑‍💻 Redirecting freelancer to dashboard');
        navigate('/freelancer/dashboard');
        break;

      case 'Student':
        console.log('🎓 Redirecting student to dashboard');
        navigate('/student/dashboard');
        break;

      case 'startup':
        console.log('🚀 Redirecting startup to dashboard');
        navigate('/startup/dashboard');
        break;

      case 'admin':
        console.log('🛠️ Redirecting admin to dashboard');
        navigate('/admin');
        break;

      default:
        console.log('🔁 Redirecting to generic dashboard');
        navigate('/dashboard');
        break;
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center text-sm text-gray-500">
      Loading your workspace...
    </div>
  );
};

export default AuthCallback;
