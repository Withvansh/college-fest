
import { supabase } from "@/integrations/supabase/client";

export interface RecruiterDashboard {
  id: string;
  user_id: string;
  dashboard_name: string;
  stats: {
    activeJobs: number;
    applications: number;
    testsCreated: number;
    interviewsScheduled: number;
  };
  mockData: {
    jobPosts: Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      postedDate: string;
      applicants: number;
      status: string;
    }>;
    applicants: Array<{
      id: string;
      name: string;
      email: string;
      position: string;
      appliedDate: string;
      status: string;
      testScore?: number;
    }>;
    testResults: Array<{
      id: string;
      candidateName: string;
      testName: string;
      score: number;
      completedAt: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}

const generateMockData = (recruiterName: string) => ({
  jobPosts: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: `${recruiterName}'s Company`,
      location: 'Remote',
      postedDate: '2024-01-15',
      applicants: 12,
      status: 'Active'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: `${recruiterName}'s Company`,
      location: 'New York, NY',
      postedDate: '2024-01-10',
      applicants: 8,
      status: 'Active'
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      company: `${recruiterName}'s Company`,
      location: 'San Francisco, CA',
      postedDate: '2024-01-05',
      applicants: 15,
      status: 'Closed'
    }
  ],
  applicants: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      position: 'Senior Software Engineer',
      appliedDate: '2024-01-16',
      status: 'Under Review',
      testScore: 85
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      position: 'Product Manager',
      appliedDate: '2024-01-14',
      status: 'Interview Scheduled'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      position: 'UI/UX Designer',
      appliedDate: '2024-01-12',
      status: 'Shortlisted',
      testScore: 92
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      position: 'Senior Software Engineer',
      appliedDate: '2024-01-18',
      status: 'Applied'
    },
    {
      id: '5',
      name: 'Alex Rodriguez',
      email: 'alex.r@email.com',
      position: 'Product Manager',
      appliedDate: '2024-01-20',
      status: 'Under Review',
      testScore: 78
    }
  ],
  testResults: [
    {
      id: '1',
      candidateName: 'John Smith',
      testName: 'Technical Assessment',
      score: 85,
      completedAt: '2024-01-17'
    },
    {
      id: '2',
      candidateName: 'Mike Chen',
      testName: 'Design Challenge',
      score: 92,
      completedAt: '2024-01-13'
    },
    {
      id: '3',
      candidateName: 'Alex Rodriguez',
      testName: 'Product Strategy Test',
      score: 78,
      completedAt: '2024-01-21'
    }
  ]
});

export const recruiterDashboardsService = {
  async getRecruiterDashboard(userId: string): Promise<RecruiterDashboard | null> {
    try {
      console.log('🔍 Fetching recruiter dashboard for user:', userId);
      
      // Check current auth status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📝 Current session:', session ? 'Active' : 'None');
      
      if (!session) {
        console.log('❌ No active session found');
        return null;
      }

      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'recruiter')
        .maybeSingle();

      console.log('📊 Supabase query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching recruiter dashboard:', error);
        return null;
      }

      if (!data) {
        console.log('📭 No dashboard found for user:', userId);
        return null;
      }

      console.log('✅ Dashboard found:', data);
      
      // Get user profile for name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.log('⚠️ Profile fetch error (non-critical):', profileError);
      }

      const recruiterName = profile?.full_name || 'Recruiter';
      console.log('👤 Recruiter name:', recruiterName);

      const dashboard: RecruiterDashboard = {
        id: data.id,
        user_id: data.user_id,
        dashboard_name: data.name || `${recruiterName}'s Dashboard`,
        stats: {
          activeJobs: Math.floor(Math.random() * 10) + 5,
          applications: Math.floor(Math.random() * 50) + 25,
          testsCreated: Math.floor(Math.random() * 5) + 2,
          interviewsScheduled: Math.floor(Math.random() * 15) + 8
        },
        mockData: generateMockData(recruiterName),
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      console.log('🚀 Final dashboard object:', dashboard);
      return dashboard;
    } catch (error) {
      console.error('💥 Exception in getRecruiterDashboard:', error);
      return null;
    }
  },

  async createRecruiterDashboard(userId: string, recruiterName: string): Promise<RecruiterDashboard | null> {
    try {
      console.log('🔨 Creating recruiter dashboard for user:', userId, 'name:', recruiterName);
      
      // Check current auth status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📝 Current session for creation:', session ? 'Active' : 'None');
      
      if (!session) {
        console.log('❌ No active session for dashboard creation');
        return null;
      }

      // First, ensure user has a profile entry
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('👤 Profile check result:', { profile, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Profile fetch error:', profileError);
      }

      if (!profile) {
        console.log('👤 Creating profile for user:', userId);
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: recruiterName,
            role: 'recruiter',
            email: session.user.email || '',
            profile_complete: false
          });
        
        if (createProfileError) {
          console.error('❌ Error creating profile:', createProfileError);
        } else {
          console.log('✅ Profile created successfully');
        }
      }
      
      const dashboardData = {
        user_id: userId,
        role: 'recruiter',
        name: `${recruiterName}'s Dashboard`,
        welcome_message: `Welcome to your recruiter dashboard, ${recruiterName}! Start posting jobs and finding top talent.`,
        onboarding_completed: false,
        preferences: {
          mockDataGenerated: true,
          dashboardType: 'recruiter'
        }
      };

      console.log('📝 Creating dashboard with data:', dashboardData);

      const { data, error } = await supabase
        .from('dashboards')
        .insert(dashboardData)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error creating recruiter dashboard:', error);
        return null;
      }

      if (!data) {
        console.error('❌ No data returned after dashboard creation');
        return null;
      }

      console.log('✅ Dashboard created successfully:', data);

      const dashboard: RecruiterDashboard = {
        id: data.id,
        user_id: data.user_id,
        dashboard_name: data.name,
        stats: {
          activeJobs: 3,
          applications: 35,
          testsCreated: 3,
          interviewsScheduled: 12
        },
        mockData: generateMockData(recruiterName),
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      console.log('🚀 Final created dashboard:', dashboard);
      return dashboard;
    } catch (error) {
      console.error('💥 Exception creating recruiter dashboard:', error);
      return null;
    }
  },

  async getOrCreateRecruiterDashboard(userId: string, recruiterName: string): Promise<RecruiterDashboard | null> {
    try {
      console.log('🔄 Getting or creating recruiter dashboard for user:', userId);
      
      // First try to get existing dashboard
      let dashboard = await this.getRecruiterDashboard(userId);
      
      if (dashboard) {
        console.log('✅ Found existing dashboard:', dashboard.id);
        return dashboard;
      }
      
      // If no dashboard exists, create one
      console.log('🔨 No dashboard found, creating new one...');
      dashboard = await this.createRecruiterDashboard(userId, recruiterName);
      
      if (dashboard) {
        console.log('✅ Successfully created new dashboard:', dashboard.id);
        return dashboard;
      }
      
      console.error('❌ Failed to create dashboard');
      return null;
    } catch (error) {
      console.error('💥 Exception in getOrCreateRecruiterDashboard:', error);
      return null;
    }
  },

  getDashboardUrl(dashboardId: string): string {
    return `/recruiter/dashboard/${dashboardId}`;
  }
};
