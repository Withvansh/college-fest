// src/pages/StartupsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from '@/lib/utils/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Calendar,
  DollarSign,
  User,
  ExternalLink,
  Search,
  BriefcaseBusiness,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  IndianRupeeIcon,
  BadgeCheck,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

type Startup = {
  _id: string;
  startup_name: string;
  industry: string;
  description: string;
  location: string;
  founder_name: string;
  website?: string;
  employees_count?: number;
  funding_stage: string;
  logo_url?: string;
  created_at: string;
  hiring: string;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalStartups: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStartups: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    search: '',
  });

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await axios.get(`/startups?${params.toString()}`);
      const data = response.data.data;

      setStartups(data.startups);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalStartups: data.totalStartups,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [filters]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1, // Reset to first page when searching
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: string) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1, // Reset to first page when changing limit
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <BriefcaseBusiness className="h-10 w-10 text-blue-600" />
            Discover Startups
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Explore innovative startups, learn about their industries, and find potential
            opportunities to collaborate or work with them.
          </p>

          {/* Add Your Startup Button */}
          <div className="flex justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/auth/startup" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Your Startup
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2">
                Search Startups
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, industry, or description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg pl-10 pr-4 py-4"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="limit" className="text-sm font-medium text-gray-700 mb-2">
                Items per page
              </Label>
              <Select value={filters.limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger id="limit" className="h-12">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 per page</SelectItem>
                  <SelectItem value="9">9 per page</SelectItem>
                  <SelectItem value="12">12 per page</SelectItem>
                  <SelectItem value="15">15 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="h-12 bg-blue-600 hover:bg-blue-700">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Results Info */}
        {!loading && !error && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing {startups.length} of {pagination.totalStartups} startups
            </p>
            <p className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
            <p>Loading startups...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg mx-auto max-w-2xl">
            <p className="font-medium">{error}</p>
            <Button onClick={() => fetchStartups()} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && startups.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium">No startups found matching your search.</p>
            <p className="mt-1">Try different keywords or adjust your filters.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {startups.map(startup => (
            <Card
              key={startup._id}
              className={`cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group ${
                startup.hiring
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-l-green-500 shadow-md'
                  : 'bg-gradient-to-br from-white to-blue-50'
              }`}
              onClick={() => setSelectedStartup(startup)}
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${
                startup.hiring 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}></div>
              
              {startup.hiring  && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                  <BadgeCheck className="h-3 w-3" />
                  Hiring
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  {startup.logo_url ? (
                    <img
                      src={startup.logo_url}
                      alt={startup.startup_name}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      startup.hiring 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-200'
                        : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                    }`}>
                      <Building2 className={`h-6 w-6 ${
                        startup.hiring  ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                  )}
               
                  <div className="flex-1">
                    <CardTitle className={`text-xl group-hover:${
                      startup.hiring  ? 'text-green-700' : 'text-blue-600'
                    } transition-colors`}>
                      {startup.startup_name}
                    </CardTitle>
                    <p className={`text-sm font-medium mt-1 ${
                      startup.hiring  ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {startup.industry}
                    </p>
                  </div>
                     { startup?.hiring  && (
                      <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-1" />
                        Hiring
                      </span>)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{startup.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{startup.location}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {startup.employees_count && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{startup.employees_count}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <IndianRupeeIcon className="h-3.5 w-3.5" />
                      <span>{startup.funding_stage}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === pagination.currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Startup Details Modal */}
        <Dialog open={!!selectedStartup} onOpenChange={() => setSelectedStartup(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start gap-4">
                {selectedStartup?.logo_url ? (
                  <img
                    src={selectedStartup.logo_url}
                    alt={selectedStartup.startup_name}
                    className="h-16 w-16 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                    selectedStartup?.hiring 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-200'
                      : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                  }`}>
                    <Building2 className={`h-8 w-8 ${
                      selectedStartup?.hiring ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                )}
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedStartup?.startup_name}
                    {selectedStartup?.hiring  && (
                      <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-1" />
                        Hiring
                      </span>
                    )}
                  </DialogTitle>
                  <p className={`font-medium mt-1 ${
                    selectedStartup?.hiring  ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {selectedStartup?.industry}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {selectedStartup && (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">{selectedStartup.description}</p>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedStartup.hiring  ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        selectedStartup.hiring  ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Founder</p>
                      <p className="font-semibold">{selectedStartup.founder_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedStartup.hiring  ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <MapPin className={`h-5 w-5 ${
                        selectedStartup.hiring  ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="font-semibold">{selectedStartup.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedStartup.hiring  ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Users className={`h-5 w-5 ${
                        selectedStartup.hiring  ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Team Size</p>
                      <p className="font-semibold">
                        {selectedStartup.employees_count || 'N/A'} employees
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedStartup.hiring  ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <IndianRupeeIcon className={`h-5 w-5 ${
                        selectedStartup.hiring  ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Funding Stage</p>
                      <p className="font-semibold">{selectedStartup.funding_stage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedStartup.hiring  ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        selectedStartup.hiring  ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Founded</p>
                      <p className="font-semibold">{formatDate(selectedStartup.created_at)}</p>
                    </div>
                  </div>

                  {selectedStartup.website && (
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedStartup.hiring  ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Globe className={`h-5 w-5 ${
                          selectedStartup.hiring  ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <a
                          href={selectedStartup.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Visit website <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={() => setSelectedStartup(null)}
                    className={`bg-gradient-to-r text-white hover:from-blue-700 hover:to-indigo-700 ${
                      selectedStartup.hiring 
                        ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : 'from-blue-600 to-indigo-600'
                    }`}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StartupsPage;