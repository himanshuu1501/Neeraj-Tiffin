import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayInstance } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing orderId or amount" }, { status: 400 });
    }

    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderId,
    });

    await supabase.from("payments").insert({
      user_id: user.id,
      order_id: orderId,
      razorpay_order_id: razorpayOrder.id,
      amount,
      status: "pending",
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
