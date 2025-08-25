import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { paymentService, PaymentStatus } from '@/services/paymentService';

const PaymentSuccess: React.FC = () => {
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <h2 className="text-lg font-semibold">Verifying Payment...</h2>
          <p className="text-muted-foreground text-center">
            Please wait while we confirm your payment.
          </p>
        </div>
      );
    }

    if (!paymentStatus) {
      return (
        <div className="text-center space-y-4">
          <XCircle className="text-red-500 w-12 h-12 mx-auto" />
          <h2 className="text-xl font-bold text-red-700">Payment Not Found</h2>
          <p className="text-muted-foreground">We couldn't find your payment information.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      );
    }

    if (paymentStatus.status === 'FAILED') {
      return (
        <div className="text-center space-y-4">
          <XCircle className="text-red-500 w-12 h-12 mx-auto" />
          <h2 className="text-xl font-bold text-red-700">Payment Failed</h2>
          <p className="text-muted-foreground">
            Your payment could not be processed. Please try again.
          </p>
          <div className="space-x-2">
            <Button onClick={() => navigate('/products')}>Try Again</Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    if (paymentStatus.status === 'PENDING') {
      return (
        <div className="text-center space-y-4">
          <Clock className="text-yellow-500 w-12 h-12 mx-auto" />
          <h2 className="text-xl font-bold text-yellow-700">Payment Processing</h2>
          <p className="text-muted-foreground">Your payment is being processed. Please wait...</p>
          <Button onClick={verifyPayment} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
        </div>
      );
    }

    // Payment completed successfully
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="text-green-500 w-12 h-12 mx-auto" />
        <h2 className="text-xl font-bold text-green-700">Payment Successful!</h2>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        {paymentStatus.metadata?.product_type === 'DIGITAL_PRODUCT' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-green-800">{paymentStatus.metadata.product_name}</h3>
            <p className="text-sm text-green-600 mt-1">Product has been added to your account.</p>
          </div>
        )}

        {paymentStatus.metadata?.product_type === 'SUBSCRIPTION' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-blue-800">{paymentStatus.metadata.plan_name} Plan</h3>
            <p className="text-sm text-blue-600 mt-1">Your subscription has been activated.</p>
          </div>
        )}

        <div className="space-x-2 mt-6">
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            View Profile
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Status</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
