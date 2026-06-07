"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{
    id: string;
    order_number: string;
    total_amount: number;
  } | null>(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch(() => toast.error("Failed to load order"));
  }, [orderId]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!order) return;
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.total_amount,
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "TiffinHub",
        description: `Order #${order.order_number}`,
        order_id: data.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderId: order.id,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push("/payment/success");
          } else {
            router.push("/payment/failure");
          }
        },
        prefill: {},
        theme: { color: "#ea580c" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      toast.error("Payment failed");
      router.push("/payment/failure");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No order specified</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CreditCard className="h-12 w-12 text-primary mx-auto mb-2" />
          <CardTitle>Secure Payment</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {order ? (
            <>
              <p className="text-muted-foreground mb-2">
                Order #{order.order_number}
              </p>
              <p className="text-3xl font-bold text-primary mb-6">
                {formatCurrency(order.total_amount)}
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </Button>
            </>
          ) : (
            <div className="h-20 animate-pulse bg-muted rounded" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
