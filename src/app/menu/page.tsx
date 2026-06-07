import { createClient } from "@/lib/supabase/server";
import { MenuPageClient } from "./menu-client";

export const metadata = {
  title: "Menu",
  description: "Browse our delicious tiffin menu - breakfast, lunch, and dinner options.",
};

interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("menu_items").select("*").eq("available", true);

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("popularity", { ascending: false });
  }

  const { data: items } = await query;

  return (
    <MenuPageClient
      items={items || []}
      initialCategory={params.category}
      initialSearch={params.search}
      initialSort={params.sort}
    />
  );
}
