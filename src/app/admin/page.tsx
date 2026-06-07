import { getDashboardStats } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
      color: "text-green-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Delivered",
      value: stats.deliveredOrders.toString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers.toString(),
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6 flex items-center gap-4">
              <card.icon className={`h-8 w-8 ${card.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Ordered Meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{stats.mostOrderedMeal}</p>
        </CardContent>
      </Card>
    </div>
  );
}
