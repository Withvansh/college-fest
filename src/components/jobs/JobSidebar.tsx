import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Filter,
  X,
  DollarSign,
  MapPin,
  Briefcase,
  Users,
  Calendar,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { type Job } from '@/lib/api/recruiter-dashboard';

interface JobSidebarProps {
  filters: {
    employment: string[];
    salaryType: string[];
  };
  onFilterChange: (category: string, value: string, checked: boolean) => void;
  jobs?: Job[];
}

const JobSidebar = ({ filters, onFilterChange, jobs = [] }: JobSidebarProps) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [employmentOpen, setEmploymentOpen] = useState(true);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [salaryRange, setSalaryRange] = useState([0, 2000000]);

  // Calculate dynamic filter options based on actual job data
  const getEmploymentOptions = () => {
    const employmentCounts: { [key: string]: number } = {};
    const remoteCount = jobs.filter(job => job.remote_allowed).length;

    jobs.forEach(job => {
      employmentCounts[job.job_type] = (employmentCounts[job.job_type] || 0) + 1;
    });

    const seniorCount = jobs.filter(
      job => job.experience_level === 'senior' || job.experience_level === 'executive'
    ).length;

    const options = [];

    if (employmentCounts['full_time']) {
      options.push({
        id: 'Full-time',
        label: 'Full-time',
        icon: <Briefcase className="w-4 h-4" />,
        count: employmentCounts['full_time'].toString(),
      });
    }

    if (employmentCounts['part_time']) {
      options.push({
        id: 'Part-time',
        label: 'Part-time',
        icon: <Briefcase className="w-4 h-4" />,
        count: employmentCounts['part_time'].toString(),
      });
    }

    if (employmentCounts['contract']) {
      options.push({
        id: 'Contract',
        label: 'Contract',
        icon: <Users className="w-4 h-4" />,
        count: employmentCounts['contract'].toString(),
      });
    }

    if (employmentCounts['internship']) {
      options.push({
        id: 'Internship',
        label: 'Internship',
        icon: <Calendar className="w-4 h-4" />,
        count: employmentCounts['internship'].toString(),
      });
    }

    if (remoteCount > 0) {
      options.push({
        id: 'Remote',
        label: 'Remote',
        icon: <MapPin className="w-4 h-4" />,
        count: remoteCount.toString(),
      });
    }

    if (seniorCount > 0) {
      options.push({
        id: 'Senior Level',
        label: 'Senior Level',
        icon: <Users className="w-4 h-4" />,
        count: seniorCount.toString(),
      });
    }

    return options;
  };

  const getExperienceOptions = () => {
    const experienceCounts: { [key: string]: number } = {};

    jobs.forEach(job => {
      if (job.experience_level) {
        experienceCounts[job.experience_level] = (experienceCounts[job.experience_level] || 0) + 1;
      }
    });

    const options = [];

    if (experienceCounts['entry']) {
      options.push({
        id: 'entry',
        label: 'Entry Level (0-1 years)',
        count: experienceCounts['entry'].toString(),
      });
    }

    if (experienceCounts['mid'] || experienceCounts['intermediate']) {
      const count = (experienceCounts['mid'] || 0) + (experienceCounts['intermediate'] || 0);
      options.push({
        id: 'mid',
        label: 'Mid Level (2-4 years)',
        count: count.toString(),
      });
    }

    if (experienceCounts['senior']) {
      options.push({
        id: 'senior',
        label: 'Senior Level (5+ years)',
        count: experienceCounts['senior'].toString(),
      });
    }

    return options;
  };

  const getLocationOptions = () => {
    const locationCounts: { [key: string]: number } = {};

    jobs.forEach(job => {
      const location = job.location.toLowerCase();
      const normalizedLocation = location.includes('bangalore')
        ? 'bangalore'
        : location.includes('mumbai')
          ? 'mumbai'
          : location.includes('delhi')
            ? 'delhi'
            : location.includes('hyderabad')
              ? 'hyderabad'
              : location.includes('pune')
                ? 'pune'
                : location.includes('chennai')
                  ? 'chennai'
                  : location.includes('kolkata')
                    ? 'kolkata'
                    : 'others';

      locationCounts[normalizedLocation] = (locationCounts[normalizedLocation] || 0) + 1;
    });

    const locationMap = {
      bangalore: 'Bangalore',
      mumbai: 'Mumbai',
      delhi: 'Delhi NCR',
      hyderabad: 'Hyderabad',
      pune: 'Pune',
      chennai: 'Chennai',
      kolkata: 'Kolkata',
      others: 'Other Cities',
    };

    return Object.entries(locationCounts)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => ({
        id: key,
        label: locationMap[key as keyof typeof locationMap] || key,
        count: count.toString(),
      }))
      .sort((a, b) => parseInt(b.count) - parseInt(a.count));
  };

  const getSalaryRange = () => {
    const salaries = jobs
      .map(job => [job.min_salary, job.max_salary])
      .flat()
      .filter(salary => salary !== undefined && salary !== null) as number[];

    if (salaries.length === 0) return { min: 0, max: 2000000 };

    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);

    return {
      min: Math.floor(minSalary / 50000) * 50000,
      max: Math.ceil(maxSalary / 50000) * 50000,
    };
  };

  const dynamicSalaryRange = useMemo(() => getSalaryRange(), [jobs]);
  const employmentOptions = useMemo(() => getEmploymentOptions(), [jobs]);
  const experienceOptions = useMemo(() => getExperienceOptions(), [jobs]);
  const locationOptions = useMemo(() => getLocationOptions(), [jobs]);

  // Initialize salary range based on actual data
  useEffect(() => {
    if (salaryRange[0] === 0 && salaryRange[1] === 2000000 && jobs.length > 0) {
      setSalaryRange([dynamicSalaryRange.min, dynamicSalaryRange.max]);
    }
  }, [jobs.length, dynamicSalaryRange.min, dynamicSalaryRange.max, salaryRange]);

  const clearAllFilters = () => {
    // Reset all filters
    filters.employment.forEach(filter => {
      onFilterChange('employment', filter, false);
    });
    filters.salaryType.forEach(filter => {
      onFilterChange('salaryType', filter, false);
    });
    setFilterSearch('');
    setSalaryRange([dynamicSalaryRange.min, dynamicSalaryRange.max]);
  };

  const activeFiltersCount = filters.employment.length + filters.salaryType.length;

  return (
    <Card className="h-fit sticky top-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Job Statistics Summary */}

        {/* Filter Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search filters..."
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            className="pl-10 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Employment Type Filter */}
        {employmentOptions.length > 0 && (
          <Collapsible open={employmentOpen} onOpenChange={setEmploymentOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-gray-900 hover:bg-transparent group"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Employment Type</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform group-hover:text-blue-600 ${
                    employmentOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-4">
              {employmentOptions
                .filter(
                  item =>
                    !filterSearch || item.label.toLowerCase().includes(filterSearch.toLowerCase())
                )
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={filters.employment.includes(item.id)}
                        onCheckedChange={checked =>
                          onFilterChange('employment', item.id, checked as boolean)
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{item.icon}</span>
                        <label
                          htmlFor={item.id}
                          className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 font-medium"
                        >
                          {item.label}
                        </label>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs text-gray-500">
                      {item.count}
                    </Badge>
                  </div>
                ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Experience Level Filter */}
        {experienceOptions.length > 0 && (
          <Collapsible open={experienceOpen} onOpenChange={setExperienceOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-gray-900 hover:bg-transparent group"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Experience Level</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform group-hover:text-purple-600 ${
                    experienceOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-4">
              {experienceOptions
                .filter(
                  item =>
                    !filterSearch || item.label.toLowerCase().includes(filterSearch.toLowerCase())
                )
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label
                        htmlFor={item.id}
                        className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 font-medium"
                      >
                        {item.label}
                      </label>
                    </div>
                    <Badge variant="outline" className="text-xs text-gray-500">
                      {item.count}
                    </Badge>
                  </div>
                ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Salary Range Filter */}
        <Collapsible open={salaryOpen} onOpenChange={setSalaryOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto font-medium text-gray-900 hover:bg-transparent group"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Salary Range</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform group-hover:text-green-600 ${
                  salaryOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="px-2">
              <Slider
                value={salaryRange}
                onValueChange={setSalaryRange}
                max={dynamicSalaryRange.max}
                min={dynamicSalaryRange.min}
                step={50000}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{salaryRange[0].toLocaleString()}</span>
                <span>₹{salaryRange[1].toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Range: ₹{dynamicSalaryRange.min.toLocaleString()} - ₹
                {dynamicSalaryRange.max.toLocaleString()}
              </div>
            </div>

            {/* Salary Type Options */}
            <div className="space-y-3">
              {[
                { id: 'hourly', label: 'Hourly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'yearly', label: 'Yearly' },
              ].map(item => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={filters.salaryType.includes(item.id)}
                    onCheckedChange={checked =>
                      onFilterChange('salaryType', item.id, checked as boolean)
                    }
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label
                    htmlFor={item.id}
                    className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 font-medium"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Location Filter */}
        {locationOptions.length > 0 && (
          <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-gray-900 hover:bg-transparent group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Location</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform group-hover:text-orange-600 ${
                    locationOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-4">
              {locationOptions
                .filter(
                  item =>
                    !filterSearch || item.label.toLowerCase().includes(filterSearch.toLowerCase())
                )
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      />
                      <label
                        htmlFor={item.id}
                        className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 font-medium"
                      >
                        {item.label}
                      </label>
                    </div>
                    <Badge variant="outline" className="text-xs text-gray-500">
                      {item.count}
                    </Badge>
                  </div>
                ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default JobSidebar;
