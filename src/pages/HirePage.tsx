import React, { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  Mail,
  MapPin,
  Star,
  User,
  Briefcase,
  DollarSign,
  Laptop,
  Smartphone,
  Car,
  Home,
  ChefHat,
  Hammer,
  Scale,
  Calculator,
  Users,
  Paintbrush,
  Palette,
  Settings,
  Zap,
  Scissors,
  Baby,
  Heart,
  Shield,
  Leaf,
  BookOpen,
  Megaphone,
  Search,
  PlusCircle,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import CategoryModal from '@/components/hire/CategoryModal';
import { Link } from 'react-router-dom';

// Create an icon map with proper typing
const iconMap: Record<string, LucideIcon> = {
  Phone,
  Mail,
  MapPin,
  Star,
  User,
  Briefcase,
  DollarSign,
  Laptop,
  Smartphone,
  Car,
  Home,
  ChefHat,
  Hammer,
  Scale,
  Calculator,
  Users,
  Paintbrush,
  Palette,
  Settings,
  Zap,
  Scissors,
  Baby,
  Heart,
  Shield,
  Leaf,
  BookOpen,
  Megaphone,
};

// Dynamic Icon Component
const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const IconComponent = iconMap[iconName] || Laptop;
  return <IconComponent className="text-xl text-blue-600" />;
};

const HirePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showListYourselfModal, setShowListYourselfModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [jobCategories, setJobCategories] = useState<any[]>([]);
  const [jobseekersCount, setJobseekersCount] = useState<Record<string, number>>({});

  // Load categories and jobseeker counts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load categories
        const categoriesRes = await axios.get('/categories');
        const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        setJobCategories(categories);

        // Load jobseekers to get counts per category
        const usersRes = await axios.get('/user?role=jobseeker&limit=1000');
        const payload = usersRes.data;
        const jobseekers = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        // Count jobseekers by availableForRole
        const counts: Record<string, number> = {};
        jobseekers.forEach((user: any) => {
          if (user.availableForRole) {
            counts[user.availableForRole] = (counts[user.availableForRole] || 0) + 1;
          }
        });
        setJobseekersCount(counts);
      } catch (error) {
        console.error('Error loading data:', error);
        setJobCategories([]);
        setJobseekersCount({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle category selection
  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const filteredCategories = jobCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hire Skilled <span className="text-blue-600">Professionals</span> in Just a Click
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with verified professionals and skilled individuals across various categories.
            Find the right person for your needs instantly.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search for services or professionals..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-lg pl-10 pr-4 py-6 rounded-full shadow-sm border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Browse by Category</h2>
            {/* <div className="text-sm text-blue-600 flex items-center">
              View all categories <ArrowRight size={16} className="ml-1" />
            </div> */}
          </div>

          {/* Job Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading
              ? // Loading skeleton
                Array.from({ length: 12 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="bg-gray-200 w-14 h-14 rounded-full mb-3"></div>
                      <div className="bg-gray-200 h-4 w-20 rounded mb-1"></div>
                      <div className="bg-gray-200 h-3 w-12 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              : filteredCategories.map(category => (
                  <Card
                    key={category.id}
                    className="cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg border-blue-100 group bg-white relative"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                      <div
                        className={`bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors`}
                      >
                        <DynamicIcon iconName={category.icon} />
                      </div>
                      <h3 className="font-medium text-sm text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                        {category.name}
                      </h3>
                      {jobseekersCount[category.name] && (
                        <div className="text-xs text-blue-600 font-medium">
                          {jobseekersCount[category.name]} available
                        </div>
                      )}
                    </CardContent>
                    {jobseekersCount[category.name] && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                        {jobseekersCount[category.name] > 99
                          ? '99+'
                          : jobseekersCount[category.name]}
                      </div>
                    )}
                  </Card>
                ))}
          </div>
        </div>

        <Separator className="my-8 bg-blue-100" />

        {/* List Yourself Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold mb-2">Want to Get Hired?</h2>
                <p className="max-w-2xl opacity-90">
                  List yourself in your expertise area and start receiving booking requests from
                  potential clients. Build your professional profile and grow your business.
                </p>
              </div>
              <Link to={'/auth?tab=signup'}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 font-medium rounded-full shadow-md"
                  onClick={() => setShowListYourselfModal(true)}
                >
                  <PlusCircle size={20} className="mr-2" />
                  List Yourself to Get Hired
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Category Modal */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
          onSelect={category => setSelectedCategory(category)}
          category={selectedCategory}
        />
      </div>
    </div>
  );
};

export default HirePage;
