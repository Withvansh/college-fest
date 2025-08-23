import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Supabase removed

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface ProjectFormData {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  duration_days: number;
  skills_required: string[];
  project_type: string;
  experience_level: string;
  deadline: string;
}

const ProjectPostForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    budget_min: 0,
    budget_max: 0,
    duration_days: 0,
    skills_required: [],
    project_type: '',
    experience_level: '',
    deadline: '',
  });

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills_required.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, currentSkill.trim()],
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter(s => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to post a project');
      return;
    }

    if (user.role !== 'client') {
      toast.error('Only clients can post projects');
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        ...formData,
        client_id: user._id,
        budget_min: formData.budget_min || null,
        budget_max: formData.budget_max || null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        is_active: true,
      };

      // TODO: Implement actual project posting API call
      const result = { data: null, error: null };
      const { error } = result;

      if (error) {
        console.error('Project posting error:', error);
        toast.error('Failed to post project. Please try again.');
        return;
      }

      toast.success('Project posted successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        budget_min: 0,
        budget_max: 0,
        duration_days: 0,
        skills_required: [],
        project_type: '',
        experience_level: '',
        deadline: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Project posting error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Project</CardTitle>
        <CardDescription>Find the perfect freelancer for your project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Build a responsive website"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type *</Label>
              <Select
                value={formData.project_type}
                onValueChange={value => setFormData(prev => ({ ...prev, project_type: value }))}
              >
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

            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level *</Label>
              <Select
                value={formData.experience_level}
                onValueChange={value => setFormData(prev => ({ ...prev, experience_level: value }))}
              >
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

            <div className="space-y-2">
              <Label htmlFor="budget_min">Minimum Budget (₹)</Label>
              <Input
                id="budget_min"
                type="number"
                value={formData.budget_min || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, budget_min: parseInt(e.target.value) || 0 }))
                }
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_max">Maximum Budget (₹)</Label>
              <Input
                id="budget_max"
                type="number"
                value={formData.budget_max || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, budget_max: parseInt(e.target.value) || 0 }))
                }
                placeholder="2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_days">Duration (Days)</Label>
              <Input
                id="duration_days"
                type="number"
                value={formData.duration_days || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 0 }))
                }
                placeholder="30"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project requirements, goals, and deliverables..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex gap-2">
              <Input
                value={currentSkill}
                onChange={e => setCurrentSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills_required.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Posting Project...' : 'Post Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectPostForm;
