import { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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
  Filter,
  X,
} from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
  category?: any;
}

// Icon mapping object
// const iconMap = {
//   Phone,
//   Mail,
//   MapPin,
//   Star,
//   User,
//   Briefcase,
//   DollarSign,
//   Laptop,
//   Smartphone,
//   Car,
//   Home,
//   ChefHat,
//   Hammer,
//   Scale,
//   Calculator,
//   Users,
//   Paintbrush,
//   Palette,
//   Settings,
//   Zap,
//   Scissors,
//   Baby,
//   Heart,
//   Shield,
//   Leaf,
//   BookOpen,
//   Megaphone,
// };

const CategoryModal = ({ isOpen, onClose, onSelect, category }: CategoryModalProps) => {
  const [usersByCategory, setUsersByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Enhanced Filter States
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    gender: 'all',
    minRating: 'all',
    minExperience: 'all', // Changed from minRating duplicate
    sortBy: 'newest', // newest, most_experience, top_rated
  });

  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    if (!isOpen || !category) return;
    setLoading(true);
    setError(null);

    // Fetch only jobseekers
    axios
      .get('/user?role=jobseeker&limit=1000')
      .then(res => {
        const payload = res.data;
        const users = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        // Filter users by availableForRole matching the category name
        const categoryName = category?.name || category;
        console.log('Looking for category:', categoryName);
        console.log(
          'Available users:',
          users.map(u => ({ name: u.full_name, availableForRole: u.availableForRole }))
        );

        const filteredUsers = users.filter(
          (user: any) => user.role === 'jobseeker' && user.availableForRole === categoryName
        );

        console.log('Filtered users:', filteredUsers.length);

        // Group users by availableForRole
        const grouped: Record<string, any[]> = {};
        if (filteredUsers.length > 0) {
          grouped[categoryName] = filteredUsers;
        }

        setUsersByCategory(grouped);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setUsersByCategory({});
      })
      .finally(() => setLoading(false));
  }, [isOpen, category]);

  // Enhanced Filtering and Sorting logic
  const getFilteredAndSortedUsers = (users: any[]) => {
    let filteredUsers = users.filter(user => {
      const matchesName = filters.name
        ? user.full_name.toLowerCase().includes(filters.name.toLowerCase())
        : true;

      const matchesLocation = filters.location
        ? user.location && user.location.toLowerCase().includes(filters.location.toLowerCase())
        : true;

      const matchesGender =
        filters.gender && filters.gender !== 'all' ? user.gender === filters.gender : true;

      const matchesRating =
        filters.minRating && filters.minRating !== 'all'
          ? user.rating >= Number(filters.minRating)
          : true;

      const matchesExperience =
        filters.minExperience && filters.minExperience !== 'all'
          ? Array.isArray(user.experience) &&
            user.experience.length >= Number(filters.minExperience)
          : true;

      return matchesName && matchesLocation && matchesGender && matchesRating && matchesExperience;
    });

    // Sort users based on selected criteria
    switch (filters.sortBy) {
      case 'top_rated':
        filteredUsers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'most_experience':
        filteredUsers.sort((a, b) => {
          const aExp = Array.isArray(a.experience) ? a.experience.length : 0;
          const bExp = Array.isArray(b.experience) ? b.experience.length : 0;
          return bExp - aExp;
        });
        break;
      case 'newest':
      default:
        filteredUsers.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
    }

    return filteredUsers;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      location: '',
      gender: 'all',
      minRating: 'all',
      minExperience: 'all',
      sortBy: 'newest',
    });
  };

  const handleContactClick = (user: any) => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('auth_token');

    if (!user_id || !token) {
      toast.error('Please login to view contact information.');
      onClose();
      return;
    }

    setSelectedUser(user);
    setUserInfoOpen(true);
  };

  const handlePhoneCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleEmailContact = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  };

  // // Get icon component based on icon name
  // const getIconComponent = (iconName: string) => {
  //   const IconComponent = iconMap[iconName as keyof typeof iconMap] || User;
  //   return <IconComponent className="h-5 w-5" />;
  // };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh]  h-[90vh] overflow-hidden sm:max-w-6xl flex flex-col">
          <DialogHeader className="pb-4 ">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                <Paintbrush className="h-5 w-5 text-white" />
              </div>
              Available {category?.name || 'Professionals'}
            </DialogTitle>
            <DialogDescription>
              Browse and filter professionals in {category?.name || 'this category'}. Use the
              filters below to find the right match.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col p-2 ">
            {/* Filter Section - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
              <Input
                placeholder="Search by name"
                value={filters.name}
                onChange={e => handleFilterChange('name', e.target.value)}
                className="w-full md:col-span-1"
              />

              <Input
                placeholder="Location"
                value={filters.location}
                onChange={e => handleFilterChange('location', e.target.value)}
                className="w-full"
              />

              <Select
                value={filters.gender}
                onValueChange={value => handleFilterChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Gender</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Not Specified">Not Specified</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.minExperience}
                onValueChange={value => handleFilterChange('minExperience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Experience</SelectItem>
                  <SelectItem value="1">1+ Experience</SelectItem>
                  <SelectItem value="2">2+ Experience</SelectItem>
                  <SelectItem value="3">3+ Experience</SelectItem>
                  <SelectItem value="5">5+ Experience</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.minRating}
                onValueChange={value => handleFilterChange('minRating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Section */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {Object.keys(usersByCategory).length > 0 && (
                  <>Showing professionals in {category?.name}</>
                )}
              </div>
              <Select
                value={filters.sortBy}
                onValueChange={value => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="top_rated">Top Rated</SelectItem>
                  <SelectItem value="most_experience">Most Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto pr-2">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
                  <div className="text-gray-500">Loading professionals...</div>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-red-500 mb-2">Error loading data</div>
                  <div className="text-gray-500 text-sm">{error}</div>
                </div>
              )}

              {!loading && !error && Object.keys(usersByCategory).length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="text-lg font-medium text-gray-600 mb-2">
                    No profiles found for this category.
                  </div>
                  <div className="text-gray-500 text-center max-w-md">
                    Try adjusting your filters or check back later as more professionals join this
                    category.
                  </div>
                </div>
              )}

              {!loading &&
                !error &&
                Object.entries(usersByCategory).map(([groupKey, users]) => {
                  const filteredUsers = getFilteredAndSortedUsers(users);
                  if (
                    filteredUsers.length === 0 &&
                    (filters.name ||
                      filters.location ||
                      filters.gender !== 'all' ||
                      filters.minRating !== 'all' ||
                      filters.minExperience !== 'all')
                  ) {
                    return (
                      <div key="empty" className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <User className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="text-lg font-medium text-gray-600 mb-2">
                          No profiles match your filters.
                        </div>
                        <div className="text-gray-500 text-center max-w-md">
                          Try adjusting your search criteria to see more results.
                        </div>
                        <Button variant="outline" onClick={clearFilters} className="mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    );
                  }

                  if (filteredUsers.length === 0) return null;

                  return (
                    <div key={groupKey} className="mb-6">
                      <div className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                        {groupKey} ({filteredUsers.length}{' '}
                        {filteredUsers.length === 1 ? 'professional' : 'professionals'})
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map(user => (
                          <Card
                            key={user._id}
                            className="hover:shadow-lg transition-shadow duration-200 border-gray-200 hover:border-teal-300"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  {user.avatar_url ? (
                                    <img
                                      src={user.avatar_url}
                                      alt={user.full_name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                      <User className="h-6 w-6 text-teal-600" />
                                    </div>
                                  )}
                                  <div>
                                    <CardTitle className="text-base">{user.full_name}</CardTitle>
                                    <p className="text-sm text-gray-500">
                                      {user.gender || 'Not specified'}
                                    </p>
                                  </div>
                                </div>

                                {user.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{user.rating}</span>
                                  </div>
                                )}
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                              {user.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  {user.location}
                                </div>
                              )}

                              {user.bio && (
                                <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                              )}

                              {Array.isArray(user.skills) && user.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {user.skills.slice(0, 3).map((skill: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {user.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{user.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {Array.isArray(user.experience) && user.experience.length > 0 && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">{user.experience.length}</span>{' '}
                                  experience{user.experience.length !== 1 ? 's' : ''}
                                </div>
                              )}

                              <Button
                                className="w-full bg-teal-600 hover:bg-teal-700"
                                onClick={() => handleContactClick(user)}
                              >
                                View Contact Info
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Information Modal */}
      <Dialog open={userInfoOpen} onOpenChange={setUserInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </DialogTitle>
            <DialogDescription>Connect directly with {selectedUser?.full_name}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              {/* Profile Picture */}
              {selectedUser.profile_picture && (
                <div className="flex justify-center">
                  <img
                    src={selectedUser.profile_picture}
                    alt={selectedUser.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}

              {/* Name */}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{selectedUser.full_name}</h3>
                <p className="text-gray-600">{selectedUser.availableForRole}</p>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                {/* Phone */}
                {(selectedUser.phone || selectedUser.phone_number) && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedUser.phone || selectedUser.phone_number}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handlePhoneCall(selectedUser.phone || selectedUser.phone_number)
                        }
                      >
                        Call
                      </Button>
                    </div>
                  </div>
                )}

                {/* Email */}
                {selectedUser.email && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedUser.email}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmailContact(selectedUser.email)}
                      >
                        Email
                      </Button>
                    </div>
                  </div>
                )}

                {/* Location */}
                {selectedUser.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Location</span>
                    <span className="text-sm text-gray-600">{selectedUser.location}</span>
                  </div>
                )}

                {/* Rating */}
                {selectedUser.rating > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">Rating</span>
                    <span className="text-sm text-yellow-600 font-semibold">
                      {selectedUser.rating}/5 Stars
                    </span>
                  </div>
                )}

                {/* Gender */}
                {selectedUser.gender && selectedUser.gender !== 'Not Specified' && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Gender</span>
                    <span className="text-sm text-gray-600">{selectedUser.gender}</span>
                  </div>
                )}

                {/* Skills */}
                {Array.isArray(selectedUser.skills) && selectedUser.skills.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {Array.isArray(selectedUser.experience) && selectedUser.experience.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Experience ({selectedUser.experience.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-24 overflow-y-auto">
                      {selectedUser.experience.map((exp: any, index: number) => (
                        <div key={index} className="text-xs border-l-2 border-blue-200 pl-2">
                          <div className="font-medium">
                            {exp.position} at {exp.company_name}
                          </div>
                          <div className="text-gray-500">
                            {new Date(exp.start_date).getFullYear()} -{' '}
                            {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio/Description */}
                {selectedUser.bio && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      About
                    </h4>
                    <p className="text-sm text-gray-600">{selectedUser.bio}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {(selectedUser.phone || selectedUser.phone_number) && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handlePhoneCall(selectedUser.phone || selectedUser.phone_number)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                )}
                {selectedUser.email && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEmailContact(selectedUser.email)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryModal;
