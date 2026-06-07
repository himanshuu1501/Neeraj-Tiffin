"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              🍱 Fresh Homestyle Meals
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Delicious Tiffin{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Delivered Daily
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience the taste of home with our freshly prepared breakfast, lunch, and dinner tiffins. Made with love, delivered with care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg" className="gap-2">
                  Order Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/subscriptions">
                <Button size="lg" variant="outline">
                  View Plans
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 p-1 shadow-2xl">
              <div className="h-full w-full rounded-[22px] bg-background flex items-center justify-center text-8xl">
                🍛
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span className="text-sm font-medium">500+ Happy Customers</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-lg border">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Free Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Clock, title: "On-Time Delivery", desc: "Fresh meals at your doorstep" },
            { icon: Heart, title: "Homestyle Cooking", desc: "Made with authentic recipes" },
            { icon: Truck, title: "Wide Coverage", desc: "Delivering across Dehradun" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border"
            >
              <div className="p-3 rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
