
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const JobSeekerLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('type', 'jobseeker');
    navigate(`/auth/jobseeker?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default JobSeekerLogin;
