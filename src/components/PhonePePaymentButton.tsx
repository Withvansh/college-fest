import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';

interface PhonePePaymentButtonProps {
  productId: string;
  amount: number;
  productName: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  children?: React.ReactNode;
}

const PhonePePaymentButton: React.FC<PhonePePaymentButtonProps> = ({
  productId,
  amount,
  productName,
  className = '',
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Create payment and get PhonePe URL
      const paymentData = await paymentService.createDigitalProductPayment(productId);

      // Store order ID for verification after redirect
      localStorage.setItem('current_payment_order_id', paymentData.orderId);

      // Show success message
      toast.success('Redirecting to PhonePe payment gateway...');

      // Redirect to PhonePe
      setTimeout(() => {
        window.location.href = paymentData.paymentUrl;
      }, 1000);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      variant={variant}
      size={size}
      className={`${className} ${isProcessing ? 'cursor-not-allowed' : ''}`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          {children || `Pay ₹${amount}`}
        </>
      )}
    </Button>
  );
};

export default PhonePePaymentButton;
