import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import { contactApi } from '@/lib/api/contact';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  number: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long'),
  email: z.string().email('Please enter a valid email address'),
  designation: z.enum(
    ['student', 'jobseeker', 'college', 'recruiter', 'client', 'freelancer', 'startup'],
    {
      errorMap: () => ({ message: 'Please select a valid designation' }),
    }
  ),
  organization: z.enum(['University', 'Company', 'College', 'Startup', 'Individual'], {
    errorMap: () => ({ message: 'Please select a valid organization type' }),
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormPopupProps {
  onSubmit?: () => void;
}

const ContactFormPopup = ({ onSubmit }: ContactFormPopupProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactApi.submitContactForm(data as any);
      setIsSubmitted(true);
      if (onSubmit) {
        onSubmit();
      }
      toast.success('Thank you for joining our community!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Thank you for joining the community
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Early access to the platform is already shared to 1 lakh users. Soon, we will
                  revert you with an email when we open it for all.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Join Our Community</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Fill out the form below to get early access</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Phone Number *</Label>
              <Input
                id="number"
                type="tel"
                {...register('number')}
                className={errors.number ? 'border-red-500' : ''}
                placeholder="Enter your phone number"
              />
              {errors.number && <p className="text-sm text-red-500">{errors.number.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.designation ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="jobseeker">Job Seeker</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.designation && (
                <p className="text-sm text-red-500">{errors.designation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization Type *</Label>
              <Controller
                name="organization"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.organization ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="Individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.organization && (
                <p className="text-sm text-red-500">{errors.organization.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Join Community'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactFormPopup;
