// Example: How to use the auth storage utilities in any component

import { useAuth } from '@/hooks/useAuth';
import { unifiedAuthService } from '@/services/unifiedAuth';
import { getToken, getUserRole, getUserId, getUser, isAuthenticated } from '@/lib/utils/storage';

export const AuthStorageExamples = () => {
  const auth = useAuth();

  // Method 1: Using the auth hook (recommended)
  const usingAuthHook = () => {
    const token = auth.getToken();
    const role = auth.getUserRole();
    const userId = auth.getUserId();
    const user = auth.user;
    const authenticated = auth.isAuthenticated;

    console.log('Using auth hook:', { token, role, userId, user, authenticated });
  };

  // Method 2: Using the auth service directly
  const usingAuthService = () => {
    const token = unifiedAuthService.getToken();
    const role = unifiedAuthService.getUserRole();
    const userId = unifiedAuthService.getUserId();
    const user = unifiedAuthService.getCurrentUser();
    const authenticated = unifiedAuthService.isUserAuthenticated();

    console.log('Using auth service:', { token, role, userId, user, authenticated });
  };

  // Method 3: Using storage utilities directly (for non-React contexts)
  const usingStorageDirectly = () => {
    const token = getToken();
    const role = getUserRole();
    const userId = getUserId();
    const user = getUser();
    const authenticated = isAuthenticated();

    console.log('Using storage directly:', { token, role, userId, user, authenticated });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Auth Storage Usage Examples</h2>

      <div className="space-y-2">
        <button onClick={usingAuthHook} className="px-4 py-2 bg-blue-500 text-white rounded">
          Test Auth Hook Method
        </button>

        <button onClick={usingAuthService} className="px-4 py-2 bg-green-500 text-white rounded">
          Test Auth Service Method
        </button>

        <button
          onClick={usingStorageDirectly}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Test Storage Direct Method
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Current Values:</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <strong>Token:</strong> {auth.getToken()?.substring(0, 20)}...
          </li>
          <li>
            <strong>Role:</strong> {auth.getUserRole()}
          </li>
          <li>
            <strong>User ID:</strong> {auth.getUserId()}
          </li>
          <li>
            <strong>Authenticated:</strong> {auth.isAuthenticated ? 'Yes' : 'No'}
          </li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Usage Examples:</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>API Calls:</strong> Import from '@/lib/utils/authApi'
          </p>
          <p>
            <strong>Role Checking:</strong> Import from '@/lib/utils/authHelpers'
          </p>
          <p>
            <strong>Direct Storage:</strong> Import from '@/lib/utils/storage'
          </p>
        </div>
      </div>
    </div>
  );
};
