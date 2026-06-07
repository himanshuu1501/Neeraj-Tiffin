"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { playNotificationSound } from "@/lib/notification-sound";
import type { Order } from "@/types/database";

interface UseAdminOrderNotificationsOptions {
  onNewOrder?: (order: Order) => void;
  playSound?: boolean;
}

export function useAdminOrderNotifications({
  onNewOrder,
  playSound = true,
}: UseAdminOrderNotificationsOptions = {}) {
  const router = useRouter();
  const onNewOrderRef = useRef(onNewOrder);

  useEffect(() => {
    onNewOrderRef.current = onNewOrder;
  }, [onNewOrder]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-new-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const order = payload.new as Order;

          toast("🔔 New Order Received", {
            description: `Order #${order.order_number}\n${order.customer_name} · ${formatCurrency(order.total_amount)}`,
            duration: 8000,
            action: {
              label: "View",
              onClick: () => router.push(`/admin/orders/${order.id}`),
            },
          });

          if (playSound) {
            playNotificationSound();
          }

          onNewOrderRef.current?.(order);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router, playSound]);
}
