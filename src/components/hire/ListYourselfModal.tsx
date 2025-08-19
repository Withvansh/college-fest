import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const listYourselfSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Age seems too high'),
  gender: z.enum(['male', 'female', 'other']),
  location: z.string().min(2, 'Location is required'),
  job_category: z.string().min(1, 'Please select a job category'),
  experience_years: z.number().min(0, 'Experience cannot be negative'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

export type ListYourselfFormData = z.infer<typeof listYourselfSchema>;

interface ListYourselfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListYourselfModal: React.FC<ListYourselfModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ListYourselfFormData>({
    resolver: zodResolver(listYourselfSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      age: 18,
      gender: 'male',
      location: '',
      job_category: '',
      experience_years: 0,
      bio: '',
    },
  });

  const onSubmit = async (values: ListYourselfFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('hire_profiles').insert([
  {
    name: values.name,
    email: values.email,
    phone: values.phone,
    age: values.age,
    gender: values.gender,
    location: values.location,
    job_category: values.job_category,
    experience_years: values.experience_years,
    bio: values.bio,
    rating: 0,
    is_active: true,
  },
]);

      if (error) {
        console.error(error);
        toast.error('Failed to list yourself');
      } else {
        toast.success('You have been successfully listed!');
        onClose();
        form.reset();
      }
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent
    className="sm:max-w-md max-h-[90vh] overflow-y-auto"
    aria-describedby="list-yourself-description"
  >
    <DialogHeader>
      <DialogTitle className="text-center">List Yourself for Hire</DialogTitle>
      <div
        id="list-yourself-description"
        className="text-sm text-muted-foreground text-center"
      >
        Fill in your profile to get listed for hiring opportunities.
      </div>
    </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Enter your name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="Email address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input placeholder="Phone number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="age" render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="gender" render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl><Input placeholder="City" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="job_category" render={({ field }) => (
              <FormItem>
                <FormLabel>Job Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Job Category" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="maid">Maid</SelectItem>
                    <SelectItem value="painter">Painter</SelectItem>
                    <SelectItem value="Website developer">Website developer</SelectItem>
                    <SelectItem value="App Developer">App Developer</SelectItem>
                    <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                    <SelectItem value="Educational Tutor">Educational Tutor</SelectItem>
                    <SelectItem value="Sales Dialer">Sales Dialer</SelectItem>
                    <SelectItem value="Ads Manager">Ads Manager</SelectItem>
                    <SelectItem value="Chartered Accountant">Chartered Accountant</SelectItem>
                    <SelectItem value="Baby Sitter">Baby Sitter</SelectItem>
                    <SelectItem value="Lawyer">Lawyer</SelectItem>
                    <SelectItem value="Yoga Instructor">Yoga Instructor</SelectItem>
                    <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                    <SelectItem value="Electrician">Electrician</SelectItem>
                    <SelectItem value="Hair Dresser">Hair Dresser</SelectItem>
                    <SelectItem value="Gardener">Gardener</SelectItem>
                    <SelectItem value="Security Guard">Security Guard</SelectItem>
                    <SelectItem value="Cook">Cook</SelectItem>
                    <SelectItem value="Labour">Labour</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="experience_years" render={({ field }) => (
              <FormItem>
                <FormLabel>Experience (Years)</FormLabel>
                <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl><Textarea placeholder="Tell us about yourself..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'List Yourself'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
