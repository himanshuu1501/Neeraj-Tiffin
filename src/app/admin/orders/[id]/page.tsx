import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { AdminOrderActions } from "./admin-order-actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Order Details" };

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  return (
    <div>
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
              <CardTitle>Customer Information</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items?.map((item: { id: string; item_name: string; quantity: number; item_price: number }) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.item_name}</span>
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

          <AdminOrderActions orderId={order.id} currentStatus={order.status} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline status={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
