import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { AdminSubscriptionActions } from "./subscription-actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Subscriptions" };

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, profiles(name, email, phone)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      <div className="space-y-4">
        {subscriptions && subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold capitalize">
                        {sub.plan_type} Plan
                      </h3>
                      <OrderStatusBadge status={sub.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sub.profiles?.name} · {sub.profiles?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(sub.start_date)} — {formatDate(sub.end_date)}
                    </p>
                    <p className="text-sm mt-1">
                      Preference: {sub.meal_preference} · {sub.delivery_address}
                    </p>
                  </div>
                  <AdminSubscriptionActions
                    subscriptionId={sub.id}
                    currentStatus={sub.status}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No subscriptions yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
