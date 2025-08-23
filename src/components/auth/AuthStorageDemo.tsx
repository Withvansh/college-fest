import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Key, Shield, Database } from 'lucide-react';

const AuthStorageDemo = () => {
  const { user, getToken, getUserRole, getUserId, isAuthenticated } = useAuth();

  const refreshStorageInfo = () => {
    // Force a re-render to show current storage state
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Auth Storage Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please log in to see storage information</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Auth Storage Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">User ID:</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {getUserId() || 'Not available'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">User Role:</span>
            </div>
            <Badge variant="secondary">{getUserRole() || 'Not available'}</Badge>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="font-medium">Auth Token:</span>
            </div>
            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
              {getToken() ? `${getToken()?.substring(0, 20)}...` : 'Not available'}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Full User Object:</span>
            </div>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={refreshStorageInfo} variant="outline" size="sm">
            Refresh Storage Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthStorageDemo;
