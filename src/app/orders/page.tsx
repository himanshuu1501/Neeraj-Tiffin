import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getProfile } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Order History" };

export default async function OrdersPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">#{order.order_number}</h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(order.created_at)}
                    </p>
                    <div className="text-sm">
                      {order.order_items?.map((item: { id: string; quantity: number; item_name: string }) => (
                        <span key={item.id} className="mr-3">
                          {item.quantity}x {item.item_name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link href="/menu">
              <Button>Start Ordering</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
