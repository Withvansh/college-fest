import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Upload,
  Building2,
  Code,
  DollarSign,
  Globe,
  Mail,
  Users,
  TrendingUp,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '@/lib/utils/axios';

/**
 * Interface for the startup profile state in the frontend.
 * Based on the IStartup interface from the backend User model.
 */
export interface StartupProfile {
  id: string;
  full_name: string;
  email: string;
  startup_name: string;
  founder_name?: string;
  industry?: string;
  website?: string;
  location?: string;
  phone?: string;
  description?: string;
  funding_stage?: string;
  employees_count?: number;
  logo_url?: string;
  publicProfile?: boolean;
  hiring: boolean;
}

const StartupProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const res = await axios.get(`/user/${user._id}`);
      const data = res.data.user;

      setProfile({
        id: data._id,
        full_name: data.full_name || '',
        email: data.email || '',
        startup_name: data.startup_name || '',
        founder_name: data.founder_name || '',
        industry: data.industry || '',
        website: data.website || '',
        location: data.location || '',
        phone: data.phone || '',
        description: data.description || '',
        funding_stage: data.funding_stage || '',
        employees_count: data.employees_count || 0,
        logo_url: data.logo_url || '',
        publicProfile: data.publicProfile ?? true,
        hiring: data.hiring ?? false,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      loadProfile();
    }
  }, [user?._id, loadProfile]);

  const handleSaveProfile = async () => {
    if (!profile || !user?._id) return;
    setSaving(true);
    try {
      const payload = {
        full_name: profile.full_name,
        email: profile.email,
        startup_name: profile.startup_name,
        founder_name: profile.founder_name,
        industry: profile.industry,
        website: profile.website,
        location: profile.location,
        phone: profile.phone,
        description: profile.description,
        funding_stage: profile.funding_stage,
        employees_count: profile.employees_count,
        logo_url: profile.logo_url,
        publicProfile: profile.publicProfile,
        hiring: profile.hiring, // Added hiring to the payload
      };

      // Clean the payload by removing any keys with 'undefined' values
      Object.keys(payload).forEach(key => {
        if ((payload as any)[key] === undefined) {
          delete (payload as any)[key];
        }
      });

      await axios.put(`/user/${user._id}`, payload);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getDashboardPath = () => {
    return '/startup/dashboard';
  };

  const fundingStages = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D+',
    'IPO',
    'Acquired',
    'Bootstrapped',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Gaming',
    'Social Media',
    'Enterprise Software',
    'Consumer Apps',
    'Artificial Intelligence',
    'Blockchain',
    'Cybersecurity',
    'Digital Marketing',
    'Cloud Services',
    'Mobile Development',
    'Web Development',
    'Data Analytics',
    'IoT',
    'Renewable Energy',
    'Biotech',
    'Other',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(getDashboardPath())}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Startup Profile
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="company">Company Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-4">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt="Company Logo"
                      className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  )}
                </div>

                {/* Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={e =>
                          setProfile(prev => (prev ? { ...prev, full_name: e.target.value } : null))
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700">
                        {profile.full_name || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={e =>
                          setProfile(prev => (prev ? { ...prev, email: e.target.value } : null))
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {profile.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profile.phone || ''}
                        onChange={e =>
                          setProfile(prev => (prev ? { ...prev, phone: e.target.value } : null))
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.phone || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profile.location || ''}
                        onChange={e =>
                          setProfile(prev => (prev ? { ...prev, location: e.target.value } : null))
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {profile.location || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Details Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Startup Name and Founder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startup_name">Startup Name</Label>
                    {isEditing ? (
                      <Input
                        id="startup_name"
                        value={profile.startup_name}
                        onChange={e =>
                          setProfile(prev =>
                            prev ? { ...prev, startup_name: e.target.value } : null
                          )
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700">
                        {profile.startup_name || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="founder_name">Founder Name</Label>
                    {isEditing ? (
                      <Input
                        id="founder_name"
                        value={profile.founder_name || ''}
                        onChange={e =>
                          setProfile(prev =>
                            prev ? { ...prev, founder_name: e.target.value } : null
                          )
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {profile.founder_name || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Industry and Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    {isEditing ? (
                      <select
                        id="industry"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profile.industry || ''}
                        onChange={e =>
                          setProfile(prev => (prev ? { ...prev, industry: e.target.value } : null))
                        }
                      >
                        <option value="">Select Industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {profile.industry || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        type="url"
                        value={profile.website || ''}
                        onChange={e =>
                          setProfile(prev => (prev ? { ...prev, website: e.target.value } : null))
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        {profile.website ? (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.website}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Funding Stage and Employees Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="funding_stage">Funding Stage</Label>
                    {isEditing ? (
                      <select
                        id="funding_stage"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profile.funding_stage || ''}
                        onChange={e =>
                          setProfile(prev =>
                            prev ? { ...prev, funding_stage: e.target.value } : null
                          )
                        }
                      >
                        <option value="">Select Funding Stage</option>
                        {fundingStages.map(stage => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {profile.funding_stage || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees_count">Number of Employees</Label>
                    {isEditing ? (
                      <Input
                        id="employees_count"
                        type="number"
                        min="0"
                        value={profile.employees_count || ''}
                        onChange={e =>
                          setProfile(prev =>
                            prev
                              ? { ...prev, employees_count: parseInt(e.target.value) || 0 }
                              : null
                          )
                        }
                      />
                    ) : (
                      <div className="p-2 text-sm text-gray-700 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {profile.employees_count || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      rows={4}
                      value={profile.description || ''}
                      onChange={e =>
                        setProfile(prev => (prev ? { ...prev, description: e.target.value } : null))
                      }
                      placeholder="Tell us about your startup, your mission, and what makes you unique..."
                    />
                  ) : (
                    <div className="p-3 text-sm text-gray-700 min-h-[100px] bg-gray-50 rounded-md">
                      {profile.description ||
                        'No description provided yet. Add a compelling description of your startup to attract top talent!'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-600">
                      Make your startup profile visible to job seekers and potential partners
                    </p>
                  </div>
                  <Switch
                    checked={profile.publicProfile}
                    onCheckedChange={checked =>
                      setProfile(prev => (prev ? { ...prev, publicProfile: checked } : null))
                    }
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Hiring Status Toggle */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-medium">Hiring Status</h4>
                    <p className="text-sm text-gray-600">
                      {profile.hiring 
                        ? 'Your profile shows that you are currently hiring' 
                        : 'Your profile shows that you are not currently hiring'
                      }
                    </p>
                  </div>
                  <Switch
                    checked={profile.hiring}
                    onCheckedChange={checked =>
                      setProfile(prev => (prev ? { ...prev, hiring: checked } : null))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupProfile;