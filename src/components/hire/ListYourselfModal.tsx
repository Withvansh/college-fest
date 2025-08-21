import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ListYourselfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListYourselfModal = ({ isOpen, onClose }: ListYourselfModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rate: '',
    skills: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Listing yourself:', formData);
    onClose();
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
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="rate">Hourly Rate</Label>
            <Input
              id="rate"
              type="number"
              value={formData.rate}
              onChange={(e) => setFormData({...formData, rate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full">List Service</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListYourselfModal;