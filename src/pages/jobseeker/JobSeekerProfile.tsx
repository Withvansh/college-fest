import { useState, useEffect, useCallback } from 'react';
import axios from '../../lib/utils/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Plus,
  X,
  Eye,
  Download,
  Award,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  resumeUrl?: string;
  avatarUrl?: string;
  workExperience: WorkExperience[];
  education: Education[];
  testScores: TestScore[];
  publicProfile: boolean;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

interface TestScore {
  id: string;
  testName: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
}

const JobSeekerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const res = await axios.get(`/user/${user._id}`);
      const data = res.data.user;
      console.log(data.user);
      // Map backend data to UserProfile shape if needed
      setProfile({
        id: data._id,
        name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: data.skills || [],
        resumeUrl: data.resumeUrl || '',
        avatarUrl: data.avatar_url || '',
        workExperience: data.workExperience || [],
        education: data.education || [],
        testScores: data.testScores || [],
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
    // if (!profile || !user?.id) return;
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
        // Add workExperience, education, testScores, resumeUrl if supported by backend
      };
      await axios.put(`/user/${user?._id}`, payload);
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
      prev
        ? {
            ...prev,
            skills: [...prev.skills, newSkill.trim()],
          }
        : null
    );
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev =>
      prev
        ? {
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove),
          }
        : null
    );
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock file upload
      toast.success('Resume uploaded successfully!');
      setProfile(prev =>
        prev
          ? {
              ...prev,
              resumeUrl: URL.createObjectURL(file),
            }
          : null
      );
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
                to="/jobseeker/dashboard"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
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
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
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
                <p className="text-gray-600 mb-4">{profile.email}</p>

                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                </div>

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
                  <p className="text-xs text-gray-500">Allow recruiters to find your profile</p>
                </div>
              </CardContent>
            </Card>

            {/* Resume Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.resumeUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Current Resume</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3">No resume uploaded</p>
                )}

                {isEditing && (
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="mt-2"
                    />
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
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
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
                    <Button onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.workExperience.map(exp => (
                    <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <Badge variant={exp.current ? 'default' : 'secondary'}>
                          {exp.current ? 'Current' : 'Past'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.education.map(edu => (
                    <div key={edu.id} className="border-l-2 border-green-200 pl-4">
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-600">
                        {edu.field} • {edu.startDate} - {edu.endDate}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Test Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.testScores.map(test => (
                    <div key={test.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-2xl font-bold text-blue-600">{test.percentage}%</span>
                        <span className="text-sm text-gray-600">
                          {test.score}/{test.maxScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Completed: {new Date(test.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
