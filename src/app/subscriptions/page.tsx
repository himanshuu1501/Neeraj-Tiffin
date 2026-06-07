import { createClient, getProfile } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionForm } from "./subscription-form";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatDate } from "@/lib/utils";
import { Check } from "lucide-react";

export const metadata = { title: "Subscription Plans" };

const plans = [
  {
    type: "weekly" as const,
    name: "Weekly Plan",
    price: 700,
    features: [
      "7 days of fresh meals",
      "Breakfast, Lunch & Dinner options",
      "Free delivery",
      "Flexible meal preferences",
    ],
  },
  {
    type: "monthly" as const,
    name: "Monthly Plan",
    price: 2500,
    features: [
      "30 days of fresh meals",
      "Save 15% vs weekly",
      "Priority delivery",
      "Pause anytime",
      "Dedicated support",
    ],
    popular: true,
  },
];

export default async function SubscriptionsPage() {
  const profile = await getProfile();
  const supabase = await createClient();

  const { data: subscriptions } = profile
    ? await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Tiffin Subscription Plans</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Subscribe for daily fresh meals delivered to your doorstep. Choose weekly or monthly plans.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {plans.map((plan) => (
          <Card
            key={plan.type}
            className={plan.popular ? "border-primary shadow-lg relative" : ""}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold text-primary mt-2">
                ₹{plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.type === "weekly" ? "week" : "month"}
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {profile ? (
                <SubscriptionForm planType={plan.type} />
              ) : (
                <a href="/login" className="block text-center text-primary hover:underline text-sm">
                  Sign in to subscribe
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {subscriptions && subscriptions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
          <div className="space-y-4 max-w-2xl">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold capitalize">{sub.plan_type} Plan</span>
                      <OrderStatusBadge status={sub.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(sub.start_date)} — {formatDate(sub.end_date)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
