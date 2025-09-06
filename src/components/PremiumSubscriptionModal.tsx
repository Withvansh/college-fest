import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

interface PremiumSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

export const PremiumSubscriptionModal: React.FC<PremiumSubscriptionModalProps> = ({
  isOpen,
  onClose,
  planName,
  planPrice,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Generate random order ID
      const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

      // Save order data to localStorage
      const orderData = {
        email: values.email,
        phone: values.phone,
        name: values.name,
        planName,
        planPrice,
      };

      localStorage.setItem(orderId, JSON.stringify(orderData));

      // Close modal and redirect to fake PhonePe
      onClose();
      navigate(
        `/fake-phonepe?orderId=${orderId}&amount=${planPrice.replace('₹', '')}&plan=${encodeURIComponent(planName)}`
      );
    } catch (error) {
      console.error('💥 Payment initiation failed:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-screen bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Subscribe to {planName}
          </DialogTitle>
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">{planPrice}</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>14-day Free Trial</span>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg py-3 transition-all duration-200"
                      />
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
                    <FormLabel className="text-gray-700 font-medium">Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg py-3 transition-all duration-200"
                      />
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
                    <FormLabel className="text-gray-700 font-medium">Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg py-3 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
              <p className="text-sm text-gray-700 text-center">
                🎉 <strong>Free Trial:</strong> Start with a 14-day free trial. Cancel anytime with
                no charges.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-semibold transition-all duration-200"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By subscribing, you agree to our Terms of Service and Privacy Policy. No credit card
              charged during the free trial period.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
