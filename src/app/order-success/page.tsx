import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Order Placed",
};

interface OrderSuccessPageProps {
  searchParams: Promise<{ order?: string; id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          {params.order && (
            <p className="text-lg text-muted-foreground mb-2">
              Order ID: <span className="font-semibold text-foreground">#{params.order}</span>
            </p>
          )}
          <p className="text-muted-foreground mb-6">
            Your order has been sent to our kitchen via WhatsApp. We&apos;ll start preparing it shortly!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {params.id && (
              <Link href={`/orders/${params.id}`}>
                <Button>Track Order</Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/menu">
              <Button variant="ghost">Order More</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
