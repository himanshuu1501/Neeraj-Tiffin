"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Himanshu Sharma",
    role: "Software Engineer",
    text: "TiffinHub has been a lifesaver! Fresh, homestyle food delivered right on time. The Veg Thali is my daily go-to.",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "College Student",
    text: "Affordable and delicious! The monthly subscription plan saves me so much time and money. Highly recommended!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    text: "Quality food that reminds me of home. The paneer paratha breakfast is absolutely amazing. Best tiffin service in Dehradun!",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground">Join hundreds of happy customers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
