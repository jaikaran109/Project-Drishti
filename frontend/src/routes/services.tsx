import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, ScanEye, ClipboardList, Headphones } from "lucide-react";

export const Route = createFileRoute("/services")({ component: Services });

function Services() {
  const items = [
    {
      icon: ScanEye,
      title: "Comprehensive Eye Exams",
      description: "Full evaluation of vision and eye health.",
    },
    {
      icon: Stethoscope,
      title: "Specialist Consultations",
      description: "Direct access to MS Ophthalmology experts.",
    },
    {
      icon: ClipboardList,
      title: "Appointment Queue",
      description: "No waiting in lines. Show up at your exact slot.",
    },
    {
      icon: Headphones,
      title: "Patient Support",
      description: "Help available in local language over phone.",
    },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-800 md:text-4xl">
          Our Services
        </h1>
        <p className="mt-3 text-slate-600">
          Designed to be simple, organized, and rural-friendly.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.title} className="border-blue-100 bg-white/90">
              <CardContent className="flex gap-4 p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-blue-800">{item.title}</div>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
