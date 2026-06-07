import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { AdminOrdersFilter } from "./orders-filter";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Manage Orders" };

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(*), profiles(name, email, phone)")
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.search) {
    query = query.or(
      `order_number.ilike.%${params.search}%,customer_name.ilike.%${params.search}%`
    );
  }

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>
      <AdminOrdersFilter initialStatus={params.status} initialSearch={params.search} />

      <div className="space-y-4 mt-6">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-lg hover:text-primary"
                      >
                        #{order.order_number}
                      </Link>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_name} · {order.customer_phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <Link href={`/admin/orders/${order.id}`}>
                      <span className="text-sm text-primary hover:underline">
                        View Details →
                      </span>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No orders found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
