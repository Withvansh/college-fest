import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import { paymentService, PaymentData } from '@/services/paymentService';

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
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);
    try {
      let paymentData: PaymentData;

      if (productId) {
        // Digital product payment
        paymentData = await paymentService.createDigitalProductPayment(productId, redirectUrl);
        toast.success('Payment initiated for product!');
      } else if (planName && planAmount) {
        // Subscription payment
        paymentData = await paymentService.createSubscriptionPayment(
          planName,
          planAmount,
          redirectUrl
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

  return (
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
  );
};

export default PhonePePayment;
