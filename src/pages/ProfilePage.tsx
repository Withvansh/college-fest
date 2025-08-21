import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { profilesApi } from '@/lib/api/profiles';
import { toast } from 'sonner';
import { Upload, X, Plus, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardsApi } from '@/lib/api/dashboards';

const ProfilePage = () => {
 const { user, updateProfile, loading } = useAuth();
const navigate = useNavigate(); // ✅ moved before any usage

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading your profile...</p>
    </div>
  );
}

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Please log in to access your profile.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Go to Login
        </Button>
      </div>
    </div>
  );
}
  const [formLoading, setFormLoading] = useState(false);
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
    institution_name: '',
    degree: '',
    placement_officer_contact: '',
    final_year_students: 0,
    hiring_needs: '',
    contact_info: '',
    website: '',
    project_description: '',
    budget_range: ''
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
        education: user.education || '',
        portfolio_url: user.portfolio_url || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        company_name: user.company_name || '',
        company_size: user.company_size || '',
        college_name: user.college_name || '',
        student_id: user.student_id || '',
        institution_name: user.institution_name || '',
        degree: user.degree || '',
        placement_officer_contact: user.placement_officer_contact || '',
        final_year_students: user.final_year_students || 0,
        hiring_needs: user.hiring_needs || '',
        contact_info: user.contact_info || '',
        website: user.website || '',
        project_description: user.project_description || '',
        budget_range: user.budget_range || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

setFormLoading(true);
    try {
      // Upload avatar if provided
      if (avatarFile) {
        await profilesApi.uploadAvatar(user.id, avatarFile);
      }

      // Upload resume if provided
      if (resumeFile) {
        await profilesApi.uploadResume(user.id, resumeFile);
      }

      // Update profile
      await profilesApi.updateProfile(user.id, {
        ...formData,
        profile_complete: true
      });

      await updateProfile({
        ...formData,
        name: formData.full_name,
        profileComplete: true
      });
      
      toast.success('Profile updated successfully!');
      setAvatarFile(null);
      setResumeFile(null);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
    setFormLoading(false);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'jobseeker': return '/jobseeker/dashboard';
      case 'recruiter': return '/recruiter/dashboard';
      case 'freelancer': return '/freelancer/dashboard';
      case 'client': return '/client/dashboard';
      case 'student': return '/student/dashboard';
      case 'college': return '/college/dashboard';
      default: return '/';
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
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Your company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Input
                  id="company_size"
                  value={formData.company_size}
                  onChange={(e) => handleInputChange('company_size', e.target.value)}
                  placeholder="e.g., 50-100 employees"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hiring_needs">Current Hiring Needs</Label>
                <Textarea
                  id="hiring_needs"
                  value={formData.hiring_needs}
                  onChange={(e) => handleInputChange('hiring_needs', e.target.value)}
                  placeholder="What positions are you looking to fill?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </>
        );
      
      case 'client':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company/Brand Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Your company or brand name"
                />
              </div>
              <div>
                <Label htmlFor="budget_range">Typical Budget Range</Label>
                <Input
                  id="budget_range"
                  value={formData.budget_range}
                  onChange={(e) => handleInputChange('budget_range', e.target.value)}
                  placeholder="e.g., ₹5,000 - ₹15,000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="project_description">Project Types</Label>
              <Textarea
                id="project_description"
                value={formData.project_description}
                onChange={(e) => handleInputChange('project_description', e.target.value)}
                placeholder="What types of projects do you typically work on?"
                rows={3}
              />
            </div>
          </>
        );
      
      case 'student':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college_name">University/College Name *</Label>
                <Input
                  id="college_name"
                  value={formData.college_name}
                  onChange={(e) => handleInputChange('college_name', e.target.value)}
                  placeholder="Your college/university name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  placeholder="Your student ID number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="degree">Degree/Course</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                placeholder="e.g., B.Tech Computer Science, MBA, etc."
              />
            </div>
          </>
        );
      
      case 'college':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institution_name">Institution Name *</Label>
                <Input
                  id="institution_name"
                  value={formData.institution_name}
                  onChange={(e) => handleInputChange('institution_name', e.target.value)}
                  placeholder="Your institution name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="placement_officer_contact">Placement Officer Contact</Label>
                <Input
                  id="placement_officer_contact"
                  value={formData.placement_officer_contact}
                  onChange={(e) => handleInputChange('placement_officer_contact', e.target.value)}
                  placeholder="Contact details for placement officer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="final_year_students">Number of Final Year Students</Label>
              <Input
                id="final_year_students"
                type="number"
                value={formData.final_year_students}
                onChange={(e) => handleInputChange('final_year_students', parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
              />
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
                  onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="Your highest qualification"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your profile.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to={getDashboardPath()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Complete your profile to get the most out of the platform</p>
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Role: <span className="font-semibold capitalize">{user?.role}</span>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar || ''} />
                  <AvatarFallback>
                    {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar">Profile Photo</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a profile picture (optional)</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State, Country"
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Summary</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
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
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>

              {/* Role-specific fields */}
              {renderRoleSpecificFields()}

              {/* Resume Upload for relevant roles */}
              {(['jobseeker', 'freelancer', 'student'].includes(user?.role || '')) && (
                <div>
                  <Label htmlFor="resume">Upload Resume</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload your latest resume (PDF, DOC, or DOCX)</p>
                </div>
              )}

             <Button type="submit" disabled={formLoading} className="w-full">
  {formLoading ? 'Updating Profile...' : 'Save Profile'}
</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
