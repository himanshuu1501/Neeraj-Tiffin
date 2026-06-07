"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { OrderStatus } from "@/types/database";

interface AdminOrderActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const actions: { status: OrderStatus; label: string; variant?: "destructive" }[] = [
  { status: "accepted", label: "Accept Order" },
  { status: "preparing", label: "Mark Preparing" },
  { status: "out_for_delivery", label: "Out for Delivery" },
  { status: "delivered", label: "Mark Delivered" },
  { status: "cancelled", label: "Cancel Order", variant: "destructive" },
];

export function AdminOrderActions({ orderId, currentStatus }: AdminOrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (status: OrderStatus) => {
    setLoading(status);
    const result = await updateOrderStatus(orderId, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Order marked as ${status.replace(/_/g, " ")}`);
      router.refresh();
    }
    setLoading(null);
  };

  if (currentStatus === "delivered" || currentStatus === "cancelled") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {actions.map((action) => {
          if (action.status === currentStatus) return null;
          return (
            <Button
              key={action.status}
              variant={action.variant || "default"}
              onClick={() => handleAction(action.status)}
              disabled={loading !== null}
            >
              {loading === action.status ? "Updating..." : action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
