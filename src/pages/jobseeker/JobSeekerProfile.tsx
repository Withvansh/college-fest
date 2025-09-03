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
  experience: WorkExperience[];
  education: Education[];
  testScores: TestScore[];
  publicProfile: boolean;
}

interface WorkExperience {
  _id?: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  skills_learned?: string[];
}

interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
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
  const [newExperience, setNewExperience] = useState<Partial<WorkExperience>>({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    skills_learned: [],
  });
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    gpa: '',
  });

  const loadProfile = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const res = await axios.get(`/user/${user._id}`);
      const data = res.data.user;
      console.log('User data:', data);

      // Map backend data to UserProfile shape
      setProfile({
        id: data._id,
        name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: data.skills || [],
        resumeUrl: data.resume_url || '',
        avatarUrl: data.avatar_url || '',
        experience: data.experience || [],
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
        resume_url: profile.resumeUrl,
        experience: profile.experience,
        education: profile.education,
        publicProfile: profile.publicProfile,
      };

      console.log('Saving payload:', payload);
      await axios.put(`/user/${user._id}`, payload);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating profile:', error);
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
      // Mock file upload - in real implementation, upload to server
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

  const handleAddExperience = () => {
    if (
      !newExperience.company_name ||
      !newExperience.position ||
      !newExperience.start_date ||
      !profile
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const experienceToAdd: WorkExperience = {
      _id: Date.now().toString(), // Temporary ID
      company_name: newExperience.company_name,
      position: newExperience.position,
      start_date: newExperience.start_date,
      end_date: newExperience.end_date,
      skills_learned: newExperience.skills_learned || [],
    };

    setProfile(prev =>
      prev
        ? {
            ...prev,
            experience: [...prev.experience, experienceToAdd],
          }
        : null
    );

    // Reset form
    setNewExperience({
      company_name: '',
      position: '',
      start_date: '',
      end_date: '',
      skills_learned: [],
    });
  };

  const handleRemoveExperience = (experienceId: string) => {
    setProfile(prev =>
      prev
        ? {
            ...prev,
            experience: prev.experience.filter(exp => exp._id !== experienceId),
          }
        : null
    );
  };

  const handleAddEducation = () => {
    if (
      !newEducation.institution ||
      !newEducation.degree ||
      !newEducation.field ||
      !newEducation.start_date ||
      !profile
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const educationToAdd: Education = {
      _id: Date.now().toString(), // Temporary ID
      institution: newEducation.institution,
      degree: newEducation.degree,
      field: newEducation.field,
      start_date: newEducation.start_date,
      end_date: newEducation.end_date,
      gpa: newEducation.gpa,
    };

    setProfile(prev =>
      prev
        ? {
            ...prev,
            education: [...prev.education, educationToAdd],
          }
        : null
    );

    // Reset form
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: '',
      gpa: '',
    });
  };

  const handleRemoveEducation = (educationId: string) => {
    setProfile(prev =>
      prev
        ? {
            ...prev,
            education: prev.education.filter(edu => edu._id !== educationId),
          }
        : null
    );
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Work Experience
                  </div>
                  {isEditing && (
                    <Button onClick={handleAddExperience} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.experience.map(exp => (
                    <div key={exp._id} className="border-l-2 border-blue-200 pl-4 relative">
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveExperience(exp._id!)}
                          className="absolute top-0 right-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="flex justify-between items-start mb-2 pr-10">
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-blue-600 font-medium">{exp.company_name}</p>
                        </div>
                        <Badge variant={!exp.end_date ? 'default' : 'secondary'}>
                          {!exp.end_date ? 'Current' : 'Past'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(exp.start_date).toLocaleDateString()} -{' '}
                        {!exp.end_date ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                      </p>
                      {exp.skills_learned && exp.skills_learned.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.skills_learned.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isEditing && (
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-4">Add New Experience</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="new-company">Company Name *</Label>
                            <Input
                              id="new-company"
                              value={newExperience.company_name}
                              onChange={e =>
                                setNewExperience(prev => ({
                                  ...prev,
                                  company_name: e.target.value,
                                }))
                              }
                              placeholder="Enter company name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-position">Position *</Label>
                            <Input
                              id="new-position"
                              value={newExperience.position}
                              onChange={e =>
                                setNewExperience(prev => ({ ...prev, position: e.target.value }))
                              }
                              placeholder="Enter position"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="new-start-date">Start Date *</Label>
                            <Input
                              id="new-start-date"
                              type="date"
                              value={newExperience.start_date}
                              onChange={e =>
                                setNewExperience(prev => ({ ...prev, start_date: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-end-date">End Date (leave empty if current)</Label>
                            <Input
                              id="new-end-date"
                              type="date"
                              value={newExperience.end_date}
                              onChange={e =>
                                setNewExperience(prev => ({ ...prev, end_date: e.target.value }))
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddExperience} className="w-full">
                          Add Experience
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Education
                  </div>
                  {isEditing && (
                    <Button onClick={handleAddEducation} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.education.map(edu => (
                    <div key={edu._id} className="border-l-2 border-green-200 pl-4 relative">
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveEducation(edu._id!)}
                          className="absolute top-0 right-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="pr-10">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-green-600 font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-600">
                          {edu.field} • {new Date(edu.start_date).toLocaleDateString()} -{' '}
                          {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isEditing && (
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-4">Add New Education</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="new-institution">Institution *</Label>
                            <Input
                              id="new-institution"
                              value={newEducation.institution}
                              onChange={e =>
                                setNewEducation(prev => ({ ...prev, institution: e.target.value }))
                              }
                              placeholder="Enter institution name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-degree">Degree *</Label>
                            <Input
                              id="new-degree"
                              value={newEducation.degree}
                              onChange={e =>
                                setNewEducation(prev => ({ ...prev, degree: e.target.value }))
                              }
                              placeholder="Enter degree"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="new-field">Field of Study *</Label>
                            <Input
                              id="new-field"
                              value={newEducation.field}
                              onChange={e =>
                                setNewEducation(prev => ({ ...prev, field: e.target.value }))
                              }
                              placeholder="Enter field of study"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-gpa">GPA (Optional)</Label>
                            <Input
                              id="new-gpa"
                              value={newEducation.gpa}
                              onChange={e =>
                                setNewEducation(prev => ({ ...prev, gpa: e.target.value }))
                              }
                              placeholder="Enter GPA"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="new-edu-start-date">Start Date *</Label>
                            <Input
                              id="new-edu-start-date"
                              type="date"
                              value={newEducation.start_date}
                              onChange={e =>
                                setNewEducation(prev => ({ ...prev, start_date: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-edu-end-date">
                              End Date (leave empty if current)
                            </Label>
                            <Input
                              id="new-edu-end-date"
                              type="date"
                              value={newEducation.end_date}
                              onChange={e =>
                                setNewEducation(prev => ({ ...prev, end_date: e.target.value }))
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddEducation} className="w-full">
                          Add Education
                        </Button>
                      </CardContent>
                    </Card>
                  )}
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
