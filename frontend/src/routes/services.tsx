import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, ScanEye, ClipboardList, Headphones } from "lucide-react";

export const Route = createFileRoute("/services")({ component: Services });

function Services() {
  const items = [
    { icon: ScanEye, t: "Comprehensive Eye Exams", d: "Full evaluation of vision and eye-health." },
    { icon: Stethoscope, t: "Specialist Consultations", d: "Direct access to MS Ophthalmology experts." },
    { icon: ClipboardList, t: "Appointment Queue", d: "No waiting in lines — show up at your exact slot." },
    { icon: Headphones, t: "Patient Support", d: "Help available in local language over phone." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Our Services</h1>
        <p className="mt-3 text-slate-600">Designed to be simple, organized and rural-friendly.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {items.map((c) => (
            <Card key={c.t} className="border-blue-100 bg-white/90">
              <CardContent className="p-6 flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white"><c.icon className="h-6 w-6" /></div>
                <div>
                  <div className="font-semibold text-blue-800">{c.t}</div>
                  <p className="mt-1 text-sm text-slate-600">{c.d}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
