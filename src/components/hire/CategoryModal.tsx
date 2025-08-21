import { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
  category?: any; // Add this line
}

const CategoryModal = ({ isOpen, onClose, onSelect }: CategoryModalProps) => {
  const [usersByCategory, setUsersByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    axios.get('/user')
      .then((res) => {
        const users = Array.isArray(res.data) ? res.data : [];
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
          <DialogDescription>
            Choose a category to see available users grouped by their expertise.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
          {!loading && !error && Object.entries(usersByCategory).map(([category, users]) => {
            const filteredUsers = getFilteredUsers(users);
            if (filteredUsers.length === 0) return null;
            return (
              <div key={category} className="border rounded-lg p-3 mb-2">
                <div className="font-semibold mb-2">{category}</div>
                <div className="space-y-1">
                  {filteredUsers.map((user) => (
                    <Button
                      key={user._id}
                      variant="outline"
                      className="w-full text-left"
                      onClick={() => onSelect(category)}
                    >
                      {user.full_name} ({user.email})
                      {user.price && (
                        <span className="ml-2 text-xs text-gray-500">₹{user.price}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;