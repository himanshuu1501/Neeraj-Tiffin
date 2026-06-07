import { redirect, notFound } from "next/navigation";
import { createClient, getProfile } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealtimeOrderTracker } from "@/components/orders/realtime-order-tracker";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderActions } from "./order-actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Order Details" };

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", profile.id)
    .single();

  if (!order) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <p className="text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items?.map((item: { id: string; item_name: string; quantity: number; item_price: number }) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.item_name}
                    </span>
                    <span>{formatCurrency(item.item_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</p>
              <p><span className="text-muted-foreground">Address:</span> {order.delivery_address}</p>
              {order.special_instructions && (
                <p><span className="text-muted-foreground">Instructions:</span> {order.special_instructions}</p>
              )}
            </CardContent>
          </Card>

          <OrderActions orderId={order.id} status={order.status} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <RealtimeOrderTracker orderId={order.id} initialStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
