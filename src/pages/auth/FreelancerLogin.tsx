
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FreelancerLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('type', 'freelancer');
    navigate(`/auth/freelancer?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default FreelancerLogin;
