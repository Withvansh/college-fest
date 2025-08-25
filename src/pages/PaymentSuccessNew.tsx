import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { paymentService, PaymentStatus } from '@/services/paymentService';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Get order ID from URL params or localStorage
  const orderId = searchParams.get('orderId') || localStorage.getItem('current_payment_order_id');

  useEffect(() => {
    if (!orderId) {
      toast.error('No payment information found');
      navigate('/products');
      return;
    }

    verifyPayment();
  }, [orderId]);

  const verifyPayment = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const status = await paymentService.verifyPayment(orderId);
      setPaymentStatus(status);

      if (status.isCompleted) {
        toast.success('Payment completed successfully!');
        // Clear stored order ID
        localStorage.removeItem('current_payment_order_id');
      } else if (status.status === 'FAILED') {
        toast.error('Payment failed');
      } else if (status.status === 'PENDING' && verificationAttempts < 10) {
        // Retry verification for pending payments
        setTimeout(() => {
          setVerificationAttempts(prev => prev + 1);
          verifyPayment();
        }, 3000);
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryVerification = () => {
    setVerificationAttempts(0);
    verifyPayment();
  };

  const handleGoBack = () => {
    if (paymentStatus?.metadata?.product_type === 'DIGITAL_PRODUCT') {
      navigate('/products');
    } else if (paymentStatus?.metadata?.product_type === 'SUBSCRIPTION') {
      navigate('/pricing');
    } else {
      navigate('/');
    }
  };

  const getStatusIcon = () => {
    if (loading) {
      return <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />;
    }

    switch (paymentStatus?.status) {
      case 'COMPLETED':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'PENDING':
      default:
        return <Clock className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    if (loading) {
      return {
        title: 'Verifying Payment',
        message: 'Please wait while we verify your payment...',
      };
    }

    switch (paymentStatus?.status) {
      case 'COMPLETED':
        return {
          title: 'Payment Successful!',
          message:
            paymentStatus.metadata?.product_type === 'DIGITAL_PRODUCT'
              ? `Thank you! Your purchase of "${paymentStatus.metadata.product_name}" is complete.`
              : `Thank you! Your subscription to "${paymentStatus.metadata?.plan_name}" is now active.`,
        };
      case 'FAILED':
        return {
          title: 'Payment Failed',
          message: 'Unfortunately, your payment could not be processed. Please try again.',
        };
      case 'CANCELLED':
        return {
          title: 'Payment Cancelled',
          message: 'Your payment was cancelled. No amount has been charged.',
        };
      case 'PENDING':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait a moment...',
        };
      default:
        return {
          title: 'Unknown Status',
          message:
            'Unable to determine payment status. Please contact support if you need assistance.',
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <CardTitle className="text-2xl font-bold">{statusInfo.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">{statusInfo.message}</p>

          {paymentStatus && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="text-muted-foreground">{paymentStatus.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className="text-muted-foreground">₹{paymentStatus.amount}</span>
              </div>
              {paymentStatus.transactionId && (
                <div className="flex justify-between">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-muted-foreground">{paymentStatus.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-medium ${
                    paymentStatus.status === 'COMPLETED'
                      ? 'text-green-600'
                      : paymentStatus.status === 'FAILED'
                        ? 'text-red-600'
                        : paymentStatus.status === 'PENDING'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                  }`}
                >
                  {paymentStatus.status}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {paymentStatus?.status === 'PENDING' && (
              <Button
                onClick={handleRetryVerification}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            )}

            <Button
              onClick={handleGoBack}
              className="w-full"
              variant={paymentStatus?.status === 'COMPLETED' ? 'default' : 'outline'}
            >
              {paymentStatus?.status === 'COMPLETED' ? 'Continue' : 'Go Back'}
            </Button>

            {paymentStatus?.status === 'FAILED' && (
              <Button onClick={() => navigate(-1)} variant="default" className="w-full">
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
