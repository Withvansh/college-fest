import { useState, useEffect } from 'react';
import { jobsService, type Job } from '@/services/jobsService';
import { toast } from 'sonner';
import JobSearchHero from '@/components/jobs/JobSearchHero';
import JobFilterTags from '@/components/jobs/JobFilterTags';
import JobSidebar from '@/components/jobs/JobSidebar';
import JobCard from '@/components/jobs/JobCard';
import { Building2, Filter, Grid, List, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CrowdCanvas } from '@/components/CrowdCanva';
import { Skiper39 } from '@/components/skiper39';

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'relevance'>('newest');
  const [filters, setFilters] = useState({
    employment: ['Full-time', 'Senior Level', 'Remote', 'Contract', 'Internship'],
    salaryType: [],
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
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category as keyof typeof prev], value]
        : prev[category as keyof typeof prev].filter(v => v !== value),
    }));
  };

  const handleBookmark = (jobId: string) => {
    toast.success('Job bookmarked!', {
      description: 'You can view your bookmarked jobs in your profile.',
    });
  };

  const sortJobs = (jobsToSort: Job[]) => {
    switch (sortBy) {
      case 'salary':
        return [...jobsToSort].sort((a, b) => {
          const salaryA = a.salary_range?.max || a.salary_range?.min || 0;
          const salaryB = b.salary_range?.max || b.salary_range?.min || 0;
          return salaryB - salaryA;
        });
      case 'relevance':
        return [...jobsToSort].sort((a, b) => {
          const scoreA = (a.skills_required?.length || 0) + (a.remote_work ? 1 : 0);
          const scoreB = (b.skills_required?.length || 0) + (b.remote_work ? 1 : 0);
          return scoreB - scoreA;
        });
      case 'newest':
      default:
        return [...jobsToSort].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  };

  const filteredJobs = sortJobs(
    jobs.filter(job => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
        (locationFilter.toLowerCase() === 'remote' && job.remote_work);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(
          tag =>
            job.job_type.toLowerCase().includes(tag.toLowerCase()) ||
            job.skills_required?.some(skill => skill.toLowerCase().includes(tag.toLowerCase())) ||
            (tag.toLowerCase() === 'remote' && job.remote_work)
        );

      // Filter by employment type
      const matchesEmployment =
        filters.employment.length === 0 ||
        filters.employment.some(empType => {
          const normalizedEmpType = empType.toLowerCase().replace(/[-\s]/g, '_');
          const normalizedJobType = job.job_type.toLowerCase().replace(/[-\s]/g, '_');

          // Handle specific mappings
          if (empType === 'Full-time') return normalizedJobType === 'full_time';
          if (empType === 'Part-time') return normalizedJobType === 'part_time';
          if (empType === 'Contract') return normalizedJobType === 'contract';
          if (empType === 'Internship') return normalizedJobType === 'internship';
          if (empType === 'Remote' && job.remote_work) return true;
          if (empType === 'Senior Level')
            return job.experience_level === 'senior' || job.experience_level === 'executive';

          return normalizedJobType.includes(normalizedEmpType);
        });

      return matchesSearch && matchesLocation && matchesTags && matchesEmployment;
    })
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center py-20 px-4">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-600 animate-spin animation-delay-150 mx-auto"></div>
            </div>
            <p className="mt-6 text-gray-600 text-lg font-medium">
              Discovering amazing opportunities...
            </p>
            <p className="mt-2 text-gray-500 text-sm">Please wait while we load the latest jobs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <JobSearchHero
        onSearch={handleSearch}
        totalJobs={jobs.length}
        featuredCompanies={Array.from(new Set(jobs.map(job => job.company))).slice(0, 5)}
      />

      {/* Enhanced Filter Tags */}
      <div className="border-b border-gray-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <JobFilterTags selectedTags={selectedTags} onTagToggle={handleTagToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <JobSidebar filters={filters} onFilterChange={handleFilterChange} jobs={jobs} />
          </div>

          {/* Main Job Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Header with Filters */}
            <div className="lg:hidden mb-6">
              <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-sm border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {filteredJobs.length} Jobs Found
                      </h2>
                    </div>
                    {filteredJobs.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {filteredJobs.filter(job => job.remote_work).length} Remote
                      </Badge>
                    )}
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-gray-200"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-6">
                        <JobSidebar
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          jobs={jobs}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </Card>
            </div>

            {/* Desktop Header with Sort and View Options */}
            <div className="hidden lg:block mb-6">
              <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-sm border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        {filteredJobs.length} Jobs Available
                      </h2>
                    </div>
                    {filteredJobs.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {
                            filteredJobs.filter(
                              job =>
                                new Date(job.created_at) >
                                new Date(Date.now() - 24 * 60 * 60 * 1000)
                            ).length
                          }{' '}
                          New Today
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {filteredJobs.filter(job => job.remote_work).length} Remote
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Sort Options */}
                    <Select
                      value={sortBy}
                      onValueChange={(value: 'newest' | 'salary' | 'relevance') => setSortBy(value)}
                    >
                      <SelectTrigger className="w-40 bg-white border-gray-200">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="salary">Highest Salary</SelectItem>
                        <SelectItem value="relevance">Most Relevant</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Jobs Found</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {jobs.length === 0
                      ? "We're constantly adding new opportunities. Check back soon for the latest job postings!"
                      : 'Try adjusting your search criteria or filters to discover more opportunities that match your skills.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setLocationFilter('');
                        setSelectedTags([]);
                      }}
                      variant="outline"
                      className="border-gray-300 hover:border-blue-300 hover:text-blue-600"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Refresh Jobs
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredJobs.map(job => (
                  <JobCard key={job._id} job={job} onBookmark={handleBookmark} />
                ))}
              </div>
            )}

            {/* Load More Button for Future */}
            {filteredJobs.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="px-8 py-3 bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300 hover:text-blue-600"
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Skiper39 />
    </div>
  );
};

export default JobListings;
