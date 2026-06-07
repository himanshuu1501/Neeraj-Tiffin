import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json();

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("razorpay_order_id", razorpay_order_id);

      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await supabase
      .from("payments")
      .update({
        status: "paid",
        razorpay_payment_id,
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (orderId) {
      await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("id", orderId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
