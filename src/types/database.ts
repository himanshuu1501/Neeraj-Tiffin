export type UserRole = "customer" | "admin";
export type MealCategory = "breakfast" | "lunch" | "dinner" | "snacks";
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type SubscriptionPlan = "weekly" | "monthly";
export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MealCategory;
  price: number;
  image_url: string | null;
  available: boolean;
  popularity: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  address_id: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  item_price: number;
  item_name: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlan;
  start_date: string;
  end_date: string;
  meal_preference: string;
  delivery_address: string;
  status: SubscriptionStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  order_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  activeCustomers: number;
  mostOrderedMeal: string;
}

export interface CustomerStats {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  totalRevenue: number;
}
