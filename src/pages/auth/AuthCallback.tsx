import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log('⏳ Waiting for user to load...');
      return;
    }

    if (!user) {
      console.warn('🚫 No user found in context. Redirecting to /auth/recruiter');
      navigate('/auth/recruiter');
      return;
    }

    console.log('✅ Authenticated user:', user);

    if (!user.profile_complete) {
      console.log('🧩 Profile incomplete. Redirecting to /profile-setup');
      navigate('/profile-setup');
      return;
    }

    switch (user.role) {
      case 'recruiter':
        if (user.dashboardId) {
          console.log(`📊 Redirecting recruiter to dashboard: /recruiter/dashboard/${user.dashboardId}`);
          navigate(`/recruiter/dashboard/${user.dashboardId}`);
        } else {
          console.warn('⚠️ Recruiter has no dashboardId. Redirecting to fallback /recruiter/hrms');
          navigate('/recruiter/hrms');
        }
        break;

      case 'jobseeker':
        console.log('🧍 Redirecting jobseeker to dashboard');
        navigate('/jobseeker/dashboard');
        break;

      case 'freelancer':
        console.log('🧑‍💻 Redirecting freelancer to dashboard');
        navigate('/freelancer/dashboard');
        break;

      case 'student':
        console.log('🎓 Redirecting student to dashboard');
        navigate('/student/dashboard');
        break;

      case 'admin':
        console.log('🛠️ Redirecting admin to dashboard');
        navigate('/admin');
        break;

      default:
        console.log('🔁 Redirecting to generic dashboard');
        navigate('/dashboard');
        break;
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center text-sm text-gray-500">
      Loading your workspace...
    </div>
  );
};

export default AuthCallback;


// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
// import { toast } from 'sonner';
// import { dashboardsService } from '@/lib/api/dashboards';

// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const [resolvedRole, setResolvedRole] = useState<string | null>(null);
//   const [searchParams] = useSearchParams();
//   const roleFromQuery = searchParams.get('role');

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       try {
//         console.log('🔄 Processing OAuth callback...');

//         // Wait for Supabase to process the session
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         const { data: { session }, error: sessionError } = await supabase.auth.getSession();
//         if (sessionError) {
//           console.error('❌ Session error:', sessionError);
//           toast.error('Authentication failed: ' + sessionError.message);
//           navigate('/auth/recruiter');
//           return;
//         }

//         const user = session?.user;
//         if (!user) {
//           toast.error('Authentication failed: No active session found.');
//           navigate('/auth/recruiter');
//           return;
//         }

//         console.log('✅ User authenticated:', user.email);

//         // Clean the hash from URL
//         if (window.location.hash.includes('access_token')) {
//           window.history.replaceState(null, '', window.location.pathname);
//         }

//         let { data: profile, error: profileError } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', user.id)
//           .single();

//         let userRole = (roleFromQuery || 'jobseeker') as 'jobseeker' | 'recruiter' | 'freelancer' | 'client' | 'college' | 'student' | 'admin';

//         if (profileError && profileError.code === 'PGRST116') {
//           console.log('🔨 Creating new user profile...');
//           const { data: newProfile, error: insertError } = await supabase
//             .from('profiles')
//             .insert({
//               id: user.id,
//               email: user.email || '',
//               full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || '',
//               role: userRole,
//               avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
//               profile_complete: false
//             })
//             .select()
//             .single();

//           if (insertError) {
//             console.error('❌ Profile creation error:', insertError);
//             toast.error('Failed to create profile.');
//             navigate('/auth/recruiter');
//             return;
//           }

//           profile = newProfile;
//           userRole = newProfile.role;
//         } else if (profile) {
//           userRole = profile.role;
//         }

//         setResolvedRole(userRole);

//         const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

//         // ✅ Recruiter logic
//         if (userRole === 'recruiter') {
//           console.log('🏢 Recruiter role confirmed. Fetching recruiter entry...');

//           const { data: recruiter, error: recruiterError } = await supabase
//             .from('recruiters')
//             .select('id, user_id, email, company_name')
//             .eq('user_id', user.id)
//             .maybeSingle();

//           if (recruiterError) {
//             console.error('❌ Error fetching recruiter:', recruiterError);
//             toast.error('Failed to fetch recruiter profile.');
//             navigate('/auth/recruiter');
//             return;
//           }

//           if (!recruiter) {
//             console.log('➕ Creating recruiter entry...');
//             const { data: newRecruiter, error: insertError } = await supabase
//               .from('recruiters')
//               .insert({
//                 user_id: user.id,
//                 email: user.email || '',
//                 first_name: displayName?.split(' ')[0] || 'Recruiter',
//                 last_name: displayName?.split(' ').slice(1).join(' ') || '',
//                 company_name: `${displayName}'s Company`
//               })
//               .select()
//               .maybeSingle();

//             if (insertError || !newRecruiter) {
//               console.error('❌ Failed to create recruiter entry:', insertError);
//               toast.error('Could not create recruiter account.');
//               navigate('/auth/recruiter');
//               return;
//             }
//           }

//           console.log('📊 Looking for recruiter dashboard...');
//           const { data: dashboard, error: dashboardError } = await supabase
//             .from('dashboards')
//             .select('id')
//             .eq('user_id', user.id)
//             .eq('role', 'recruiter')
//             .maybeSingle();

//           if (dashboardError) {
//             console.error('❌ Dashboard fetch failed:', dashboardError);
//             toast.error('Failed to fetch recruiter dashboard.');
//             navigate('/auth/recruiter');
//             return;
//           }

//           if (dashboard?.id) {
//             toast.success(`Welcome back, ${displayName}!`);
//             console.log('➡️ Redirecting to /recruiter/dashboard/', dashboard.id);
//             navigate(`/recruiter/dashboard/${dashboard.id}`, { replace: true });
//           } else {
//             console.warn('⚠️ No dashboard found, redirecting to HRMS fallback.');
//             navigate('/recruiter/hrms', { replace: true });
//           }

//           return; // Stop further execution
//         }

//         // ✅ Fallback for all other user roles
//         let dashboard = await dashboardsService.getUserDashboard(user.id);
//         if (!dashboard) {
//           console.log('🔨 Creating dashboard for user:', user.id);
//           dashboard = await dashboardsService.createDashboard(
//             user.id,
//             userRole,
//             displayName || ''
//           );
//         }

//         toast.success(`Welcome, ${displayName}!`);
//         const redirectPath = dashboardsService.getRoleBasedRedirect(userRole);
//         console.log(`➡️ Redirecting to: ${redirectPath}`);
//         setTimeout(() => navigate(redirectPath, { replace: true }), 1500);

//       } catch (error) {
//         console.error('💥 Auth callback failed:', error);
//         toast.error('Something went wrong. Please try again.');
//         navigate('/auth/recruiter');
//       }
//     };

//     handleAuthCallback();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Completing authentication...</p>
//         <p className="mt-2 text-sm text-gray-500">
//           {resolvedRole === 'recruiter'
//             ? 'Setting up your recruiter workspace'
//             : resolvedRole
//             ? `Setting up your ${resolvedRole} dashboard`
//             : 'Loading your dashboard...'}
//         </p>
//         <p className="mt-2 text-xs text-gray-400">
//           Preparing your personalized experience...
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthCallback;
