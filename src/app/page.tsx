import { Hero } from "@/components/landing/hero";
import { MealSection } from "@/components/landing/meal-section";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { createClient } from "@/lib/supabase/server";
import { MenuCard } from "@/components/menu/menu-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("popularity", { ascending: false })
    .limit(3);

  return (
    <>
      <Hero />

      {featured && featured.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">⭐ Featured Meals</h2>
              <Link href="/menu">
                <Button variant="outline">View Menu</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <MealSection title="Breakfast" category="breakfast" emoji="🌅" />
      <MealSection title="Lunch" category="lunch" emoji="☀️" />
      <MealSection title="Dinner" category="dinner" emoji="🌙" />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
