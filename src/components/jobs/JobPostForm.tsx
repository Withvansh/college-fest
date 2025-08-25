import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { jobFormSchema, type JobFormData } from '@/lib/validation/jobValidation';
import { recruiterDashboardsApi, type Job } from '@/lib/api/recruiter-dashboard';

const JobPostForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');

  const defaultCompanyName =
    user?.full_name === 'Demo HR Manager' || user?.role === 'recruiter' ? 'TechCorp Inc.' : '';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      company_name: defaultCompanyName,
      location: '',
      job_type: 'full_time',
      salary_min: undefined,
      salary_max: undefined,
      experience_required: 0,
      skills_required: [],
      benefits: [],
      remote_allowed: false,
      application_deadline: '',
    },
  });

  const watchedSkills = watch('skills_required') || [];
  const watchedBenefits = watch('benefits') || [];

  const addSkill = () => {
    if (currentSkill.trim() && !watchedSkills.includes(currentSkill.trim())) {
      setValue('skills_required', [...watchedSkills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      'skills_required',
      watchedSkills.filter(s => s !== skill)
    );
  };

  const addBenefit = () => {
    if (currentBenefit.trim() && !watchedBenefits.includes(currentBenefit.trim())) {
      setValue('benefits', [...watchedBenefits, currentBenefit.trim()]);
      setCurrentBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setValue(
      'benefits',
      watchedBenefits.filter(b => b !== benefit)
    );
  };

  const onSubmit = async (data: JobFormData) => {
    if (!user) {
      toast.error('You must be logged in to post a job');
      return;
    }

    console.log('Current user:', user);

    try {
      let recruiterId;

      // Use the current user's ID as recruiter ID
      if (user) {
        recruiterId = user._id;
        console.log('Using user ID as recruiter_id:', recruiterId);
      } else {
        toast.error('You must be logged in to post a job');
        return;
      }

      // Prepare job data for backend
      const jobData = {
        title: data.title,
        description: data.description,
        requirements: data.requirements, // Keep as string for backend
        company_name: data.company_name,
        location: data.location,
        job_type: data.job_type as Job['job_type'],
        employment_type: data.job_type,
        min_salary: data.salary_min || undefined,
        max_salary: data.salary_max || undefined,
        currency: 'INR',
        experience_required: data.experience_required,
        experience_level:
          data.experience_required <= 2
            ? 'entry'
            : data.experience_required <= 5
              ? 'mid'
              : 'senior',
        skills_required: data.skills_required,
        benefits: data.benefits,
        remote_allowed: data.remote_allowed,
        recruiter_id: recruiterId,
        application_deadline: data.application_deadline
          ? new Date(data.application_deadline)
          : undefined,
        status: 'active' as const,
      };

      console.log('Creating job with data:', jobData);

      // Create job using backend API
      const createdJob = await recruiterDashboardsApi.createJob(jobData);

      console.log('✅ Job created successfully:', createdJob);
      toast.success('Job posted successfully!');

      // Reset form
      reset({
        title: '',
        description: '',
        requirements: '',
        company_name: defaultCompanyName,
        location: '',
        job_type: 'full_time',
        salary_min: undefined,
        salary_max: undefined,
        experience_required: 0,
        skills_required: [],
        benefits: [],
        remote_allowed: false,
        application_deadline: '',
      });

      // Redirect to the created job page
      if (createdJob && createdJob._id) {
        console.log('Redirecting to job details page:', `/jobs/${createdJob._id}`);
        setTimeout(() => {
          navigate(`/jobs/${createdJob._id}`);
        }, 1000); // Small delay to show success message
      }

      // Also call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error creating job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job';
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>Fill out the details to create a job posting</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>Please fix the errors below before submitting.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                className={errors.company_name ? 'border-destructive' : ''}
              />
              {errors.company_name && (
                <p className="text-sm text-destructive">{errors.company_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register('location')}
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type *</Label>
              <Controller
                name="job_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.job_type && (
                <p className="text-sm text-destructive">{errors.job_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_min">Minimum Salary</Label>
              <Input
                id="salary_min"
                type="number"
                {...register('salary_min', { valueAsNumber: true })}
                className={errors.salary_min ? 'border-destructive' : ''}
              />
              {errors.salary_min && (
                <p className="text-sm text-destructive">{errors.salary_min.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_max">Maximum Salary</Label>
              <Input
                id="salary_max"
                type="number"
                {...register('salary_max', { valueAsNumber: true })}
                className={errors.salary_max ? 'border-destructive' : ''}
              />
              {errors.salary_max && (
                <p className="text-sm text-destructive">{errors.salary_max.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_required">Years of Experience Required</Label>
              <Input
                id="experience_required"
                type="number"
                {...register('experience_required', { valueAsNumber: true })}
                className={errors.experience_required ? 'border-destructive' : ''}
              />
              {errors.experience_required && (
                <p className="text-sm text-destructive">{errors.experience_required.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_deadline">Application Deadline</Label>
              <Input
                id="application_deadline"
                type="date"
                {...register('application_deadline')}
                className={errors.application_deadline ? 'border-destructive' : ''}
              />
              {errors.application_deadline && (
                <p className="text-sm text-destructive">{errors.application_deadline.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements *</Label>
            <Textarea
              id="requirements"
              {...register('requirements')}
              className={errors.requirements ? 'border-destructive' : ''}
              rows={4}
            />
            {errors.requirements && (
              <p className="text-sm text-destructive">{errors.requirements.message}</p>
            )}
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
              {watchedSkills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
            {errors.skills_required && (
              <p className="text-sm text-destructive">{errors.skills_required.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Benefits</Label>
            <div className="flex gap-2">
              <Input
                value={currentBenefit}
                onChange={e => setCurrentBenefit(e.target.value)}
                placeholder="Add a benefit"
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {watchedBenefits.map(benefit => (
                <Badge key={benefit} variant="secondary" className="flex items-center gap-1">
                  {benefit}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeBenefit(benefit)} />
                </Badge>
              ))}
            </div>
            {errors.benefits && (
              <p className="text-sm text-destructive">{errors.benefits.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="remote_allowed"
              control={control}
              render={({ field }) => (
                <Switch
                  id="remote_allowed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="remote_allowed">Remote work allowed</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Job...
              </>
            ) : (
              'Post Job'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;
