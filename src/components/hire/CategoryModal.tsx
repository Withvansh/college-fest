import { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingModal } from '@/components/hire/BookingModal';
import { toast } from 'sonner';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
  category?: any; // Add this line
}

const CategoryModal = ({ isOpen, onClose, onSelect, category }: CategoryModalProps) => {
  const [usersByCategory, setUsersByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingProfile, setBookingProfile] = useState<{
    id: string;
    name: string;
    job_category: string;
    rating: number;
    service_id: string;
    customer_id: string;
    provider_id: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    axios.get('/user')
      .then((res) => {
        const payload = res.data;
        const users = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        // Group users by availableForRole
        const grouped: Record<string, any[]> = {};
        users.forEach((user) => {
          const role = user.availableForRole || 'Other';
          if (!grouped[role]) grouped[role] = [];
          grouped[role].push(user);
        });
        setUsersByCategory(grouped);
      })
      .catch((err) => {
        setError(err.message);
        setUsersByCategory({});
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Filtering logic
  const getFilteredUsers = (users: any[]) => {
    return users.filter((user) => {
      const matchesName = filterName
        ? user.full_name.toLowerCase().includes(filterName.toLowerCase())
        : true;
      const matchesPrice = filterPrice
        ? (user.price && Number(user.price) >= Number(filterPrice))
        : true;
      return matchesName && matchesPrice;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] h-[80vh] overflow-hidden sm:max-w-4xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
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
          {!loading && !error && Object.entries(usersByCategory)
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
                  <div className="font-semibold mb-3">{groupKey}</div>
                  <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Hide scrollbar for Webkit */}
                    <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>
                    {filteredUsers.map((user) => (
                      <Card key={user._id} className="p-3 min-w-[260px] max-w-[280px] snap-start shrink-0">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{user.full_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm text-gray-600">{user.email}</div>
                          {user.location && (
                            <div className="text-sm text-gray-600">{user.location}</div>
                          )}
                          {Array.isArray(user.skills) && user.skills.length > 0 && (
                            <div className="text-sm text-gray-600">Skills: {user.skills.join(', ')}</div>
                          )}
                          <div className="pt-2">
                            <Button
                              className="w-full"
                              onClick={() => {
                                const authRaw = localStorage.getItem('auth_session');
                                const token = localStorage.getItem('token');
                                if (!authRaw || !token) {
                                  toast.error('Please login to book.');
                                  onClose();
                                  window.location.href = '/login';
                                  return;
                                }
                                const auth = JSON.parse(authRaw || '{}');
                                const customerId: string = auth?.id || '';
                                const serviceId: string = (category?.id || category?.name || groupKey).toString();
                                setBookingProfile({
                                  id: user._id,
                                  name: user.full_name,
                                  job_category: groupKey,
                                  rating: 0,
                                  service_id: serviceId,
                                  customer_id: customerId,
                                  provider_id: user._id,
                                });
                                setBookingOpen(true);
                              }}
                            >
                              Book Now
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
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          profile={bookingProfile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;