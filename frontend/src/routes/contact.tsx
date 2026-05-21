import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 grid md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Contact Us</h1>
          <p className="mt-3 text-slate-600">We're here to help. Reach us anytime.</p>
          <div className="mt-6 space-y-3">
            {[
              { icon: Phone, k: "Phone", v: "1800-123-4567 (Toll Free)" },
              { icon: Mail, k: "Email", v: "support@drishti.health" },
              { icon: MapPin, k: "Address", v: "Drishti Eye Care Centre, Sitapur, Uttar Pradesh - 261001" },
            ].map((c) => (
              <Card key={c.k} className="border-blue-100 bg-white/90">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-700"><c.icon className="h-5 w-5" /></div>
                  <div>
                    <div className="text-xs text-slate-500">{c.k}</div>
                    <div className="font-medium text-slate-800">{c.v}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="border-blue-100 bg-white/90">
          <CardContent className="p-6">
            <h2 className="font-semibold text-blue-800">Send us a message</h2>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent. We will get back soon."); }}>
              <div><Label>Name</Label><Input className="h-11 mt-1" placeholder="Your full name" /></div>
              <div><Label>Phone</Label><Input className="h-11 mt-1" placeholder="Phone number" /></div>
              <div><Label>Message</Label><Textarea className="min-h-28 mt-1" placeholder="How can we help?" /></div>
              <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">Send</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
