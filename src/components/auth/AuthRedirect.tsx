import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthRedirectProps {
  userType: string;
}

const AuthRedirect = ({ userType }: AuthRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('type', userType);
    navigate(`/auth?${params.toString()}`, { replace: true });
  }, [navigate, location.search, userType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default AuthRedirect;