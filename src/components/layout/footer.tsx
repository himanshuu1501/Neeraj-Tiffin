import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍱</span>
              <span className="text-xl font-bold">TiffinHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fresh, homestyle tiffin delivered to your doorstep. Quality meals made with love.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/menu" className="hover:text-primary">Menu</Link></li>
              <li><Link href="/subscriptions" className="hover:text-primary">Subscription Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">My Orders</Link></li>
              <li><Link href="/login" className="hover:text-primary">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/menu?category=breakfast" className="hover:text-primary">Breakfast</Link></li>
              <li><Link href="/menu?category=lunch" className="hover:text-primary">Lunch</Link></li>
              <li><Link href="/menu?category=dinner" className="hover:text-primary">Dinner</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@tiffinhub.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dehradun, Uttarakhand
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TiffinHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
