import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ListYourselfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: any) => Promise<void> | void;
}

const ListYourselfModal = ({ isOpen, onClose, onSubmit }: ListYourselfModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rate: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Note: This endpoint may need to be updated to use the full API URL
        // Consider using axiosInstance for consistency
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to list service');
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List Yourself</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="rate">Hourly Rate</Label>
            <Input
              id="rate"
              type="number"
              value={formData.rate}
              onChange={e => setFormData({ ...formData, rate: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Listing...' : 'List Service'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListYourselfModal;
