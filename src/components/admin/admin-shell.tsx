"use client";

import { AdminRealtimeProvider } from "@/components/admin/admin-realtime-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminRealtimeProvider>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <div className="flex-1 p-4 lg:p-8 lg:ml-0 ml-0">{children}</div>
      </div>
    </AdminRealtimeProvider>
  );
}
