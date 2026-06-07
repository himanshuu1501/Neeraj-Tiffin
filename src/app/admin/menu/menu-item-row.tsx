"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { deleteMenuItem, toggleAvailability } from "@/lib/actions/menu";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { MenuItem } from "@/types/database";

interface MenuItemRowProps {
  item: MenuItem;
}

export function MenuItemRow({ item }: MenuItemRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async (available: boolean) => {
    const result = await toggleAvailability(item.id, available);
    if (result.error) toast.error(result.error);
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this menu item?")) return;
    setLoading(true);
    const result = await deleteMenuItem(item.id);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Item deleted");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-4 flex gap-4 items-center">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
          <Image
            src={item.image_url || "/placeholder-food.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{item.name}</h3>
            <Badge variant="outline" className="capitalize shrink-0">
              {item.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
          <p className="font-medium text-primary mt-1">{formatCurrency(item.price)}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Switch
            checked={item.available}
            onCheckedChange={handleToggle}
          />
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
