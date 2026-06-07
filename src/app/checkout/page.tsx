"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/schemas";
import { useCart } from "@/hooks/use-cart";
import { placeOrder } from "@/lib/actions/orders";
import { generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const cartTotal = total();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutInput) => {
    setLoading(true);
    try {
      const result = await placeOrder(items, data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.order) {
        const message = generateWhatsAppMessage({
          orderNumber: result.order.order_number,
          customerName: data.name,
          customerPhone: data.phone,
          items: result.order.order_items.map(
            (item: { item_name: string; quantity: number }) => ({
              item_name: item.item_name,
              quantity: item.quantity,
            })
          ),
          totalAmount: result.order.total_amount,
          address: `${data.address}, ${data.city}`,
          orderTime: result.order.created_at,
        });

        clearCart();
        const whatsappUrl = getWhatsAppUrl(message);
        window.open(whatsappUrl, "_blank");

        router.push(
          `/order-success?order=${result.order.order_number}&id=${result.order.id}`
        );
      }
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...register("phone")} placeholder="9876543210" />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" {...register("address")} />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state")} />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" {...register("pincode")} />
                    {errors.pincode && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialInstructions">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="specialInstructions"
                    {...register("specialInstructions")}
                    placeholder="Any dietary preferences or delivery notes..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>
                        {formatCurrency(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(cartTotal)}</span>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Order will be sent via WhatsApp to the kitchen
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
