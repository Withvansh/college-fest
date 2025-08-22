import React, { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
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
  Phone,
  BookOpen,
  Megaphone,
} from 'lucide-react';
import CategoryModal from '@/components/hire/CategoryModal';
import ListYourselfModal from '@/components/hire/ListYourselfModal';

const iconMap: Record<string, React.ComponentType<any>> = {
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
  Phone,
  BookOpen,
  Megaphone,
};


const HirePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showListYourselfModal, setShowListYourselfModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [jobCategories, setJobCategories] = useState<any[]>([]);

  // Fetch categories from backend
  useEffect(() => {
    axios.get('/categories')
      .then((res) => {
        const categories = Array.isArray(res.data) ? res.data : [];
        const mapped = categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: iconMap[c.icon] || Laptop,
          color: c.color || 'bg-blue-500',
        }));
        setJobCategories(mapped);
      })
      .catch(() => setJobCategories([]));
  }, []);

  // Fetch users for selected category
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredUsers([]);
      return;
    }
    setUsersLoading(true);
    setUsersError(null);
    axios.get(`/user`)
      .then((res) => {
        const payload = res.data;
        const allUsers = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        const filtered = allUsers.filter((u: any) => u.availableForRole === selectedCategory);
        setFilteredUsers(filtered);
      })
      .catch((err) => {
        setUsersError(err.message);
        setFilteredUsers([]);
      })
      .finally(() => setUsersLoading(false));
  }, [selectedCategory]);

  // Example: Send booking request when a category is selected
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(true);
  };

  // Example: List yourself (open modal, then POST to API)
  // const handleListYourself = async (profileData: any) => {
  //   setLoading(true);
  //   setApiError(null);
  //   try {
  //     const res = await fetch("/api/user", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(profileData),
  //     });
  //     if (!res.ok) throw new Error("Failed to list yourself");
  //     // Optionally handle response
  //   } catch (err: any) {
  //     setApiError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filteredCategories = jobCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Hire Skilled People in Just a Click
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with verified professionals and skilled individuals across various categories. 
            Find the right person for your needs instantly.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <Input
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg p-4"
            />
          </div>
        </div>

        {/* Job Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="my-8" />

        {/* List Yourself Section */}
        {/* <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Get Hired?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            List yourself in your expertise area and start receiving booking requests from potential clients.
            Build your professional profile and grow your business.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            onClick={() => setShowListYourselfModal(true)}
          >
            List Yourself to Get Hired
          </Button>
        </div> */}


        {/* Category Modal */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSelect={(category) => setSelectedCategory(category)}
          category={selectedCategory ? jobCategories.find(c => c.id === selectedCategory) : null}
        />

        {/* Filtered Users Section */}
        {/* {selectedCategory && (
          <div className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Available {jobCategories.find(c => c.id === selectedCategory)?.name} Providers
            </h2>
            {usersLoading && <div className="text-gray-500 text-center">Loading users...</div>}
            {usersError && <div className="text-red-500 text-center">{usersError}</div>}
            {!usersLoading && !usersError && filteredUsers.length === 0 && (
              <div className="text-gray-500 text-center">No providers found for this category.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="p-4">
                  <CardHeader>
                    <CardTitle>{user.full_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-gray-600">{user.email}</div>
                    <div className="mb-2 text-sm text-gray-600">{user.location}</div>
                    <div className="mb-2 text-sm text-gray-600">Skills: {user.skills?.join(", ")}</div>
                    <div className="mb-2 text-sm text-gray-600">Role: {user.role}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )} */}

        {/* List Yourself Modal */}
        {/* <ListYourselfModal
          isOpen={showListYourselfModal}
          onClose={() => setShowListYourselfModal(false)}
          onSubmit={handleListYourself}
        /> */}
      </div>
    </div>
  );
};

export default HirePage;
