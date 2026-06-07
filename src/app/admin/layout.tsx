import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  return <AdminShell>{children}</AdminShell>;
}
