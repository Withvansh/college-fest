import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { profilesApi } from '@/lib/api/profiles';
import { toast } from 'sonner';
import { Upload, X, Plus, User, MapPin, Phone, Mail, Briefcase } from 'lucide-react';

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
    experience_years: 0,
    education: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    company_name: '',
    company_size: '',
    college_name: '',
    student_id: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience_years: user.experience_years || 0,
        education: '',
        portfolio_url: '',
        linkedin_url: '',
        github_url: '',
        company_name: user.company_name || '',
        company_size: '',
        college_name: user.college_name || '',
        student_id: '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Upload avatar if provided
      if (avatarFile) {
        await profilesApi.uploadAvatar(user._id, avatarFile);
      }

      // Upload resume if provided
      if (resumeFile) {
        await profilesApi.uploadResume(user._id, resumeFile);
      }

      // Update profile
      await profilesApi.updateProfile(user._id, {
        ...formData,
        profile_complete: true,
      });

      await updateProfile({
        ...formData,
        name: formData.full_name,
        profile_complete: true,
      });

      toast.success('Profile updated successfully!');
      setAvatarFile(null);
      setResumeFile(null);
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!user) return null;

    switch (user.role) {
      case 'recruiter':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={e => handleInputChange('company_name', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Input
                  id="company_size"
                  value={formData.company_size}
                  onChange={e => handleInputChange('company_size', e.target.value)}
                  placeholder="e.g., 50-100 employees"
                />
              </div>
            </div>
          </>
        );

      case 'Student':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college_name">College Name</Label>
                <Input
                  id="college_name"
                  value={formData.college_name}
                  onChange={e => handleInputChange('college_name', e.target.value)}
                  placeholder="Your college/university name"
                />
              </div>
              <div>
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={e => handleInputChange('student_id', e.target.value)}
                  placeholder="Your student ID number"
                />
              </div>
            </div>
          </>
        );

      case 'jobseeker':
      case 'freelancer':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={e => handleInputChange('portfolio_url', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={e => handleInputChange('github_url', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={e => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          Complete Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar || ''} />
              <AvatarFallback>
                {formData.full_name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar">Profile Photo</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={e => handleInputChange('full_name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div>
            <Label htmlFor="bio">Professional Summary</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              rows={4}
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              value={formData.education}
              onChange={e => handleInputChange('education', e.target.value)}
              placeholder="Your educational background..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={e => handleInputChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          {/* Role-specific fields */}
          {renderRoleSpecificFields()}

          {/* Resume Upload */}
          <div>
            <Label htmlFor="resume">Upload Resume</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setResumeFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating Profile...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
