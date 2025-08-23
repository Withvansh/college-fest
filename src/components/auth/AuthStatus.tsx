// Authentication status component for testing and debugging
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, LogOut, Shield } from 'lucide-react';

const AuthStatus = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
            <div className="text-xs text-gray-500">ID: {user._id}</div>
            <div className="text-xs text-gray-500">Token: {user.token.substring(0, 20)}...</div>
            <Button onClick={logout} variant="outline" size="sm" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Not authenticated</p>
            <Badge variant="outline">Guest</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthStatus;
