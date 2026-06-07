"use client";

import { Check, Circle } from "lucide-react";
import { cn, getStatusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

const ORDER_STEPS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
];

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <Circle className="h-4 w-4 fill-current" />
        <span className="font-medium">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.indexOf(status);

  return (
    <div className="space-y-0">
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground/30" />
                )}
              </div>
              {index < ORDER_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8",
                    index < currentIndex ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
            <div className="pb-8">
              <p
                className={cn(
                  "font-medium",
                  isCurrent && "text-primary",
                  !isCompleted && "text-muted-foreground"
                )}
              >
                {getStatusLabel(step)}
              </p>
              {isCurrent && (
                <p className="text-sm text-muted-foreground">Current status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
