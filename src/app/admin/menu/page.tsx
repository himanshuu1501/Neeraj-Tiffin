import { createClient } from "@/lib/supabase/server";
import { MenuItemForm } from "./menu-item-form";
import { MenuItemRow } from "./menu-item-row";

export const metadata = { title: "Menu Management" };

export default async function AdminMenuPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Menu Management</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <MenuItemForm />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {items && items.length > 0 ? (
            items.map((item) => <MenuItemRow key={item.id} item={item} />)
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No menu items yet. Add your first item.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
