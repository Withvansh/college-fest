
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuperAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useSuperAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to Super Admin Panel",
        });
        navigate('/super-admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center px-4 md:px-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-3 md:mb-4 text-sm md:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <Link to="/" className="flex items-center justify-center space-x-2 md:space-x-3 mb-4 md:mb-6 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png" 
              alt="MinuteHire Logo" 
              className="h-8 md:h-10 w-auto"
            />
            <span className="text-lg md:text-xl font-bold text-gray-800">MinuteHire</span>
          </Link>
          
          <div className="mx-auto mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">Super Admin Login</CardTitle>
          <p className="text-gray-600 text-sm md:text-base">Access MinuteHire Super Admin Panel</p>
        </CardHeader>
        
        <CardContent className="px-4 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm md:text-base">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="h-10 md:h-12 text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="h-10 md:h-12 text-sm md:text-base"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs md:text-sm bg-red-50 p-2 md:p-3 rounded-md">
                <AlertCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-10 md:h-12 bg-red-600 hover:bg-red-700 text-sm md:text-base" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Access Super Admin Panel'}
            </Button>
          </form>

          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg border">
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between items-center">
                <span>Username:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">Adminx</code>
              </div>
              <div className="flex justify-between items-center">
                <span>Password:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">Adminx</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLogin;
