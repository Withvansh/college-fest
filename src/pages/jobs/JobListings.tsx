
import { useState, useEffect } from 'react';
import { jobsService } from '@/services/jobsService';
import { toast } from 'sonner';
import JobHeader from '@/components/jobs/JobHeader';
import JobSearchHero from '@/components/jobs/JobSearchHero';
import JobFilterTags from '@/components/jobs/JobFilterTags';
import JobSidebar from '@/components/jobs/JobSidebar';
import JobCard from '@/components/jobs/JobCard';
import { Building2 } from 'lucide-react';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import Footer from '@/components/Footer';

interface Job {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  min_salary?: number;
  max_salary?: number;
  description: string;
  skills_required?: string[];
  created_at: string;
  remote_allowed?: boolean;
}

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    employment: ['fulltime', 'senior', 'remote'],
    salaryType: []
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await jobsService.getJobs();
      console.log('Loaded jobs:', jobsData);
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string, location: string) => {
    setSearchTerm(keyword);
    setLocationFilter(location);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev], value]
        : prev[category as keyof typeof prev].filter(v => v !== value)
    }));
  };

  const handleBookmark = (jobId: string) => {
    // Handle bookmark functionality
    toast.success('Job bookmarked!');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => 
      job.job_type.toLowerCase().includes(tag.toLowerCase()) ||
      job.skills_required?.some(skill => skill.toLowerCase().includes(tag.toLowerCase()))
    );

    return matchesSearch && matchesLocation && matchesTags;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-job-bg">
        <JobHeader />
        <div className="flex items-center justify-center py-12 md:py-20 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-job-text-secondary text-sm md:text-base">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-job-bg">
      {/* Header */}
      <JobHeader />
      
      {/* Hero Section */}
      <JobSearchHero onSearch={handleSearch} />
      
      {/* Filter Tags */}
      <JobFilterTags 
        selectedTags={selectedTags} 
        onTagToggle={handleTagToggle} 
      />
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar - Hidden on mobile, shown as drawer/modal */}
        <div className="hidden lg:block">
          <JobSidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Main Job Listings */}
        <main className="flex-1 p-4 md:p-6">
          {/* Jobs Count */}
          <div className="mb-4 md:mb-6">
            <p className="text-job-text-secondary text-sm">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 md:py-20 px-4">
              <Building2 className="h-10 w-10 md:h-12 md:w-12 text-job-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-job-text-primary mb-2">No jobs found</h3>
              <p className="text-job-text-secondary mb-4 text-sm md:text-base max-w-md mx-auto">
                {jobs.length === 0 
                  ? "No jobs have been posted yet. Check back later!" 
                  : "Try adjusting your search criteria to find more jobs."}
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job._id} 
                  job={job}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </main>
      </div>
       {/* <Footer />
      <FloatingActionButtons /> */}
    </div>
  );
};

export default JobListings;
