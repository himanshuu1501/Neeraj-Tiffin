"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder, reorderItems } from "@/lib/actions/orders";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { OrderStatus } from "@/types/database";
import Link from "next/link";

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
}

export function OrderActions({ orderId, status }: OrderActionsProps) {
  const router = useRouter();
  const { setItems } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    const result = await cancelOrder(orderId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order cancelled");
      router.refresh();
    }
    setLoading(false);
  };

  const handleReorder = async () => {
    setLoading(true);
    const result = await reorderItems(orderId);
    if (result.error) {
      toast.error(result.error);
    } else if (result.cartItems) {
      setItems(result.cartItems);
      toast.success("Items added to cart!");
      router.push("/cart");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap gap-3">
        {status === "pending" && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel Order
          </Button>
        )}
        {(status === "delivered" || status === "cancelled") && (
          <Button onClick={handleReorder} disabled={loading}>
            Reorder
          </Button>
        )}
        <Link href={`/payment?orderId=${orderId}`}>
          <Button variant="outline">Pay Now</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
