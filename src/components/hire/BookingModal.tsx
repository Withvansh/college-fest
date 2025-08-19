import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const bookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  message: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    name: string;
    job_category: string;
    rating: number;
  } | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [proceedAsGuest, setProceedAsGuest] = useState(false);
  const { user } = useAuth();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: '',
      time: '',
      message: '',
      name: '',
      email: user?.email || '',
      phone: '',
    },
  });

  const onSubmit = async (values: BookingFormData) => {
    console.log('📨 Form Values:', values);
    console.log('👤 Profile Info:', profile);
    console.log('🔐 Authenticated User:', user);
    console.log('👤 Proceeding as Guest:', proceedAsGuest);

    if (!profile) {
      console.warn('⚠️ Missing profile.');
      toast.error('Missing profile information.');
      return;
    }

    if (!user && !proceedAsGuest) {
      console.log('🚫 User not logged in — showing guest prompt');
      setShowGuestPrompt(true);
      return;
    }

    setIsLoading(true);
    console.log('⏳ Sending request to Supabase...');

    try {
      const { data, error } = await supabase
        .from('hire_requests')
        .insert([
          {
            hirer_user_id: user?.id || null,
            hiree_profile_id: profile.id,
            date_requested: values.date,
            time_slot: values.time,
            message: values.message,
            hirer_name: values.name,
            hirer_email: values.email,
            hirer_phone: values.phone,
            status: 'pending',
          },
        ])
        .select();

      if (error) {
        console.error('❌ Supabase Error:', error);
        toast.error('Failed to create booking. Please try again.');
      } else {
        console.log('✅ Booking Success:', data);
        toast.success('Booking request sent successfully!');
        onClose();
        form.reset();
        setProceedAsGuest(false);
      }
    } catch (err) {
      console.error('💥 Unexpected Error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('✅ Done submitting');
    }
  };

  if (!profile) {
    console.log('🛑 No profile available — skipping render');
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Book {profile.name}</DialogTitle>
            <div className="text-center text-muted-foreground">
              {profile.job_category} | {profile.rating}/5 Stars
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Send Booking Request'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Guest Prompt Dialog */}
      <Dialog open={showGuestPrompt} onOpenChange={setShowGuestPrompt}>
        <DialogContent className="max-w-sm text-center space-y-4">
          <DialogHeader>
            <DialogTitle>Continue as Guest?</DialogTitle>
          </DialogHeader>
          <p>You’re not logged in. You can log in for a better experience, or continue as a guest.</p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                console.log('🔑 Redirecting to login...');
                setShowGuestPrompt(false);
                window.location.href = '/login';
              }}
            >
              Login Now
            </Button>
            <Button
              onClick={() => {
                console.log('🧑 Proceeding as Guest...');
                setShowGuestPrompt(false);
                setProceedAsGuest(true);
                setTimeout(() => {
                  form.handleSubmit(onSubmit)();
                }, 0);
              }}
            >
              Continue as Guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};




// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/contexts/AuthContext';

// const bookingSchema = z.object({
//   date: z.string().min(1, 'Date is required'),
//   time: z.string().min(1, 'Time is required'),
//   message: z.string().optional(),
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   phone: z.string().min(10, 'Please enter a valid phone number'),
// });

// type BookingFormData = z.infer<typeof bookingSchema>;

// interface BookingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   profile: {
//     id: string;
//     name: string;
//     job_category: string;
//     rating: number;
//   } | null;
// }

// export const BookingModal: React.FC<BookingModalProps> = ({
//   isOpen,
//   onClose,
//   profile
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useAuth();

//   const form = useForm<BookingFormData>({
//     resolver: zodResolver(bookingSchema),
//     defaultValues: {
//       date: '',
//       time: '',
//       message: '',
//       name: '',
//       email: user?.email || '',
//       phone: '',
//     },
//   });

//   const onSubmit = async (values: BookingFormData) => {
//     if (!profile || !user) return;

//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('hire_requests')
//         .insert([
//           {
//             hirer_user_id: user.id,
//             hiree_profile_id: profile.id,
//             date_requested: values.date,
//             time_slot: values.time,
//             message: values.message,
//             hirer_name: values.name,
//             hirer_email: values.email,
//             hirer_phone: values.phone,
//             status: 'pending',
//           },
//         ])
//         .select();

//       if (error) {
//         console.error('Error creating booking:', error);
//         toast.error('Failed to create booking. Please try again.');
//       } else {
//         toast.success('Booking request sent successfully!');
//         onClose();
//         form.reset();
//       }
//     } catch (error) {
//       console.error('💥 Error during booking:', error);
//       toast.error('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!profile) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-center">
//             Book {profile.name}
//           </DialogTitle>
//           <div className="text-center text-muted-foreground">
//             {profile.job_category} | {profile.rating}/5 Stars
//           </div>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Date</FormLabel>
//                   <FormControl>
//                     <Input type="date" placeholder="Select a date" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="time"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Time</FormLabel>
//                   <FormControl>
//                     <Input type="time" placeholder="Select a time" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="message"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Message (Optional)</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Enter your message"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter your full name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email *</FormLabel>
//                   <FormControl>
//                     <Input type="email" placeholder="Enter your email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter your phone number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex gap-3 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onClose}
//                 className="flex-1"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   'Send Booking Request'
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };
