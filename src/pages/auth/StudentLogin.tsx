
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('type', 'student');
    navigate(`/auth/student?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default StudentLogin;
