"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What areas do you deliver to?",
    a: "We currently deliver across Dehradun city. Enter your pincode at checkout to confirm delivery availability.",
  },
  {
    q: "What are your delivery timings?",
    a: "Breakfast: 7-9 AM, Lunch: 12-2 PM, Dinner: 7-9 PM. Subscription meals are delivered at your preferred time slot.",
  },
  {
    q: "Can I customize my meal?",
    a: "Yes! Add special instructions at checkout. For subscriptions, you can set meal preferences (veg/non-veg).",
  },
  {
    q: "How do subscription plans work?",
    a: "Choose weekly or monthly plans. Meals are delivered daily to your address. You can pause or cancel anytime.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, cards, net banking via Razorpay. Cash on delivery is available for select areas.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-muted-foreground">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
