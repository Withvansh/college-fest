
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Smartphone, CreditCard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FakePhonePe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('199');
  const [planName, setPlanName] = useState('Premium Plan');
  const [orderData, setOrderData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('orderId') || 'ORDER_' + Math.random().toString(36).substr(2, 9);
    const price = urlParams.get('amount') || '199';
    const plan = urlParams.get('plan') || 'Premium Plan';
    
    setOrderId(id);
    setAmount(price);
    setPlanName(decodeURIComponent(plan));

    // Get order data from localStorage
    const storedOrderData = localStorage.getItem(id);
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    }
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      try {
        if (orderData) {
          // Save premium status to localStorage
          const premiumKey = `premium-${orderData.email}-${orderData.phone}`;
          localStorage.setItem(premiumKey, 'true');
          
          // Redirect to success page
          navigate('/payment-success');
        }
      } catch (error) {
        console.error('Payment confirmation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* PhonePe Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="bg-white rounded-2xl p-3 md:p-4 inline-block mb-3 md:mb-4 shadow-2xl">
            <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">PhonePe</h1>
          <p className="text-blue-100 text-sm md:text-base">Secure Payment Gateway</p>
        </div>

        {/* Payment Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-3 md:pb-4 px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl text-gray-800">Payment Details</CardTitle>
            <div className="text-xs md:text-sm text-gray-600">Order ID: {orderId}</div>
          </CardHeader>
          
          <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
            {/* Amount */}
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">₹{amount}</div>
              <div className="text-xs md:text-sm text-gray-600">{planName} - MinuteHire Premium</div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2 md:mb-3">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="font-medium text-sm md:text-base">UPI Payment</span>
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Secure payment powered by PhonePe
              </div>
            </div>

            {/* Security Features */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-green-50 p-2 md:p-3 rounded-lg">
              <Shield className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
              <span>256-bit SSL Encrypted</span>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full h-10 md:h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm md:text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
                  <span className="text-xs md:text-sm">Processing Payment...</span>
                </div>
              ) : (
                <>Pay ₹{amount}</>
              )}
            </Button>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-3 md:gap-4 pt-2 md:pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Instant</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Reliable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4 md:mt-6 text-blue-100 text-xs md:text-sm">
          Powered by PhonePe • Secure & Trusted
        </div>
      </div>
    </div>
  );
};

export default FakePhonePe;
