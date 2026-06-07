"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { MenuItem } from "@/types/database";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!item.available) {
      toast.error("This item is currently unavailable");
      return;
    }
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image_url || "/placeholder-food.svg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <Badge className="absolute top-3 left-3 capitalize">{item.category}</Badge>
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Unavailable</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>

        {quantity > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {formatCurrency(item.price * quantity)}
            </span>
          </div>
        ) : (
          <Button
            className="w-full gap-2"
            onClick={handleAdd}
            disabled={!item.available}
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
