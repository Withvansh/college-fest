import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { unifiedAuthService } from '@/services/unifiedAuth';

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        full_name: name,
        phone,
        bio,
        profile_complete: true,
      });

      // Use unified auth system to get correct dashboard route
      const dashboardRoute = user?.role ? unifiedAuthService.getDashboardRoute(user.role) : '/';
      console.log(`🎯 Profile complete! Redirecting to: ${dashboardRoute}`);
      navigate(dashboardRoute);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          <p className="text-gray-600 text-center">
            We need a few more details to personalize your experience
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              type="tel"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
            <Input
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>

          <Button onClick={handleSave} disabled={loading || !name.trim()} className="w-full">
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
