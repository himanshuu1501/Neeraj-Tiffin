import { formatCurrency, formatOrderTime } from "@/lib/utils";
import type { OrderItem } from "@/types/database";

interface WhatsAppOrderParams {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: Pick<OrderItem, "item_name" | "quantity">[];
  totalAmount: number;
  address: string;
  orderTime: string;
}

export function generateWhatsAppMessage(params: WhatsAppOrderParams): string {
  const itemsList = params.items
    .map((item) => `${item.quantity} × ${item.item_name}`)
    .join("\n");

  return [
    "New Tiffin Order",
    "",
    `Order ID: #${params.orderNumber}`,
    "",
    "Customer:",
    `Name: ${params.customerName}`,
    `Phone: ${params.customerPhone}`,
    "",
    "Items:",
    itemsList,
    "",
    `Total: ${formatCurrency(params.totalAmount)}`,
    "",
    "Address:",
    params.address,
    "",
    "Order Time:",
    formatOrderTime(params.orderTime),
  ].join("\n");
}

export function getWhatsAppUrl(message: string, ownerPhone?: string): string {
  const phone = ownerPhone || process.env.NEXT_PUBLIC_WHATSAPP_OWNER_PHONE || "";
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
