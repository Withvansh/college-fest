
import { supabase } from '@/integrations/supabase/client';

export interface RecentActivity {
  id: string;
  type: 'job_posted' | 'user_registered' | 'test_completed' | 'application_submitted';
  description: string;
  timestamp: string;
  user?: string;
  metadata?: any;
}

export const adminRecentActivityService = {
  async getRecentActivity(): Promise<RecentActivity[]> {
    const activities: RecentActivity[] = [];

    try {
      // Get recent job posts
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, created_at, recruiter_id')
        .order('created_at', { ascending: false })
        .limit(10);

      if (jobs) {
        jobs.forEach(job => {
          activities.push({
            id: `job-${job.id}`,
            type: 'job_posted',
            description: `New job posted: ${job.title}`,
            timestamp: job.created_at,
            user: job.recruiter_id,
            metadata: job
          });
        });
      }

      // Get recent user registrations
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, created_at, role')
        .order('created_at', { ascending: false })
        .limit(10);

      if (profiles) {
        profiles.forEach(profile => {
          activities.push({
            id: `user-${profile.id}`,
            type: 'user_registered',
            description: `New ${profile.role} registered: ${profile.full_name}`,
            timestamp: profile.created_at,
            user: profile.full_name,
            metadata: profile
          });
        });
      }

      // Get recent job applications
      const { data: applications } = await supabase
        .from('job_applications')
        .select(`
          id,
          applied_at,
          applicant_id,
          jobs (title)
        `)
        .order('applied_at', { ascending: false })
        .limit(10);

      if (applications) {
        applications.forEach(app => {
          activities.push({
            id: `app-${app.id}`,
            type: 'application_submitted',
            description: `New application submitted for: ${app.jobs?.title || 'Unknown Job'}`,
            timestamp: app.applied_at,
            user: app.applicant_id,
            metadata: app
          });
        });
      }

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return activities.slice(0, 20); // Return top 20 most recent
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
};

// Export the function for backward compatibility
export const getRecentAdminActivity = adminRecentActivityService.getRecentActivity;
