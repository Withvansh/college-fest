# Unified Authentication System Implementation

## Overview

This implementation creates a centralized, type-safe authentication system for the MinuteHire platform that supports multiple user roles while eliminating code duplication and maintaining consistency across the application.

## Key Features

### 🔐 Centralized Authentication
- **Single Auth Service**: All authentication logic consolidated in `unifiedAuth.ts`
- **Unified Context**: One auth context (`UnifiedAuthContext.tsx`) for all user types
- **Type Safety**: Full TypeScript support with proper role definitions
- **Consistent API**: Same login/signup/demo flows for all roles

### 🎯 Role-Based Routing
- **Automatic Redirects**: Users are redirected to their appropriate dashboard after login
- **Dashboard Mapping**: Centralized dashboard route configuration
- **Protected Routes**: Role-based access control with unified component

### 👥 Multi-Role Support
Currently supports:
- **Job Seekers**: `/jobseeker/dashboard`
- **Recruiters**: `/recruiter/hrms` (default HRMS dashboard)
- **Freelancers**: `/freelancer/dashboard`
- **Clients**: `/client/dashboard`
- **Students**: `/student/dashboard`
- **Colleges**: `/college/dashboard`
- **Admins**: `/admin/dashboard`

### 🎭 Demo Account System
- Built-in demo credentials for each role
- Easy testing and development
- No backend dependency for demo flows

## Architecture

### Files Structure
```
src/
├── services/
│   └── unifiedAuth.ts              # Core auth service
├── contexts/
│   └── UnifiedAuthContext.tsx      # Auth context provider
├── hooks/
│   └── useAuth.ts                  # Auth hook
├── components/
│   └── auth/
│       └── UnifiedProtectedRoute.tsx  # Protected route component
└── pages/
    └── auth/
        └── UnifiedAuth.tsx         # Universal auth form
```

### Core Components

#### 1. Unified Auth Service (`unifiedAuth.ts`)
```typescript
class UnifiedAuthService {
  // API Authentication
  async login(email: string, password: string): Promise<AuthResponse>
  async signup(email: string, password: string, full_name: string, role: UserRole): Promise<AuthResponse>
  
  // Demo Authentication
  async demoLogin(role: UserRole): Promise<AuthResponse>
  
  // Session Management
  saveSession(user: User): void
  loadSession(): User | null
  clearSession(): void
  
  // Utilities
  getDashboardRoute(role: UserRole): string
  getDemoCredentials(role: UserRole): { email: string; password: string }
  isValidRole(role: string): boolean
}
```

#### 2. Unified Auth Context (`UnifiedAuthContext.tsx`)
```typescript
interface AuthContextType {
  // State
  user: User | null
  isAuthenticated: boolean
  loading: boolean

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, full_name: string, role: UserRole) => Promise<boolean>
  demoLogin: (role: UserRole) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>

  // Utilities
  getDashboardRoute: (role?: UserRole) => string
  getDemoCredentials: (role: UserRole) => { email: string; password: string }
  hasRole: (role: UserRole | UserRole[]) => boolean
}
```

#### 3. Protected Route Component (`UnifiedProtectedRoute.tsx`)
```typescript
interface UnifiedProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
  fallbackPath?: string
}
```

## Usage Examples

### Basic Authentication
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { login, signup, demoLogin, isAuthenticated } = useAuth();
  
  // Login
  const handleLogin = async () => {
    const success = await login(email, password);
    // Auto-redirect handled by context
  };
  
  // Signup with role
  const handleSignup = async () => {
    const success = await signup(email, password, fullName, 'jobseeker');
    // Auto-redirect handled by context
  };
  
  // Demo login
  const handleDemo = async () => {
    const success = await demoLogin('recruiter');
    // Auto-redirect handled by context
  };
}
```

### Protected Routes
```typescript
// In App.tsx
<Route path="/jobseeker/dashboard" element={
  <UnifiedProtectedRoute allowedRoles={['jobseeker']}>
    <JobSeekerDashboard />
  </UnifiedProtectedRoute>
} />

