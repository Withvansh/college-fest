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
  Plus,
  Upload,
  Briefcase,
  BookOpen,
  Award,
  Eye,
  Building2,
  Code,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '@/lib/utils/axios';

interface UniversalProfileProps {
  userRole: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
  // Role-specific fields
  hourlyRate?: number;
  companyName?: string;
  website?: string;
  collegeName?: string;
  degree?: string;
  graduationYear?: string;
  publicProfile?: boolean;
}

const UniversalProfile = ({ userRole }: UniversalProfileProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const loadProfile = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const res = await axios.get(`/user/${user._id}`);
      const data = res.data.user;
      
      setProfile({
        id: data._id,
        name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: data.skills || [],
        avatarUrl: data.avatar_url || '',
        hourlyRate: data.hourlyRate || 0,
        companyName: data.companyName || '',
        website: data.website || '',
        collegeName: data.collegeName || '',
        degree: data.degree || '',
        graduationYear: data.graduationYear || '',
        publicProfile: data.publicProfile ?? true,
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
        full_name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        skills: profile.skills,
        avatar_url: profile.avatarUrl,
        publicProfile: profile.publicProfile,
        hourlyRate: profile.hourlyRate,
        companyName: profile.companyName,
        website: profile.website,
        collegeName: profile.collegeName,
        degree: profile.degree,
        graduationYear: profile.graduationYear,
      };
      await axios.put(`/user/${user._id}`, payload);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;

    if (profile.skills.includes(newSkill.trim())) {
      toast.error('Skill already exists');
      return;
    }

    setProfile(prev =>
      prev ? { ...prev, skills: [...prev.skills, newSkill.trim()] } : null
    );
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev =>
      prev
        ? { ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }
        : null
    );
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'jobseeker': return '/jobseeker/dashboard';
      case 'recruiter': return '/recruiter/dashboard';
      case 'freelancer': return '/freelancer/dashboard';
      case 'client': return '/client/dashboard';
      case 'college': return '/college/dashboard';
      case 'student': return '/student/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'jobseeker': return 'Job Seeker';
      case 'recruiter': return 'Recruiter';
      case 'freelancer': return 'Freelancer';
      case 'client': return 'Client';
      case 'college': return 'College';
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const renderRoleSpecificFields = () => {
    if (!isEditing) return null;

    switch (userRole) {
      case 'freelancer':
        return (
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
            <Input
              id="hourlyRate"
              type="number"
              value={profile?.hourlyRate || 0}
              onChange={e =>
                setProfile(prev => 
                  prev ? { ...prev, hourlyRate: parseInt(e.target.value) || 0 } : null
                )
              }
            />
          </div>
        );
      
      case 'recruiter':
        return (
          <>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={profile?.companyName || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, companyName: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="website">Company Website</Label>
              <Input
                id="website"
                value={profile?.website || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, website: e.target.value } : null
                  )
                }
              />
            </div>
          </>
        );

      case 'college':
        return (
          <>
            <div>
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                value={profile?.collegeName || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, collegeName: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="website">College Website</Label>
              <Input
                id="website"
                value={profile?.website || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, website: e.target.value } : null
                  )
                }
              />
            </div>
          </>
        );

      case 'student':
        return (
          <>
            <div>
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                value={profile?.collegeName || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, collegeName: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={profile?.degree || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, degree: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                value={profile?.graduationYear || ''}
                onChange={e =>
                  setProfile(prev => 
                    prev ? { ...prev, graduationYear: e.target.value } : null
                  )
                }
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderRoleSpecificDisplay = () => {
    if (isEditing) return null;

    switch (userRole) {
      case 'freelancer':
        return profile?.hourlyRate ? (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>₹{profile.hourlyRate}/hour</span>
          </div>
        ) : null;
      
      case 'recruiter':
        return (
          <>
            {profile?.companyName && (
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2" />
                <span>{profile.companyName}</span>
              </div>
            )}
            {profile?.website && (
              <div className="flex items-center text-sm text-gray-600">
                <Code className="h-4 w-4 mr-2" />
                <span>{profile.website}</span>
              </div>
            )}
          </>
        );

      case 'college':
        return (
          <>
            {profile?.collegeName && (
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>{profile.collegeName}</span>
              </div>
            )}
            {profile?.website && (
              <div className="flex items-center text-sm text-gray-600">
                <Code className="h-4 w-4 mr-2" />
                <span>{profile.website}</span>
              </div>
            )}
          </>
        );

      case 'student':
        return (
          <>
            {profile?.collegeName && (
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>{profile.collegeName}</span>
              </div>
            )}
            {profile?.degree && (
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{profile.degree}</span>
              </div>
            )}
            {profile?.graduationYear && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2" />
                <span>Class of {profile.graduationYear}</span>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getRoleDisplayName()} Profile</h1>
                <p className="text-gray-600">Manage your professional information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <Badge variant="secondary" className="mb-4">{getRoleDisplayName()}</Badge>

                <div className="space-y-2 text-sm text-left">
                  {profile.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {renderRoleSpecificDisplay()}
                </div>

                {(userRole === 'jobseeker' || userRole === 'freelancer') && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Public Profile</span>
                      <Switch
                        checked={profile.publicProfile}
                        onCheckedChange={checked =>
                          setProfile(prev => (prev ? { ...prev, publicProfile: checked } : null))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {userRole === 'jobseeker' 
                        ? 'Allow recruiters to find your profile'
                        : 'Allow clients to find your profile'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={e =>
                        setProfile(prev => (prev ? { ...prev, name: e.target.value } : null))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={e =>
                        setProfile(prev => (prev ? { ...prev, email: e.target.value } : null))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={e =>
                        setProfile(prev => (prev ? { ...prev, phone: e.target.value } : null))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={e =>
                        setProfile(prev => (prev ? { ...prev, location: e.target.value } : null))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={e =>
                      setProfile(prev => (prev ? { ...prev, bio: e.target.value } : null))
                    }
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
                {renderRoleSpecificFields()}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="relative group">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalProfile;
