
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface JobSearchHeroProps {
  onSearch: (keyword: string, location: string) => void;
}

const JobSearchHero = ({ onSearch }: JobSearchHeroProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(keyword, location);
  };

  return (
    <section className="bg-job-bg py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-job-text-primary mb-6 md:mb-8 px-4">
          Find Your Dream Job Here
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl md:rounded-full shadow-md p-3 md:p-2 flex flex-col md:flex-row gap-3 md:gap-2 max-w-3xl mx-auto">
          {/* Job Title Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-job-text-secondary h-4 w-4 md:h-5 md:w-5" />
            <Input
              placeholder="Job title or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 md:pl-12 h-11 md:h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Location Input */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-job-text-secondary h-4 w-4 md:h-5 md:w-5" />
            <Input
              placeholder="Add country or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 md:pl-12 h-11 md:h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 h-11 md:h-12 rounded-xl md:rounded-full font-medium text-sm md:text-base w-full md:w-auto"
          >
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobSearchHero;
