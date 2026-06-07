"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, Sun, Moon, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "next-themes";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { useState } from "react";

interface HeaderProps {
  profile: Profile | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/subscriptions", label: "Plans" },
];

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = itemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍱</span>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            TiffinHub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </Link>

          {profile ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href={profile.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {profile.role === "admin" ? "Admin" : "Dashboard"}
                </Button>
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="icon" type="submit">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {profile ? (
            <>
              <Link
                href={profile.role === "admin" ? "/admin" : "/dashboard"}
                className="block py-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit" className="w-full">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
