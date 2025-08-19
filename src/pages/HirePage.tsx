
import React, { useState } from 'react';
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
  Shield,     // 🔁 Use Shield for "Security Guard"
  Leaf,       // 🔁 Use Leaf for "Gardener"
  Phone,      // 🔁 Use Phone for "Sales Dialer"
  BookOpen,   // 🔁 Use BookOpen for "Educational Tutor"
  Megaphone,  // 🔁 Use Megaphone for "Ads Manager"
} from 'lucide-react';
import { CategoryModal } from '@/components/hire/CategoryModal';
import { ListYourselfModal } from '@/components/hire/ListYourselfModal';

const jobCategories = [
  { id: 'web-developer', name: 'Website Developer', icon: Laptop, color: 'bg-blue-500' },
  { id: 'app-developer', name: 'App Developer', icon: Smartphone, color: 'bg-green-500' },
  { id: 'driver', name: 'Driver', icon: Car, color: 'bg-yellow-500' },
  { id: 'maid', name: 'Maid', icon: Home, color: 'bg-pink-500' },
  { id: 'cook', name: 'Cook', icon: ChefHat, color: 'bg-orange-500' },
  { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: 'bg-amber-600' },
  { id: 'lawyer', name: 'Lawyer', icon: Scale, color: 'bg-indigo-600' },
  { id: 'Chartered-Accountant', name: 'CHartered Accountant', icon: Calculator, color: 'bg-purple-600' },
  { id: 'labour', name: 'Labour', icon: Users, color: 'bg-gray-600' },
  { id: 'painter', name: 'Painter', icon: Paintbrush, color: 'bg-teal-500' },
  { id: 'makeup-artist', name: 'Makeup Artist', icon: Palette, color: 'bg-rose-500' },
  { id: 'mechanic', name: 'Mechanic', icon: Settings, color: 'bg-slate-600' },
  { id: 'electrician', name: 'Electrician', icon: Zap, color: 'bg-yellow-400' },
  { id: 'hair-dresser', name: 'Hair Dresser', icon: Scissors, color: 'bg-fuchsia-500' },
  { id: 'babysitter', name: 'Babysitter', icon: Baby, color: 'bg-emerald-500' },
  { id: 'yoga-instructor', name: 'Yoga Instructor', icon: Heart, color: 'bg-cyan-500' },
  { id: 'Security-Guard', name: 'Security Guard', icon: Shield, color: 'bg-blue-500' },
  { id: 'Gardener', name: 'Gardener', icon: Leaf, color: 'bg-green-500' },
  { id: 'Sales-Dialer', name: 'Sales Dialer', icon: Phone, color: 'bg-yellow-500' },
  { id: 'Educational-Tutor', name: 'Educational Tutor', icon: BookOpen, color: 'bg-pink-500' },
  { id: 'Ads-Manager', name: 'Ads Manager', icon: Megaphone, color: 'bg-orange-500' },
  // { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: 'bg-amber-600' },
  // { id: 'lawyer', name: 'Lawyer', icon: Scale, color: 'bg-indigo-600' },
  // { id: 'ca', name: 'CA', icon: Calculator, color: 'bg-purple-600' },
  // { id: 'labour', name: 'Labour', icon: Users, color: 'bg-gray-600' },
  // { id: 'painter', name: 'Painter', icon: Paintbrush, color: 'bg-teal-500' },
  // { id: 'makeup-artist', name: 'Makeup Artist', icon: Palette, color: 'bg-rose-500' },
  // { id: 'mechanic', name: 'Mechanic', icon: Settings, color: 'bg-slate-600' },
  // { id: 'electrician', name: 'Electrician', icon: Zap, color: 'bg-yellow-400' },
  // { id: 'hair-dresser', name: 'Hair Dresser', icon: Scissors, color: 'bg-fuchsia-500' },
  // { id: 'babysitter', name: 'Babysitter', icon: Baby, color: 'bg-emerald-500' },
  // { id: 'yoga-instructor', name: 'Yoga Instructor', icon: Heart, color: 'bg-cyan-500' },
];

const HirePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showListYourselfModal, setShowListYourselfModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
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
        </div>

        {/* Category Modal */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          category={selectedCategory ? jobCategories.find(c => c.id === selectedCategory) : null}
        />

        {/* List Yourself Modal */}
        <ListYourselfModal
          isOpen={showListYourselfModal}
          onClose={() => setShowListYourselfModal(false)}
        />
      </div>
    </div>
  );
};

export default HirePage;
