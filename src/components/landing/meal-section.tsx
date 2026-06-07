import Link from "next/link";
import { MenuCard } from "@/components/menu/menu-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { MealCategory } from "@/types/database";

interface MealSectionProps {
  title: string;
  category: MealCategory;
  emoji: string;
}

export async function MealSection({ title, category, emoji }: MealSectionProps) {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category", category)
    .eq("available", true)
    .order("popularity", { ascending: false })
    .limit(3);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-2xl mr-2">{emoji}</span>
            <h2 className="text-2xl md:text-3xl font-bold inline">{title}</h2>
          </div>
          <Link href={`/menu?category=${category}`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
