
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CollegeLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('type', 'college');
    navigate(`/auth/college?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
    </div>
  );
};

export default CollegeLogin;
