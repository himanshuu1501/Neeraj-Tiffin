"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSubscriptionStatus } from "@/lib/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { SubscriptionStatus } from "@/types/database";

interface AdminSubscriptionActionsProps {
  subscriptionId: string;
  currentStatus: SubscriptionStatus;
}

export function AdminSubscriptionActions({
  subscriptionId,
  currentStatus,
}: AdminSubscriptionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatus = async (status: SubscriptionStatus) => {
    setLoading(true);
    const result = await updateSubscriptionStatus(subscriptionId, status);
    if (result.error) toast.error(result.error);
    else {
      toast.success(`Subscription ${status}`);
      router.refresh();
    }
    setLoading(false);
  };

  if (currentStatus === "cancelled") return null;

  return (
    <div className="flex gap-2">
      {currentStatus === "active" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatus("paused")}
          disabled={loading}
        >
          Pause
        </Button>
      )}
      {currentStatus === "paused" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatus("active")}
          disabled={loading}
        >
          Resume
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleStatus("cancelled")}
        disabled={loading}
      >
        Cancel
      </Button>
    </div>
  );
}
