
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"LOADING" | "SUCCESS" | "FAILED">("LOADING");
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const txnId = searchParams.get("transactionId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txnId) {
        console.error("No transaction ID found in URL");
        setStatus("FAILED");
        return;
      }

      try {
        console.log("Verifying payment for transaction:", txnId);
        
         const backendUrl = import.meta.env.VITE_API_BASE_URL;

        const res = await fetch(`${backendUrl}/api/phonepe/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: txnId })
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Payment verification response:", data);

        if (data.success) {
          setStatus("SUCCESS");
          setOrderInfo(data.order);
          toast.success("Payment verified successfully!");
        } else {
          setStatus("FAILED");
          toast.error(data.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("FAILED");
        toast.error("Error verifying payment");
      }
    };

    verifyPayment();
  }, [txnId]);

  const renderContent = () => {
    if (status === "LOADING") {
      return (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Verifying payment...</p>
        </div>
      );
    }

    if (status === "FAILED") {
      return (
        <div className="text-center space-y-4">
          <XCircle className="text-red-500 w-12 h-12 mx-auto" />
          <h2 className="text-xl font-bold text-red-700">Payment Failed</h2>
          <p className="text-muted-foreground">
            {txnId ? "Payment verification failed. Please contact support." : "Invalid payment link."}
          </p>
          <Button onClick={() => window.location.href = "/products"}>
            Back to Products
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4">
        <CheckCircle className="text-green-500 w-12 h-12 mx-auto" />
        <h2 className="text-xl font-bold text-green-700">Payment Verified!</h2>
        <p className="text-muted-foreground">
          Thank you {orderInfo?.buyer_name || "for your purchase"}, your download is ready.
        </p>

        {orderInfo?.download_link && (
          <a
            href={orderInfo.download_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4"
          >
            <Button>Download Product</Button>
          </a>
        )}

        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/products"}
          className="mt-2"
        >
          Back to Products
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Payment Status</h1>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
