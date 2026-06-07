"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAdminRealtime } from "@/components/admin/admin-realtime-provider";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, showBadge: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, showBadge: true },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, showBadge: false },
  { href: "/admin/customers", label: "Customers", icon: Users, showBadge: false },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, showBadge: false },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Calendar, showBadge: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, showBadge: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { unreadCount } = useAdminRealtime();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-20 left-4 z-50"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const badgeCount = link.showBadge ? unreadCount : 0;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{link.label}</span>
                {badgeCount > 0 && (
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                      isActive
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
