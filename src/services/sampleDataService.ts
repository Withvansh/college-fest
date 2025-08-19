
import { supabase } from '@/integrations/supabase/client';

// Sample job data
export const sampleJobs = [
  {
    id: 'job-1',
    title: 'Senior Software Engineer',
    company_name: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary_min: 120000,
    salary_max: 180000,
    job_type: 'full_time' as const,
    experience_required: 5,
    description: 'Join our team as a Senior Software Engineer and help build the next generation of web applications.',
    requirements: 'React, Node.js, TypeScript, 5+ years experience',
    skills_required: ['React', 'Node.js', 'TypeScript'],
    benefits: ['Health insurance', '401k', 'Remote work options'],
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'job-2',
    title: 'Frontend Developer',
    company_name: 'StartupXYZ',
    location: 'Remote',
    salary_min: 80000,
    salary_max: 120000,
    job_type: 'full_time' as const,
    experience_required: 3,
    description: 'We are looking for a talented Frontend Developer to create amazing user experiences.',
    requirements: 'JavaScript, React, CSS, 3+ years experience',
    skills_required: ['JavaScript', 'React', 'CSS'],
    benefits: ['Flexible hours', 'Learning budget'],
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'job-3',
    title: 'Data Analyst',
    company_name: 'DataCorp',
    location: 'New York, NY',
    salary_min: 70000,
    salary_max: 90000,
    job_type: 'full_time' as const,
    experience_required: 0,
    description: 'Analyze data to drive business decisions and insights.',
    requirements: 'SQL, Python, Excel, Statistics knowledge',
    skills_required: ['SQL', 'Python', 'Excel'],
    benefits: ['Health benefits', 'Professional development'],
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Sample freelance gig data
export const sampleGigs = [
  {
    id: 'gig-1',
    title: 'E-commerce Website Development',
    description: 'Build a modern e-commerce website with React and Node.js',
    budget_min: 5000,
    budget_max: 10000,
    project_type: 'web-development',
    duration_days: 120,
    skills_required: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'gig-2',
    title: 'Mobile App UI/UX Design',
    description: 'Design a clean and modern mobile app interface',
    budget_min: 2000,
    budget_max: 4000,
    project_type: 'design',
    duration_days: 45,
    skills_required: ['Figma', 'UI/UX Design', 'Mobile Design'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'gig-3',
    title: 'Data Analysis Dashboard',
    description: 'Create an interactive dashboard for business analytics',
    budget_min: 3000,
    budget_max: 6000,
    project_type: 'data-analysis',
    duration_days: 75,
    skills_required: ['Python', 'Dashboard', 'Data Visualization'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Enhanced jobsService that falls back to sample data when database is empty
export const enhancedJobsService = {
  async getJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs from database:', error);
        // Return sample data as fallback
        return sampleJobs;
      }

      // If no data in database, return sample data
      if (!data || data.length === 0) {
        return sampleJobs;
      }

      return data;
    } catch (error) {
      console.error('Error in getJobs:', error);
      return sampleJobs;
    }
  },

  async getJobById(id: string) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        // Fallback to sample data
        return sampleJobs.find(job => job.id === id) || null;
      }

      return data;
    } catch (error) {
      console.error('Error in getJobById:', error);
      return sampleJobs.find(job => job.id === id) || null;
    }
  }
};

// Freelance gigs service
export const gigsService = {
  async getGigs() {
    try {
      const { data, error } = await supabase
        .from('freelance_gigs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gigs from database:', error);
        return sampleGigs;
      }

      if (!data || data.length === 0) {
        return sampleGigs;
      }

      return data;
    } catch (error) {
      console.error('Error in getGigs:', error);
      return sampleGigs;
    }
  },

  async getGigById(id: string) {
    try {
      const { data, error } = await supabase
        .from('freelance_gigs')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return sampleGigs.find(gig => gig.id === id) || null;
      }

      return data;
    } catch (error) {
      console.error('Error in getGigById:', error);
      return sampleGigs.find(gig => gig.id === id) || null;
    }
  }
};
