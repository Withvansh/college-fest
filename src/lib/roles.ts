
export type UserRole = 'jobseeker' | 'recruiter' | 'freelancer' | 'client' | 'college' | 'student' | 'startup' | 'admin';

export const rolePermissions = {
  jobseeker: {
    canApplyToJobs: true,
    canViewJobs: true,
    canTakeTests: true,
    canViewProfile: true,
    canEditProfile: true,
  },
  recruiter: {
    canPostJobs: true,
    canViewApplications: true,
    canCreateTests: true,
    canViewCandidates: true,
    canManageHRMS: true,
  },
  freelancer: {
    canViewGigs: true,
    canSubmitProposals: true,
    canManageProjects: true,
    canViewEarnings: true,
  },
  client: {
    canPostGigs: true,
    canHireFreelancers: true,
    canManageProjects: true,
    canMakePayments: true,
  },
  college: {
    canManageStudents: true,
    canScheduleCampusDrives: true,
    canViewReports: true,
    canManagePlacements: true,
  },
  student: {
    canRegisterForDrives: true,
    canTakeTests: true,
    canViewPlacements: true,
    canUploadResume: true,
  },
  startup: {
    canPostJobs: true,
    canViewApplications: true,
    canManageTeam: true,
    canViewAnalytics: true,
    canRaiseInvestment: true,
  },
  admin: {
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSystem: true,
    canAccessAllData: true,
  },
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = rolePermissions[role];
  return permissions ? (permissions as any)[permission] || false : false;
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const routePermissions: Record<string, UserRole[]> = {
    '/jobseeker': ['jobseeker'],
    '/recruiter': ['recruiter'],
    '/freelancer': ['freelancer'],
    '/client': ['client'],
    '/college': ['college'],
    '/student': ['student'],
    '/startup': ['startup'],
    '/admin': ['admin'],
    '/hrms': ['recruiter', 'admin'],
  };

  const allowedRoles = routePermissions[route];
  return allowedRoles ? allowedRoles.includes(role) : false;
}

export function getDefaultRoute(role: UserRole): string {
  const defaultRoutes: Record<UserRole, string> = {
    jobseeker: '/jobseeker/dashboard',
    recruiter: '/recruiter/dashboard',
    freelancer: '/freelancer/dashboard',
    client: '/client/dashboard',
    college: '/college/dashboard',
    student: '/student/dashboard',
    startup: '/startup/dashboard',
    admin: '/admin/dashboard',
  };

  return defaultRoutes[role] || '/';
}
