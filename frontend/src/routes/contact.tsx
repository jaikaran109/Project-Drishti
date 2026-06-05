import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock3 } from "lucide-react";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const contactItems = [
    { icon: Phone, label: "Phone", value: "1800-123-4567 (Toll Free)" },
    { icon: Mail, label: "Email", value: "support@drishti.health" },
    {
      icon: MapPin,
      label: "Address",
      value: "Drishti Eye Care Centre, Sitapur, Uttar Pradesh - 261001",
    },
    {
      icon: Clock3,
      label: "Clinic Hours",
      value: "Monday to Saturday, 9:00 AM to 5:00 PM",
    },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 md:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-slate-600">
            Reach our team for appointment guidance, registration help, or clinic
            visit information.
          </p>
          <div className="mt-6 space-y-3">
            {contactItems.map((item) => (
              <Card key={item.label} className="border-blue-100 bg-white/90">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="font-medium text-slate-800">{item.value}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-blue-100 bg-white/90">
          <CardContent className="p-6">
            <h2 className="font-semibold text-blue-800">Before You Visit</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <GuideItem text="Carry your appointment ID or registered phone number." />
              <GuideItem text="Bring previous prescriptions or medical reports if available." />
              <GuideItem text="Reach 15 minutes before your confirmed appointment time." />
              <GuideItem text="For urgent help, please call the clinic directly instead of waiting for an online response." />
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}

function GuideItem({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-4 py-3">
      {text}
    </div>
  );
}
