"use server";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";
import type { CartItem, OrderStatus } from "@/types/database";

export async function placeOrder(
  cartItems: CartItem[],
  checkoutData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    specialInstructions?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please sign in to place an order" };

  if (cartItems.length === 0) return { error: "Your cart is empty" };

  const parsed = checkoutSchema.safeParse(checkoutData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const unavailable = cartItems.filter((item) => !item.menuItem.available);
  if (unavailable.length > 0) {
    return {
      error: `${unavailable.map((i) => i.menuItem.name).join(", ")} is no longer available`,
    };
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const deliveryAddress = `${parsed.data.address}, ${parsed.data.city}, ${parsed.data.state} - ${parsed.data.pincode}`;

  const { data: orderNumber } = await supabase.rpc("generate_order_number");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: orderNumber || `TH${Date.now()}`,
      total_amount: totalAmount,
      status: "pending",
      payment_status: "pending",
      customer_name: parsed.data.name,
      customer_phone: parsed.data.phone,
      delivery_address: deliveryAddress,
      special_instructions: parsed.data.specialInstructions || null,
    })
    .select()
    .single();

  if (orderError) return { error: orderError.message };

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menuItem.id,
    quantity: item.quantity,
    item_price: item.menuItem.price,
    item_name: item.menuItem.name,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) return { error: itemsError.message };

  for (const item of cartItems) {
    await supabase
      .from("menu_items")
      .update({ popularity: item.menuItem.popularity + item.quantity })
      .eq("id", item.menuItem.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/admin/orders");

  return {
    success: true,
    order: {
      ...order,
      order_items: orderItems,
    },
  };
}

export async function cancelOrder(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("orders")
    .select("status, user_id")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Order not found" };
  if (order.user_id !== user.id) return { error: "Unauthorized" };
  if (order.status !== "pending") {
    return { error: "Only pending orders can be cancelled" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function reorderItems(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*, menu_items(*)")
    .eq("order_id", orderId);

  if (!orderItems || orderItems.length === 0) {
    return { error: "No items found" };
  }

  const cartItems = orderItems
    .filter((item) => item.menu_items?.available)
    .map((item) => ({
      menuItem: item.menu_items,
      quantity: item.quantity,
    }));

  return { success: true, cartItems };
}
