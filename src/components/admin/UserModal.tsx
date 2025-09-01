import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateUserData, UpdateUserData, User } from '@/lib/api/user';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData | UpdateUserData) => Promise<void>;
  user?: User | null;
  isLoading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: '',
    password: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    availableForRole: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Editing existing user
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || '',
        password: '', // Don't pre-fill password
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        availableForRole: user.availableForRole || '',
      });
    } else {
      // Creating new user
      setFormData({
        email: '',
        full_name: '',
        role: '',
        password: '',
        phone: '',
        location: '',
        bio: '',
        skills: '',
        availableForRole: '',
      });
    }
    setErrors({});
  }, [user, open]);

  const roles = [
    { value: 'jobseeker', label: 'Job Seeker' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'client', label: 'Client' },
    { value: 'college', label: 'College' },
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Admin' },
    { value: 'hr_admin', label: 'HR Admin' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }

    if (!user && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      email: formData.email.trim(),
      full_name: formData.full_name.trim(),
      role: formData.role,
      phone: formData.phone.trim() || undefined,
      location: formData.location.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : undefined,
      availableForRole: formData.availableForRole.trim() || undefined,
    };

    if (!user) {
      // Creating new user
      (userData as CreateUserData).password = formData.password;
    }

    try {
      await onSubmit(userData);
      onClose();
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              disabled={!!user} // Disable email editing for existing users
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={e => handleChange('full_name', e.target.value)}
              className={errors.full_name ? 'border-red-500' : ''}
            />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={value => handleChange('role', value)}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={e => handleChange('bio', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={e => handleChange('skills', e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableForRole">Available For Role</Label>
            <Input
              id="availableForRole"
              value={formData.availableForRole}
              onChange={e => handleChange('availableForRole', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : user ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
