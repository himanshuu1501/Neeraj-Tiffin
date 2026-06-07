import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getProfile } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TiffinHub - Fresh Homestyle Tiffin Delivery",
    template: "%s | TiffinHub",
  },
  description:
    "Order fresh, homestyle tiffin meals delivered to your doorstep. Breakfast, lunch, and dinner plans available.",
  keywords: ["tiffin", "food delivery", "homestyle meals", "subscription"],
  openGraph: {
    title: "TiffinHub - Fresh Homestyle Tiffin Delivery",
    description: "Order fresh, homestyle tiffin meals delivered to your doorstep.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header profile={profile} />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
