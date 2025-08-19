
// Local authentication service with hardcoded demo credentials
export interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'jobseeker' | 'recruiter' | 'freelancer' | 'client' | 'student' | 'college' | 'admin';
  redirect: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-candidate-1',
    email: 'demo.candidate@minutehire.com',
    password: '#Candidate123',
    name: 'Demo Candidate',
    role: 'jobseeker',
    redirect: '/jobseeker/dashboard'
  },
  {
    id: 'demo-hr-1',
    email: 'demo.hr@minutehire.com',
    password: '#HRaccess123',
    name: 'Demo HR Manager',
    role: 'recruiter',
    redirect: '/recruiter/dashboard'
  },
  {
    id: 'demo-freelancer-1',
    email: 'demo.freelancer@minutehire.com',
    password: '#Freelance123',
    name: 'Demo Freelancer',
    role: 'freelancer',
    redirect: '/freelancer/dashboard'
  },
  {
    id: 'demo-client-1',
    email: 'demo.client@minutehire.com',
    password: '#Client123',
    name: 'Demo Client',
    role: 'client',
    redirect: '/client/dashboard'
  },
  {
    id: 'demo-student-1',
    email: 'demo.student@minutehire.com',
    password: '#Student123',
    name: 'Demo Student',
    role: 'student',
    redirect: '/student/dashboard'
  },
  {
    id: 'demo-college-1',
    email: 'demo.college@minutehire.com',
    password: '#College123',
    name: 'Demo College Admin',
    role: 'college',
    redirect: '/college/dashboard'
  },
  {
    id: 'demo-admin-1',
    email: 'demo.admin@minutehire.com',
    password: '#Admin123',
    name: 'Demo Super Admin',
    role: 'admin',
    redirect: '/admin/dashboard'
  }
];

export class LocalAuthService {
  private static readonly STORAGE_KEY = 'demo_auth_user';

  static login(email: string, password: string): Promise<{ success: boolean; user?: DemoUser; error?: string }> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Store user in localStorage
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
          resolve({ success: true, user });
        } else {
          resolve({ success: false, error: 'Invalid email or password' });
        }
      }, 500);
    });
  }

  static getCurrentUser(): DemoUser | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
