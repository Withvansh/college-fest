# Enhanced Auth Storage System

This document explains how to use the enhanced authentication storage system that automatically stores and retrieves user token, role, and ID from localStorage.

## 🎯 Features

- **Automatic Storage**: Token, user role, and user ID are automatically stored in localStorage
- **Multiple Access Methods**: Access auth data through hooks, service, or direct storage utilities
- **Type Safety**: Full TypeScript support with proper typing
- **Error Handling**: Robust error handling and session recovery
- **Utility Functions**: Helper functions for common auth operations

## 📦 Storage Keys

The system uses the following localStorage keys:

```typescript
'auth_session'    // Complete user object
'auth_token'      // Authentication token
'user_role'       // User role (jobseeker, recruiter, etc.)
'user_id'         // Unique user identifier
'auth_user'       // Backup user object
```

## 🚀 Usage Methods

### Method 1: Using Auth Hook (Recommended)

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { 
    user,              // Complete user object
    getToken,          // Function to get token
    getUserRole,       // Function to get role
    getUserId,         // Function to get user ID
    isAuthenticated    // Boolean authentication status
  } = useAuth();

  const handleApiCall = () => {
    const token = getToken();
    const role = getUserRole();
    const userId = getUserId();
    
    console.log({ token, role, userId });
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user?.full_name}! Your role is {getUserRole()}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

### Method 2: Using Auth Service Directly

```typescript
import { unifiedAuthService } from '@/services/unifiedAuth';

// Get current values
const token = unifiedAuthService.getToken();
const role = unifiedAuthService.getUserRole();
const userId = unifiedAuthService.getUserId();
const user = unifiedAuthService.getCurrentUser();
const isAuth = unifiedAuthService.isUserAuthenticated();

// Update user data
unifiedAuthService.updateUserData({ 
  profile_complete: true 
});
```

### Method 3: Using Storage Utilities Directly

```typescript
import { 
  getToken, 
  getUserRole, 
  getUserId, 
  getUser, 
  isAuthenticated,
  updateUserData 
} from '@/lib/utils/storage';

// Perfect for non-React contexts, utility functions, etc.
const token = getToken();
const role = getUserRole();
const userId = getUserId();
const user = getUser();
const auth = isAuthenticated();

// Update user data
updateUserData({ profile_complete: true });
```

## 🔐 Making Authenticated API Calls

```typescript
import { makeAuthenticatedRequest, makeAuthenticatedApiCall } from '@/lib/utils/authApi';

// Method 1: Custom request
const response = await makeAuthenticatedRequest('/api/user/profile', {
  method: 'PUT',
  body: JSON.stringify(data)
});

// Method 2: Simplified API call
const userData = await makeAuthenticatedApiCall('/api/user/profile', 'GET');
const updatedUser = await makeAuthenticatedApiCall('/api/user/profile', 'PUT', updateData);
```

## 🛡️ Role-Based Access Control

```typescript
import { 
  checkUserRole, 
  checkUserRoleExact, 
  isAdmin, 
  isRecruiter, 
  isJobseeker 
} from '@/lib/utils/authHelpers';

// Check multiple roles
if (checkUserRole(['recruiter', 'hr_admin'])) {
  // User has recruiter OR hr_admin role
}

// Check exact role
if (checkUserRoleExact('recruiter')) {
  // User has exactly recruiter role
}

// Convenience functions
if (isAdmin()) {
  // User is admin, hr_admin, or super_admin
}

if (isRecruiter()) {
  // User is recruiter
}
```

## 🔄 Session Management

```typescript
import { useAuth } from '@/hooks/useAuth';
import { handleLogout } from '@/lib/utils/authHelpers';

const MyComponent = () => {
  const { logout } = useAuth();

  const handleUserLogout = () => {
    // Method 1: Using auth hook (recommended)
    logout();

    // Method 2: Using utility function
    handleLogout();
  };
};
```

## 📱 Component Examples

### Protected Route Component

```typescript
import { useAuth } from '@/hooks/useAuth';
import { checkUserRole } from '@/lib/utils/authHelpers';

const ProtectedComponent = () => {
  const { isAuthenticated, getUserRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  if (!checkUserRole(['recruiter', 'admin'])) {
    return <div>Access denied</div>;
  }

  return <div>Protected content for {getUserRole()}</div>;
};
```

### API Data Fetcher

```typescript
import { useEffect, useState } from 'react';
import { makeAuthenticatedApiCall } from '@/lib/utils/authApi';

const DataComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await makeAuthenticatedApiCall('/api/user/data');
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
};
```

## 🐛 Debugging

Use the `AuthStorageDemo` component to debug auth storage:

```typescript
import AuthStorageDemo from '@/components/auth/AuthStorageDemo';

// Add this component to any page to see current auth state
<AuthStorageDemo />
```

## 📝 Notes

- **Automatic Storage**: All data is automatically stored when you log in
- **Persistence**: Data persists across browser sessions
- **Security**: Tokens are stored securely in localStorage
- **Cleanup**: All data is properly cleared on logout
- **Backward Compatibility**: Works with existing auth system

## 🔧 Troubleshooting

### Storage not working?
1. Check browser console for errors
2. Verify localStorage is enabled
3. Use `AuthStorageDemo` component to debug

### Token not found?
1. Ensure user is properly logged in
2. Check if session was cleared
3. Use `isAuthenticated()` to verify state

### Role checks failing?
1. Verify user has completed login
2. Check role spelling and casing
3. Use `getUserRole()` to see current role
