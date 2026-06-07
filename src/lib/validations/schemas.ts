import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
      .optional()
      .or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
    .optional()
    .or(z.literal("")),
});

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  specialInstructions: z.string().optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["breakfast", "lunch", "dinner", "snacks"]),
  price: z.number().min(1, "Price must be at least ₹1"),
  available: z.boolean(),
  image_url: z.string().url().optional().or(z.literal("")),
});

export const subscriptionSchema = z.object({
  plan_type: z.enum(["weekly", "monthly"]),
  start_date: z.string().min(1, "Start date is required"),
  meal_preference: z.enum(["veg", "non-veg", "both"]),
  delivery_address: z.string().min(10, "Delivery address is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
