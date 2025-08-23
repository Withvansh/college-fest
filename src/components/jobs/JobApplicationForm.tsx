import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi } from '@/lib/api/applications';
import { profilesApi } from '@/lib/api/profiles';
import { toast } from 'sonner';
import { Upload, FileText, User } from 'lucide-react';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
}

const JobApplicationForm = ({ jobId, jobTitle, onSuccess }: JobApplicationFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let resumeUrl = '';

      // Upload resume if provided
      if (resumeFile) {
        const uploadResult = await profilesApi.uploadResume(user._id, resumeFile);
        resumeUrl = uploadResult;
      }

      // Submit application
      await applicationsApi.applyToJob({
        job_id: jobId,
        applicant_id: user._id,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        status: 'applied',
      });

      toast.success('Application submitted successfully!');
      setCoverLetter('');
      setResumeFile(null);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error('Application error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Apply for {jobTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="resume">Upload Resume (Optional)</Label>
            <div className="mt-2">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => setResumeFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {resumeFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  {resumeFile.name}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobApplicationForm;
