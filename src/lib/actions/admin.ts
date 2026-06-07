"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, CustomerStats } from "@/types/database";
import { startOfDay, subDays, format } from "date-fns";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const today = startOfDay(new Date()).toISOString();

  const [
    { data: orders },
    { data: todayOrders },
    { data: customers },
    { data: orderItems },
  ] = await Promise.all([
    supabase.from("orders").select("total_amount, status"),
    supabase.from("orders").select("id").gte("created_at", today),
    supabase.from("profiles").select("id").eq("role", "customer"),
    supabase
      .from("order_items")
      .select("item_name, quantity"),
  ]);

  const totalRevenue =
    orders
      ?.filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

  const mealCounts: Record<string, number> = {};
  orderItems?.forEach((item) => {
    mealCounts[item.item_name] =
      (mealCounts[item.item_name] || 0) + item.quantity;
  });

  const mostOrderedMeal =
    Object.entries(mealCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    totalRevenue,
    totalOrders: orders?.length || 0,
    todayOrders: todayOrders?.length || 0,
    pendingOrders: orders?.filter((o) => o.status === "pending").length || 0,
    deliveredOrders:
      orders?.filter((o) => o.status === "delivered").length || 0,
    activeCustomers: customers?.length || 0,
    mostOrderedMeal,
  };
}

export async function getAnalyticsData() {
  const supabase = await createClient();
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_amount, status")
    .gte("created_at", thirtyDaysAgo)
    .neq("status", "cancelled");

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("item_name, quantity");

  const dailyOrders: Record<string, number> = {};
  const dailyRevenue: Record<string, number> = {};
  const monthlyRevenue: Record<string, number> = {};

  orders?.forEach((order) => {
    const day = format(new Date(order.created_at), "yyyy-MM-dd");
    const month = format(new Date(order.created_at), "yyyy-MM");
    dailyOrders[day] = (dailyOrders[day] || 0) + 1;
    dailyRevenue[day] = (dailyRevenue[day] || 0) + Number(order.total_amount);
    monthlyRevenue[month] =
      (monthlyRevenue[month] || 0) + Number(order.total_amount);
  });

  const topMeals: Record<string, number> = {};
  orderItems?.forEach((item) => {
    topMeals[item.item_name] =
      (topMeals[item.item_name] || 0) + item.quantity;
  });

  return {
    dailyOrders: Object.entries(dailyOrders).map(([date, count]) => ({
      date,
      count,
    })),
    dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue,
    })),
    monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    })),
    topMeals: Object.entries(topMeals)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}

export async function getCustomerStats(): Promise<CustomerStats[]> {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, email, phone")
    .eq("role", "customer");

  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total_amount, status");

  return (profiles || []).map((profile) => {
    const userOrders =
      orders?.filter(
        (o) => o.user_id === profile.id && o.status !== "cancelled"
      ) || [];
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      totalOrders: userOrders.length,
      totalRevenue: userOrders.reduce(
        (sum, o) => sum + Number(o.total_amount),
        0
      ),
    };
  });
}
