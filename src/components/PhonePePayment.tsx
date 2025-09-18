import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import { paymentService, PaymentData } from '@/services/paymentService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhonePePaymentProps {
  /** Product ID for digital product purchase */
  productId?: string;
  /** Plan details for subscription */
  planName?: string;
  planAmount?: number;
  /** Button text */
  children?: React.ReactNode;
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Custom class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when payment is initiated */
  onPaymentInitiated?: (data: PaymentData) => void;
  /** Custom redirect URL after payment */
  redirectUrl?: string;
  /** Whether email is required (default: true) */
  requireEmail?: boolean;
}

const PhonePePayment: React.FC<PhonePePaymentProps> = ({
  productId,
  planName,
  planAmount,
  children = 'Pay with PhonePe',
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  onPaymentInitiated,
  redirectUrl,
  requireEmail = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePaymentInitiation = async (userEmail?: string) => {
    setLoading(true);
    try {
      let paymentData: PaymentData;

      if (productId) {
        paymentData = await paymentService.createDigitalProductPayment(
          productId,
          redirectUrl,
          userEmail
        );
        toast.success('Payment initiated for product!');
      } else if (planName && planAmount) {
        // Subscription payment with email
        paymentData = await paymentService.createSubscriptionPayment(
          planName,
          planAmount,
          redirectUrl,
        );
        toast.success('Payment initiated for subscription!');
      } else {
        throw new Error('Either productId or (planName and planAmount) must be provided');
      }

      // Store order ID in localStorage for verification later
      localStorage.setItem('current_payment_order_id', paymentData.orderId);

      // Call callback if provided
      if (onPaymentInitiated) {
        onPaymentInitiated(paymentData);
      }

      // Redirect to PhonePe payment gateway
      paymentService.openPaymentGateway(paymentData.paymentUrl);
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (loading) return;

    if (requireEmail) {
      setShowEmailModal(true);
    } else {
      await handlePaymentInitiation();
    }
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setShowEmailModal(false);
    await handlePaymentInitiation(email);
  };

  const handleModalClose = () => {
    setShowEmailModal(false);
    setEmail('');
    setEmailError('');
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        variant={variant}
        size={size}
        className={`${className} ${loading ? 'cursor-not-allowed' : ''}`}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {children}
          </>
        )}
      </Button>

      <Dialog open={showEmailModal} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogDescription>
              Please provide your email address to proceed with the payment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
                className={emailError ? 'border-red-500' : ''}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleModalClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmailSubmit}
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhonePePayment;