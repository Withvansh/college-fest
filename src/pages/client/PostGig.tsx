
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, DollarSign, Clock, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

const PostGig = () => {
  const { user: authUser } = useAuth();
  const { user: localUser } = useLocalAuth();
  const user = authUser || localUser;
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetType: 'fixed',
    budgetMin: '',
    budgetMax: '',
    duration: '',
    skillsRequired: [] as string[],
    milestones: [{ title: '', description: '', amount: '' }],
    projectType: '',
    experienceLevel: ''
  });

  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill)
    });
  };

  const handleAddMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: '', description: '', amount: '' }]
    });
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index)
    });
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updatedMilestones = formData.milestones.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    );
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to post a gig');
      return;
    }

    if (user.role !== 'client' && localUser?.name !== 'Demo Client') {
      toast.error('Only clients can post gigs');
      return;
    }

    setIsLoading(true);

    try {
      let clientId;
      
      // For authenticated users (Supabase auth), use their user ID
      if (authUser) {
        clientId = authUser.id;
      } 
      // For local demo users, use predefined IDs
      else if (localUser) {
        clientId = localUser.id === 'demo-client-1' ? '00000000-0000-4000-8000-000000000002' : localUser.id;
      } 
      else {
        toast.error('You must be logged in to post a gig');
        return;
      }

      const gigData = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : null,
        budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : null,
        duration_days: formData.duration ? parseInt(formData.duration) : null,
        skills_required: formData.skillsRequired,
        project_type: formData.projectType || 'other',
        experience_level: formData.experienceLevel || 'intermediate',
        client_id: clientId,
        is_active: true,
        created_at: new Date().toISOString()
      };

      // Mock API call - in real app, call your API
      console.log('✅ Gig posted successfully:', gigData);
      toast.success("Gig posted successfully! Freelancers can now submit proposals.");
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        budgetType: 'fixed',
        budgetMin: '',
        budgetMax: '',
        duration: '',
        skillsRequired: [],
        milestones: [{ title: '', description: '', amount: '' }],
        projectType: '',
        experienceLevel: ''
      });
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/client/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Post New Gig</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gig Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Build a React.js Dashboard"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <Select value={formData.projectType} onValueChange={(value) => setFormData({...formData, projectType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web_development">Web Development</SelectItem>
                      <SelectItem value="mobile_development">Mobile Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="data_science">Data Science</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({...formData, experienceLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project requirements, goals, and any specific details..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Type
                </label>
                <Select value={formData.budgetType} onValueChange={(value) => setFormData({...formData, budgetType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (₹)
                  </label>
                  <Input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (₹)
                  </label>
                  <Input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                    placeholder="1500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Duration (days)
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="30"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React.js)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{skill}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Project Milestones
                </CardTitle>
                <Button type="button" onClick={handleAddMilestone} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Milestone {index + 1}</h4>
                    {formData.milestones.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Milestone Title
                      </label>
                      <Input
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                        placeholder="e.g., UI Design Phase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)
                      </label>
                      <Input
                        type="number"
                        value={milestone.amount}
                        onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                        placeholder="500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      value={milestone.description}
                      onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                      placeholder="Describe what should be delivered in this milestone..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link to="/client/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting Gig...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Post Gig
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostGig;
