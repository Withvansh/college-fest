import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}

const CategoryModal = ({ isOpen, onClose, onSelect }: CategoryModalProps) => {
  const categories = ['Technology', 'Design', 'Marketing', 'Writing', 'Business'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="w-full"
              onClick={() => onSelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;