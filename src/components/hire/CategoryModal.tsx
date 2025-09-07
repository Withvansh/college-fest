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
} from "lucide-react";

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
  const [filterName, setFilterName] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
// console.log(category);
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    axios
      .get('/user')
      .then(res => {
        const payload = res.data;
        const users = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        // Group users by availableForRole
        const grouped: Record<string, any[]> = {};
        users.forEach(user => {
          const role = user.availableForRole || 'Other';
          if (!grouped[role]) grouped[role] = [];
          grouped[role].push(user);
        });
        setUsersByCategory(grouped);
      })
      .catch(err => {
        setError(err.message);
        setUsersByCategory({});
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Filtering logic
  const getFilteredUsers = (users: any[]) => {
    return users.filter(user => {
      const matchesName = filterName
        ? user.full_name.toLowerCase().includes(filterName.toLowerCase())
        : true;
      const matchesPrice = filterPrice
        ? user.price && Number(user.price) >= Number(filterPrice)
        : true;
      return matchesName && matchesPrice;
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
        <DialogContent className="max-h-[80vh] h-[80vh] overflow-hidden sm:max-w-4xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              
              {category?.icon }
              Select Category
            </DialogTitle>
            <DialogDescription>
              Choose a category to see available users grouped by their expertise.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {/* Filter Inputs */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Filter by name"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
                className="border rounded px-2 py-1 w-1/2"
              />
              <input
                type="number"
                placeholder="Min price"
                value={filterPrice}
                onChange={e => setFilterPrice(e.target.value)}
                className="border rounded px-2 py-1 w-1/2"
              />
            </div>
            {loading && <div className="text-gray-500">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && Object.keys(usersByCategory).length === 0 && (
              <div className="text-gray-500">No categories found.</div>
            )}
            {!loading &&
              !error &&
              Object.entries(usersByCategory)
                .filter(([key]) => {
                  const selectedKey = (category?.id || category?.name || '').toString();
                  if (!selectedKey) return key !== 'Other';
                  return key === selectedKey;
                })
                .map(([groupKey, users]) => {
                  if (groupKey === 'Other') return null;
                  const filteredUsers = getFilteredUsers(users);
                  if (filteredUsers.length === 0) return null;
                  return (
                    <div key={groupKey} className="border rounded-lg p-3 mb-3 mt-6">
                      <div className="font-semibold mb-3 flex items-center gap-2">
                          {`${JSON.stringify(category)} `}
                        {`${category?.icon }`}
                        {groupKey}
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]">
                        <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>
                        {filteredUsers.map(user => (
                          <Card
                            key={user._id}
                            className="p-3 min-w-[260px] max-w-[280px] snap-start shrink-0"
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{user.full_name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="text-sm text-gray-600">{user.email}</div>
                              {user.location && (
                                <div className="text-sm text-gray-600">{user.location}</div>
                              )}
                              {Array.isArray(user.skills) && user.skills.length > 0 && (
                                <div className="text-sm text-gray-600">
                                  Skills: {user.skills.join(', ')}
                                </div>
                              )}
                              {user.price && (
                                <div className="text-sm font-semibold text-green-600">
                                  ₹{user.price}/hr
                                </div>
                              )}
                              <div className="pt-2">
                                <Button className="w-full" onClick={() => handleContactClick(user)}>
                                  View Contact Info
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
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

                {/* Price */}
                {selectedUser.price && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Rate</span>
                    <span className="text-sm text-green-600 font-semibold">
                      ₹{selectedUser.price}/hr
                    </span>
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
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience/Description */}
                {(selectedUser.experience || selectedUser.description || selectedUser.bio) && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">About</h4>
                    <p className="text-sm text-gray-600">
                      {selectedUser.experience || selectedUser.description || selectedUser.bio}
                    </p>
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