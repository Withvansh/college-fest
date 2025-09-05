import { useState } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface JobSearchHeroProps {
  onSearch: (keyword: string, location: string) => void;
  totalJobs?: number;
  featuredCompanies?: string[];
}

const JobSearchHero = ({ onSearch, totalJobs = 0, featuredCompanies = [] }: JobSearchHeroProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(keyword, location);
  };

  const popularSearches = [
    'Frontend Developer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'DevOps Engineer',
  ];

  const trendingLocations = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Remote'];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 md:py-20 px-4 md:px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        

        {/* Main Content */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Find Your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
            Discover opportunities that match your skills and passion. Join thousands of
            professionals who found their perfect job through MinuteHire.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-6 max-w-4xl mx-auto border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Job Title Input */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <Input
                placeholder="Job title, keywords, or company"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="pl-12 h-14 text-base bg-gray-50/50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <MapPin className="h-5 w-5" />
              </div>
              <Input
                placeholder="City, state, or remote"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="pl-12 h-14 text-base bg-gray-50/50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-14 px-8 md:px-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Jobs
            </Button>
          </div>
        </div>


      
      </div>
    </section>
  );
};

export default JobSearchHero;
