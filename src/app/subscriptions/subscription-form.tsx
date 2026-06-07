"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionSchema, type SubscriptionInput } from "@/lib/validations/schemas";
import { createSubscription } from "@/lib/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { SubscriptionPlan } from "@/types/database";

interface SubscriptionFormProps {
  planType: SubscriptionPlan;
}

export function SubscriptionForm({ planType }: SubscriptionFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      plan_type: planType,
      start_date: new Date().toISOString().split("T")[0],
      meal_preference: "veg",
    },
  });

  const onSubmit = async (data: SubscriptionInput) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const result = await createSubscription(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Subscription created!");
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <Button className="w-full" onClick={() => setOpen(true)}>
        Subscribe Now
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register("plan_type")} value={planType} />
      <div>
        <Label htmlFor={`start-${planType}`}>Start Date</Label>
        <Input
          id={`start-${planType}`}
          type="date"
          {...register("start_date")}
        />
        {errors.start_date && (
          <p className="text-xs text-destructive">{errors.start_date.message}</p>
        )}
      </div>
      <div>
        <Label>Meal Preference</Label>
        <Select
          defaultValue="veg"
          onValueChange={(v) =>
            setValue("meal_preference", v as SubscriptionInput["meal_preference"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="veg">Vegetarian</SelectItem>
            <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor={`address-${planType}`}>Delivery Address</Label>
        <Textarea
          id={`address-${planType}`}
          {...register("delivery_address")}
          placeholder="Full delivery address..."
        />
        {errors.delivery_address && (
          <p className="text-xs text-destructive">
            {errors.delivery_address.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Subscribing..." : "Confirm Subscription"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>
    </form>
  );
}