<Route path="/recruiter/hrms" element={
  <UnifiedProtectedRoute allowedRoles={['recruiter']}>
    <HRMSLayout />
  </UnifiedProtectedRoute>
} />
```

### Role Checking
```typescript
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, hasRole } = useAuth();
  
  if (hasRole('admin')) {
    // Show admin features
  }
  
  if (hasRole(['recruiter', 'hr_admin'])) {
    // Show HR features
  }
}
```

## Demo Credentials

### Available Demo Accounts
- **Job Seeker**: `demo.candidate@minutehire.com` / `#Candidate123`
- **Recruiter**: `demo.hr@minutehire.com` / `#HRaccess123`
- **Freelancer**: `demo.freelancer@minutehire.com` / `#Freelance123`
- **Client**: `demo.client@minutehire.com` / `#Client123`
- **Student**: `demo.student@minutehire.com` / `#Student123`
- **College**: `demo.college@minutehire.com` / `#College123`

## Session Management

### Storage Strategy
The system uses localStorage with multiple keys for compatibility:
- `auth_user`: Complete user object
- `auth_token`: Authentication token
- `auth_session`: Session metadata
- Legacy keys: `user_role`, `user_id` (for backward compatibility)

### Session Persistence
- Automatic session restoration on app load
- Secure session clearing on logout
- Token-based authentication ready for API integration

## Migration from Legacy System

### Backward Compatibility
The unified system maintains compatibility with existing:
- Local storage keys
- Admin authentication (separate context preserved)
- Existing component interfaces

### Migration Steps
1. ✅ **Replace AuthProvider with UnifiedAuthProvider** in App.tsx
2. ✅ **Update import statements** from `@/contexts/AuthContext` to `@/hooks/useAuth`
3. ✅ **Replace LocalProtectedRoute with UnifiedProtectedRoute**
4. ✅ **Update role prop names** (`requiredRole` → `allowedRoles`)
5. ✅ **Remove duplicate auth contexts** (keep AdminAuthContext for admin routes)

## API Integration

### Backend Endpoints
The system expects these API endpoints:
- `POST /api/user/login` - User authentication
- `POST /api/user/register` - User registration

### Request/Response Format
```typescript
// Login Request
{
  email: string,
  password: string
}

// Login Response
{
  user: {
    id: string,
    email: string,
    full_name: string,
    role: UserRole,
    profile_complete?: boolean,
    dashboardId?: string
  },
  token: string
}
```

## Error Handling

### User-Friendly Messages
- Toast notifications for all auth actions
- Descriptive error messages
- Loading states during authentication

### Error Recovery
- Automatic session cleanup on errors
- Graceful fallbacks for invalid sessions
- Retry mechanisms for network issues

## Security Features

### Session Security
- Automatic token validation
- Secure session storage
- Session timeout handling
- Multi-tab synchronization

### Role-Based Access
- Strict role validation
- Route-level protection
- Component-level role checking
- Automatic redirects for unauthorized access

## Development & Testing

### Demo Mode
- No backend dependency for testing
- Realistic user flows
- All roles supported
- Instant login for development

### Type Safety
- Full TypeScript support
- Compile-time role validation
- IntelliSense support
- Runtime type checking

## Performance Optimizations

### Lazy Loading
- Context initialization on demand
- Async auth state loading
- Optimized re-renders

### Caching
- Session persistence
- Token caching
- User data caching

## Maintenance Benefits

### Single Source of Truth
- One auth service for all logic
- Centralized configuration
- Consistent behavior across components

### Easy Updates
- Single file for auth logic changes
- Centralized dashboard routing
- Simplified testing

### Code Reduction
- Eliminated duplicate auth contexts
- Consolidated protected route logic
- Unified user interface

## Future Enhancements

### Planned Features
- Multi-factor authentication
- Social login integration
- Advanced session management
- Role-based permissions system
- Real-time auth state sync

### Extensibility
- Easy role addition
- Plugin architecture ready
- Custom auth providers support
- Advanced routing features

## Troubleshooting

### Common Issues
1. **Import Errors**: Use `@/hooks/useAuth` instead of context imports
2. **Role Mismatches**: Check `allowedRoles` prop spelling and case
3. **Redirect Loops**: Ensure user has valid role and dashboard route
4. **Session Issues**: Clear localStorage and restart development server

### Debug Tools
- Console logging for auth flows
- Session inspection tools
- Role validation helpers
- Route debugging utilities

This unified authentication system provides a robust, scalable foundation for the MinuteHire platform while maintaining simplicity and developer experience.
