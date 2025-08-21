
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ClientLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Redirect to unified auth with client type pre-selected
    const params = new URLSearchParams(searchParams);
    params.set('type', 'client');
    navigate(`/auth/client?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default ClientLogin;
