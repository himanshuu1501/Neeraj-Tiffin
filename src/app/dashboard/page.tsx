import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Clock, CreditCard, User } from "lucide-react";
import { createClient, getProfile } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { ProfileForm } from "./profile-form";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/admin");

  const supabase = await createClient();

  const { data: currentOrders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", profile.id)
    .not("status", "in", '("delivered","cancelled")')
    .order("created_at", { ascending: false });

  const { data: pastOrders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", profile.id)
    .in("status", ["delivered", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
        <p className="text-muted-foreground">Manage your orders and profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold">{currentOrders?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Past Orders</p>
              <p className="text-2xl font-bold">{pastOrders?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Payments</p>
              <p className="text-2xl font-bold">{payments?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Orders</h2>
              <Link href="/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            {currentOrders && currentOrders.length > 0 ? (
              <div className="space-y-4">
                {currentOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)} · {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <Link href={`/orders/${order.id}`}>
                          <Button size="sm" variant="outline">Track</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No active orders. <Link href="/menu" className="text-primary">Order now</Link>
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Previous Orders</h2>
            {pastOrders && pastOrders.length > 0 ? (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)} · {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No previous orders yet
                </CardContent>
              </Card>
            )}
          </section>

          {payments && payments.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <div className="space-y-2">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      <OrderStatusBadge status={payment.status} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
