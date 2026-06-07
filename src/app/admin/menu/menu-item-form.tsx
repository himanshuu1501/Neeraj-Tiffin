"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema, type MenuItemInput } from "@/lib/validations/schemas";
import { createMenuItem, uploadMenuImage } from "@/lib/actions/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MenuItemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: { available: true, category: "lunch" },
  });

  const available = watch("available");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMenuImage(formData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.url) {
      setImageUrl(result.url);
      setValue("image_url", result.url);
      toast.success("Image uploaded!");
    }
  };

  const onSubmit = async (data: MenuItemInput) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (imageUrl) formData.append("image_url", imageUrl);

    const result = await createMenuItem(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Menu item created!");
      reset();
      setImageUrl("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Food Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label>Category</Label>
            <Select
              defaultValue="lunch"
              onValueChange={(v) => setValue("category", v as MenuItemInput["category"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" {...register("price", { valueAsNumber: true })} />
            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={available}
              onCheckedChange={(v) => setValue("available", v)}
            />
            <Label>Available</Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
