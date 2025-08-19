
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Settings as SettingsIcon, Palette, Trash2, Upload } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@minutehire.com',
    avatar: ''
  });

  const [platformSettings, setPlatformSettings] = useState({
    allowHROnboarding: true,
    jobApprovalRequired: true,
    autoAssignTests: false,
    emailNotifications: true
  });

  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
  };

  const handleSavePlatformSettings = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Settings Saved",
      description: "Platform settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and platform preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      This action cannot be undone. This will permanently delete your account and all associated data.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Platform Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow HR Onboarding</Label>
                  <p className="text-sm text-gray-500">HR admins can onboard new employees</p>
                </div>
                <Switch
                  checked={platformSettings.allowHROnboarding}
                  onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, allowHROnboarding: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Job Approval Required</Label>
                  <p className="text-sm text-gray-500">All job postings require admin approval</p>
                </div>
                <Switch
                  checked={platformSettings.jobApprovalRequired}
                  onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, jobApprovalRequired: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-assign Tests</Label>
                  <p className="text-sm text-gray-500">Automatically assign tests to job applications</p>
                </div>
                <Switch
                  checked={platformSettings.autoAssignTests}
                  onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, autoAssignTests: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for platform activities</p>
                </div>
                <Switch
                  checked={platformSettings.emailNotifications}
                  onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, emailNotifications: checked })}
                />
              </div>

              <Button onClick={handleSavePlatformSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <div className="flex gap-4 mt-2">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="w-20 h-12 bg-white border rounded mb-2"></div>
                    <p className="text-sm font-medium">Light</p>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="w-20 h-12 bg-gray-800 border rounded mb-2"></div>
                    <p className="text-sm font-medium">Dark</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
