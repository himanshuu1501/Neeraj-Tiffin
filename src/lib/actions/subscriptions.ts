"use server";

import { createClient } from "@/lib/supabase/server";
import { subscriptionSchema } from "@/lib/validations/schemas";
import { addDays, addMonths, format } from "date-fns";
import { revalidatePath } from "next/cache";
import type { SubscriptionStatus } from "@/types/database";

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please sign in" };

  const parsed = subscriptionSchema.safeParse({
    plan_type: formData.get("plan_type"),
    start_date: formData.get("start_date"),
    meal_preference: formData.get("meal_preference"),
    delivery_address: formData.get("delivery_address"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const startDate = new Date(parsed.data.start_date);
  const endDate =
    parsed.data.plan_type === "weekly"
      ? addDays(startDate, 7)
      : addMonths(startDate, 1);

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan_type: parsed.data.plan_type,
    start_date: format(startDate, "yyyy-MM-dd"),
    end_date: format(endDate, "yyyy-MM-dd"),
    meal_preference: parsed.data.meal_preference,
    delivery_address: parsed.data.delivery_address,
    status: "active",
  });

  if (error) return { error: error.message };

  revalidatePath("/subscriptions");
  revalidatePath("/admin/subscriptions");
  return { success: true };
}

export async function updateSubscriptionStatus(
  id: string,
  status: SubscriptionStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("subscriptions")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/subscriptions");
  revalidatePath("/admin/subscriptions");
  return { success: true };
}
