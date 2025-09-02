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
  GraduationCap,
  FileText,
  Hash,
  School,
  Users,
  Building,
  Mail,
  Calendar,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '@/lib/utils/axios';

interface PlacementDrive {
  _id: string;
  company_name: string;
  job_role: string;
  location: string;
  drive_date: string;
  package: number;
  eligibility_criteria?: string;
  description?: string;
  status: string;
}

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
  skills?: string[];
  avatarUrl?: string;

  // JobSeeker specific
  resume_url?: string;
  experience?: number;

  // College specific
  college_name?: string;
  institute_code?: string;
  university_affiliation?: string;
  city?: string;
  state?: string;
  accreditation?: string;
  tpo_name?: string;
  tpo_email?: string;
  tpo_mobile?: string;
  course_branch?: string;
  total_students?: number;

  // Student specific (all fields from User model)
  enrollment_no?: string;
  course?: string;
  year?: number;
  department?: string;
  college_id?: string;
  cgpa?: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  date_of_birth?: Date;
  address?: string;
  pincode?: string;
  father_name?: string;
  mother_name?: string;
  emergency_contact?: string;
  blood_group?: string;
  profile_complete?: boolean;
  tenth_percentage?: number;
  twelfth_percentage?: number;
  graduation_percentage?: number;

  // Client specific
  company_name?: string;
  industry?: string;

  // Freelancer specific
  hourly_rate?: number;

  // Recruiter specific (base user with company info)
  companyName?: string;
  website?: string;

  // Common additional fields
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
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>([]);

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
        skills: ['jobseeker', 'freelancer', 'student'].includes(userRole) ? data.skills || [] : [],
        avatarUrl: data.avatar_url || '',

        // JobSeeker specific
        resume_url: data.resume_url || '',
        experience: data.experience || 0,

        // College specific
        college_name: data.college_name || '',
        institute_code: data.institute_code || '',
        university_affiliation: data.university_affiliation || '',
        city: data.city || '',
        state: data.state || '',
        accreditation: data.accreditation || '',
        tpo_name: data.tpo_name || '',
        tpo_email: data.tpo_email || '',
        tpo_mobile: data.tpo_mobile || '',
        course_branch: data.course_branch || '',
        total_students: data.total_students || 0,

        // Student specific (all fields from User model)
        enrollment_no: data.enrollment_no || '',
        course: data.course || '',
        year: data.year || 0,
        department: data.department || '',
        college_id: data.college_id || '',
        cgpa: data.cgpa || 0,
        linkedin_url: data.linkedin_url || '',
        github_url: data.github_url || '',
        portfolio_url: data.portfolio_url || '',
        date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
        address: data.address || '',
        pincode: data.pincode || '',
        father_name: data.father_name || '',
        mother_name: data.mother_name || '',
        emergency_contact: data.emergency_contact || '',
        blood_group: data.blood_group || '',
        profile_complete: data.profile_complete ?? false,
        tenth_percentage: data.tenth_percentage || 0,
        twelfth_percentage: data.twelfth_percentage || 0,
        graduation_percentage: data.graduation_percentage || 0,

        // Client specific
        company_name: data.company_name || '',
        industry: data.industry || '',

        // Freelancer specific
        hourly_rate: data.hourly_rate || 0,

        // Recruiter specific (using base user fields)
        companyName: data.companyName || '',
        website: data.website || '',

        publicProfile: data.publicProfile ?? true,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const loadPlacementDrives = useCallback(async () => {
    if (!user?._id || userRole !== 'student') return;

    try {
      const res = await axios.get(`/placement-drives/student/${user._id}`);
      setPlacementDrives(res.data.drives || []);
    } catch (error) {
      console.error('Error loading placement drives:', error);
      // Don't show error toast for placement drives as it's not critical
    }
  }, [user?._id, userRole]);

  useEffect(() => {
    if (user?._id) {
      loadProfile();
      if (userRole === 'student') {
        loadPlacementDrives();
      }
    }
  }, [user?._id, loadProfile, loadPlacementDrives, userRole]);

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
        avatar_url: profile.avatarUrl,
        publicProfile: profile.publicProfile,

        // Only include skills for JobSeeker, Freelancer, and Student
        ...(['jobseeker', 'freelancer', 'student'].includes(userRole) && {
          skills: profile.skills,
        }),

        // JobSeeker specific
        resume_url: profile.resume_url,
        experience: profile.experience,

        // College specific
        college_name: profile.college_name,
        institute_code: profile.institute_code,
        university_affiliation: profile.university_affiliation,
        city: profile.city,
        state: profile.state,
        accreditation: profile.accreditation,
        tpo_name: profile.tpo_name,
        tpo_email: profile.tpo_email,
        tpo_mobile: profile.tpo_mobile,
        course_branch: profile.course_branch,
        total_students: profile.total_students,

        // Student specific (all fields from User model)
        enrollment_no: profile.enrollment_no,
        course: profile.course,
        year: profile.year,
        department: profile.department,
        college_id: profile.college_id,
        cgpa: profile.cgpa,
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
        portfolio_url: profile.portfolio_url,
        date_of_birth: profile.date_of_birth,
        address: profile.address,
        pincode: profile.pincode,
        father_name: profile.father_name,
        mother_name: profile.mother_name,
        emergency_contact: profile.emergency_contact,
        blood_group: profile.blood_group,
        profile_complete: profile.profile_complete,
        tenth_percentage: profile.tenth_percentage,
        twelfth_percentage: profile.twelfth_percentage,
        graduation_percentage: profile.graduation_percentage,

        // Client specific
        company_name: profile.company_name,
        industry: profile.industry,

        // Freelancer specific
        hourly_rate: profile.hourly_rate,

        // Recruiter specific
        companyName: profile.companyName,
        website: profile.website,
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
    if (!newSkill.trim() || !profile || !['jobseeker', 'freelancer', 'student'].includes(userRole))
      return;

    if (profile.skills?.includes(newSkill.trim())) {
      toast.error('Skill already exists');
      return;
    }

    setProfile(prev =>
      prev ? { ...prev, skills: [...(prev.skills || []), newSkill.trim()] } : null
    );
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!['jobseeker', 'freelancer', 'student'].includes(userRole)) return;

    setProfile(prev =>
      prev
        ? { ...prev, skills: (prev.skills || []).filter(skill => skill !== skillToRemove) }
        : null
    );
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'jobseeker':
        return '/jobseeker/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'freelancer':
        return '/freelancer/dashboard';
      case 'client':
        return '/client/dashboard';
      case 'college':
        return '/college/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'jobseeker':
        return 'Job Seeker';
      case 'recruiter':
        return 'Recruiter';
      case 'freelancer':
        return 'Freelancer';
      case 'client':
        return 'Client';
      case 'college':
        return 'College';
      case 'student':
        return 'Student';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  const renderRoleSpecificFields = () => {
    if (!isEditing) return null;

    switch (userRole) {
      case 'jobseeker':
        return (
          <>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={profile?.experience || 0}
                onChange={e =>
                  setProfile(prev =>
                    prev ? { ...prev, experience: parseInt(e.target.value) || 0 } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="resume_url">Resume URL</Label>
              <Input
                id="resume_url"
                value={profile?.resume_url || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, resume_url: e.target.value } : null))
                }
              />
            </div>
          </>
        );

      case 'freelancer':
        return (
          <>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={profile?.hourly_rate || 0}
                onChange={e =>
                  setProfile(prev =>
                    prev ? { ...prev, hourly_rate: parseInt(e.target.value) || 0 } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input
                id="portfolio_url"
                value={profile?.portfolio_url || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, portfolio_url: e.target.value } : null))
                }
              />
            </div>
          </>
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
                  setProfile(prev => (prev ? { ...prev, companyName: e.target.value } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="website">Company Website</Label>
              <Input
                id="website"
                value={profile?.website || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, website: e.target.value } : null))
                }
              />
            </div>
          </>
        );

      case 'client':
        return (
          <>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={profile?.company_name || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, company_name: e.target.value } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={profile?.industry || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, industry: e.target.value } : null))
                }
              />
            </div>
          </>
        );

      case 'college':
        return (
          <>
            <div>
              <Label htmlFor="college_name">College Name</Label>
              <Input
                id="college_name"
                value={profile?.college_name || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, college_name: e.target.value } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="institute_code">Institute Code</Label>
              <Input
                id="institute_code"
                value={profile?.institute_code || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, institute_code: e.target.value } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="university_affiliation">University Affiliation</Label>
              <Input
                id="university_affiliation"
                value={profile?.university_affiliation || ''}
                onChange={e =>
                  setProfile(prev =>
                    prev ? { ...prev, university_affiliation: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="tpo_name">TPO Name</Label>
              <Input
                id="tpo_name"
                value={profile?.tpo_name || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, tpo_name: e.target.value } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="tpo_email">TPO Email</Label>
              <Input
                id="tpo_email"
                type="email"
                value={profile?.tpo_email || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, tpo_email: e.target.value } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="total_students">Total Students</Label>
              <Input
                id="total_students"
                type="number"
                value={profile?.total_students || 0}
                onChange={e =>
                  setProfile(prev =>
                    prev ? { ...prev, total_students: parseInt(e.target.value) || 0 } : null
                  )
                }
              />
            </div>
          </>
        );

      case 'student':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enrollment_no">Enrollment Number</Label>
                <Input
                  id="enrollment_no"
                  value={profile?.enrollment_no || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, enrollment_no: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={profile?.course || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, course: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="1"
                  max="4"
                  value={profile?.year || 0}
                  onChange={e =>
                    setProfile(prev =>
                      prev ? { ...prev, year: parseInt(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profile?.department || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, department: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="cgpa">CGPA (0-10)</Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={profile?.cgpa || 0}
                  onChange={e =>
                    setProfile(prev =>
                      prev ? { ...prev, cgpa: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={profile?.linkedin_url || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, linkedin_url: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={profile?.github_url || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, github_url: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={profile?.portfolio_url || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, portfolio_url: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={
                    profile?.date_of_birth ? profile.date_of_birth.toISOString().split('T')[0] : ''
                  }
                  onChange={e =>
                    setProfile(prev =>
                      prev
                        ? {
                            ...prev,
                            date_of_birth: e.target.value ? new Date(e.target.value) : undefined,
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="father_name">Father's Name</Label>
                <Input
                  id="father_name"
                  value={profile?.father_name || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, father_name: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="mother_name">Mother's Name</Label>
                <Input
                  id="mother_name"
                  value={profile?.mother_name || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, mother_name: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={profile?.emergency_contact || ''}
                  onChange={e =>
                    setProfile(prev =>
                      prev ? { ...prev, emergency_contact: e.target.value } : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="blood_group">Blood Group</Label>
                <Input
                  id="blood_group"
                  value={profile?.blood_group || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, blood_group: e.target.value } : null))
                  }
                />
              </div>
              <div>
                <Label htmlFor="tenth_percentage">10th Percentage</Label>
                <Input
                  id="tenth_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={profile?.tenth_percentage || 0}
                  onChange={e =>
                    setProfile(prev =>
                      prev ? { ...prev, tenth_percentage: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="twelfth_percentage">12th Percentage</Label>
                <Input
                  id="twelfth_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={profile?.twelfth_percentage || 0}
                  onChange={e =>
                    setProfile(prev =>
                      prev ? { ...prev, twelfth_percentage: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="graduation_percentage">Graduation Percentage</Label>
                <Input
                  id="graduation_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={profile?.graduation_percentage || 0}
                  onChange={e =>
                    setProfile(prev =>
                      prev
                        ? { ...prev, graduation_percentage: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={profile?.pincode || ''}
                  onChange={e =>
                    setProfile(prev => (prev ? { ...prev, pincode: e.target.value } : null))
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profile?.address || ''}
                onChange={e =>
                  setProfile(prev => (prev ? { ...prev, address: e.target.value } : null))
                }
                rows={3}
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
      case 'jobseeker':
        return (
          <>
            {profile?.experience !== undefined && profile.experience > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2" />
                <span>{profile.experience} years experience</span>
              </div>
            )}
            {profile?.resume_url && (
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
            )}
          </>
        );

      case 'freelancer':
        return (
          <>
            {profile?.hourly_rate && profile.hourly_rate > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>₹{profile.hourly_rate}/hour</span>
              </div>
            )}
            {profile?.portfolio_url && (
              <div className="flex items-center text-sm text-gray-600">
                <Code className="h-4 w-4 mr-2" />
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Portfolio
                </a>
              </div>
            )}
          </>
        );

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
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </>
        );

      case 'client':
        return (
          <>
            {profile?.company_name && (
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2" />
                <span>{profile.company_name}</span>
              </div>
            )}
            {profile?.industry && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{profile.industry}</span>
              </div>
            )}
          </>
        );

      case 'college':
        return (
          <>
            {profile?.college_name && (
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>{profile.college_name}</span>
              </div>
            )}
            {profile?.institute_code && (
              <div className="flex items-center text-sm text-gray-600">
                <Hash className="h-4 w-4 mr-2" />
                <span>Code: {profile.institute_code}</span>
              </div>
            )}
            {profile?.university_affiliation && (
              <div className="flex items-center text-sm text-gray-600">
                <School className="h-4 w-4 mr-2" />
                <span>{profile.university_affiliation}</span>
              </div>
            )}
            {profile?.tpo_name && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>TPO: {profile.tpo_name}</span>
              </div>
            )}
            {profile?.total_students && profile.total_students > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{profile.total_students} students</span>
              </div>
            )}
          </>
        );

      case 'student':
        return (
          <>
            {profile?.enrollment_no && (
              <div className="flex items-center text-sm text-gray-600">
                <Hash className="h-4 w-4 mr-2" />
                <span>Enrollment: {profile.enrollment_no}</span>
              </div>
            )}
            {profile?.course && (
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{profile.course}</span>
              </div>
            )}
            {profile?.year && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2" />
                <span>Year {profile.year}</span>
              </div>
            )}
            {profile?.department && (
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-2" />
                <span>{profile.department}</span>
              </div>
            )}
            {profile?.cgpa && profile.cgpa > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>CGPA: {profile.cgpa.toFixed(2)}</span>
              </div>
            )}
            {profile?.linkedin_url && (
              <div className="flex items-center text-sm text-gray-600">
                <Code className="h-4 w-4 mr-2" />
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {profile?.github_url && (
              <div className="flex items-center text-sm text-gray-600">
                <Code className="h-4 w-4 mr-2" />
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Profile
                </a>
              </div>
            )}
            {profile?.portfolio_url && (
              <div className="flex items-center text-sm text-gray-600">
                <Eye className="h-4 w-4 mr-2" />
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
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
                <Badge variant="secondary" className="mb-4">
                  {getRoleDisplayName()}
                </Badge>

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
                        : 'Allow clients to find your profile'}
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

            {/* Skills - Only for JobSeeker, Freelancer and Student */}
            {(userRole === 'jobseeker' || userRole === 'freelancer' || userRole === 'student') && (
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
            )}

            {/* Placement Drives - Only for Students */}
            {userRole === 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Placement Drives</CardTitle>
                </CardHeader>
                <CardContent>
                  {placementDrives.length > 0 ? (
                    <div className="space-y-4">
                      {placementDrives.map(drive => (
                        <div key={drive._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{drive.company_name}</h3>
                            <Badge variant={drive.status === 'active' ? 'default' : 'secondary'}>
                              {drive.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{drive.job_role}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{drive.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(drive.drive_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span>₹{drive.package} LPA</span>
                            </div>
                            {drive.eligibility_criteria && (
                              <div className="flex items-center">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                <span>{drive.eligibility_criteria}</span>
                              </div>
                            )}
                          </div>
                          {drive.description && (
                            <p className="text-gray-600 mt-2 text-sm">{drive.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No placement drives available for your college at the moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalProfile;
