import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface JobSidebarProps {
  filters: {
    employment: string[];
    salaryType: string[];
  };
  onFilterChange: (category: string, value: string, checked: boolean) => void;
}

const JobSidebar = ({ filters, onFilterChange }: JobSidebarProps) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [employmentOpen, setEmploymentOpen] = useState(true);
  const [salaryOpen, setSalaryOpen] = useState(false);

  return (
    <aside className="w-64 bg-white border-r border-border p-6 h-full">
      {/* Filter Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-job-text-secondary h-4 w-4" />
        <Input
          placeholder="Company, skill, tag..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="pl-10 rounded-full bg-job-tag-bg border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Speciality Dropdown */}
      <div className="mb-6">
        <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal text-job-text-primary hover:bg-transparent">
          <span>Speciality</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Employment Filter */}
      <Collapsible open={employmentOpen} onOpenChange={setEmploymentOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-job-text-primary hover:bg-transparent mb-3">
            <span>Employment</span>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${employmentOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 ml-0">
          {[
            { id: 'fulltime', label: 'Fulltime', checked: true },
            { id: 'senior', label: 'Senior Level', checked: true },
            { id: 'remote', label: 'Remote', checked: true },
            { id: 'contract', label: 'Contract', checked: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={filters.employment.includes(item.id)}
                onCheckedChange={(checked) => 
                  onFilterChange('employment', item.id, checked as boolean)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={item.id}
                className="text-sm text-job-text-primary cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Salary Type Filter */}
      <Collapsible open={salaryOpen} onOpenChange={setSalaryOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-job-text-primary hover:bg-transparent mt-6">
            <span>Salary Type</span>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${salaryOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 ml-0 mt-3">
          {[
            { id: 'hourly', label: 'Hourly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly' },
          ].map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={filters.salaryType.includes(item.id)}
                onCheckedChange={(checked) => 
                  onFilterChange('salaryType', item.id, checked as boolean)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={item.id}
                className="text-sm text-job-text-primary cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
};

export default JobSidebar;