import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Loader2, Crown, CheckCircle, XCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

const CheckPremium = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setHasChecked(false);
    
    try {
      // Check localStorage for premium status
      const premiumKey = `premium-${values.email}-${values.phone}`;
      const isPremium = localStorage.getItem(premiumKey) === 'true';
      
      setPremiumStatus(isPremium);
      setHasChecked(true);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check premium status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetCheck = () => {
    setHasChecked(false);
    setPremiumStatus(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 inline-block mb-4 shadow-2xl">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Premium Status</h1>
          <p className="text-gray-600">Verify your premium subscription</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-800">
              Premium Status Checker
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {!hasChecked ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            {...field} 
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking Status...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Check Premium Status
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                {/* Status Result */}
                <div className={`text-center p-6 rounded-lg border-2 ${
                  premiumStatus 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  {premiumStatus ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h2 className="text-xl font-bold text-green-800 mb-2">
                        ✅ Premium Active
                      </h2>
                      <p className="text-green-700">
                        You have an active premium subscription!
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                      <h2 className="text-xl font-bold text-red-800 mb-2">
                        ❌ No Premium Access
                      </h2>
                      <p className="text-red-700 mb-4">
                        You don't have an active premium subscription.
                      </p>
                      <Link to="/pricing">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Premium
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={resetCheck}
                    variant="outline"
                    className="w-full"
                  >
                    Check Another Account
                  </Button>
                  
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Need help? <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default CheckPremium;