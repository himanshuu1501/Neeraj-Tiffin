import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Contact() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground">We&apos;d love to hear from you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Phone, title: "Phone", value: "+91 98765 43210" },
            { icon: Mail, title: "Email", value: "hello@tiffinhub.com" },
            { icon: MapPin, title: "Address", value: "Dehradun, Uttarakhand" },
            { icon: Clock, title: "Hours", value: "Mon-Sat: 7AM - 9PM" },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6 text-center">
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
