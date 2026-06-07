"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations/schemas";
import { updateProfile } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || "",
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone || "");

    const result = await updateProfile(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input value={profile.email} disabled />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register("phone")} placeholder="9876543210" />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
