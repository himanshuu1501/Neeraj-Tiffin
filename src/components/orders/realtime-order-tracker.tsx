"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderTimeline } from "./order-timeline";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderStatus } from "@/types/database";

interface RealtimeOrderTrackerProps {
  orderId: string;
  initialStatus: OrderStatus;
}

export function RealtimeOrderTracker({
  orderId,
  initialStatus,
}: RealtimeOrderTrackerProps) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new as { status: OrderStatus };
          setStatus(newStatus.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div>
      <div className="mb-4">
        <OrderStatusBadge status={status} />
      </div>
      <OrderTimeline status={status} />
    </div>
  );
}
