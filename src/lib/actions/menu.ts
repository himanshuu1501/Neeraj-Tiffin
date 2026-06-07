"use server";

import { createClient } from "@/lib/supabase/server";
import { menuItemSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient();

  const parsed = menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    available: formData.get("available") === "true",
    image_url: formData.get("image_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("menu_items").insert({
    name: parsed.data.name,
    description: parsed.data.description,
    category: parsed.data.category,
    price: parsed.data.price,
    available: parsed.data.available,
    image_url: parsed.data.image_url || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = await createClient();

  const parsed = menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    available: formData.get("available") === "true",
    image_url: formData.get("image_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("menu_items")
    .update({
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category,
      price: parsed.data.price,
      available: parsed.data.available,
      image_url: parsed.data.image_url || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function toggleAvailability(id: string, available: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_items")
    .update({ available })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { success: true };
}

export async function uploadMenuImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) return { error: "No file provided" };

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file);

  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu-images").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}
