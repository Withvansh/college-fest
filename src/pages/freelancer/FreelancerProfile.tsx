import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { User, Edit, Eye, Upload, Github, ExternalLink, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const FreelancerProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: 'Experienced full-stack developer with 5+ years in React, Node.js, and cloud technologies.',
    hourlyRate: 45,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    portfolioItems: [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution with React and Node.js',
        tags: ['React', 'Node.js', 'MongoDB'],
        link: 'https://github.com/example/ecommerce',
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'Created a collaborative task management tool',
        tags: ['TypeScript', 'Express', 'PostgreSQL'],
        link: 'https://taskmanager-demo.com',
      },
    ],
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skill],
      });
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your freelancer profile</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={isEditing ? 'default' : 'outline'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? 'Preview' : 'Edit Profile'}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/freelancer/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-purple-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                {isEditing ? (
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={e =>
                        setProfileData({ ...profileData, hourlyRate: Number(e.target.value) })
                      }
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profileData.hourlyRate}/hour</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{profileData.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => isEditing && handleSkillRemove(skill)}
                >
                  {skill}
                  {isEditing && <span className="ml-1 text-red-500">×</span>}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleSkillAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button variant="outline" size="sm">
                  Add Skill
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Portfolio
              {isEditing && (
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Portfolio Item
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {profileData.portfolioItems.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    {isEditing && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Project
                  </a>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;
