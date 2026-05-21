import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Microscope, Glasses, Syringe, Activity, Bed } from "lucide-react";

export const Route = createFileRoute("/facilities")({ component: Facilities });

function Facilities() {
  const items = [
    { icon: Microscope, t: "Modern Diagnostics", d: "Slit-lamp, auto-refractor, tonometer and OCT support." },
    { icon: Glasses, t: "Vision Testing", d: "Free eye-checkup and prescription for refractive errors." },
    { icon: Syringe, t: "Cataract Surgery", d: "Phaco and SICS surgeries by experienced specialists." },
    { icon: Activity, t: "Diabetic Retinopathy", d: "Screening and management for diabetes-related vision issues." },
    { icon: Bed, t: "Inpatient Care", d: "Clean post-op recovery rooms with nursing support." },
    { icon: Building2, t: "Mobile Camps", d: "Periodic outreach camps in nearby villages." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Our Facilities</h1>
        <p className="mt-3 text-slate-600">A complete range of eye-care services under one trusted roof.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {items.map((c) => (
            <Card key={c.t} className="border-blue-100 bg-white/90">
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><c.icon className="h-5 w-5" /></div>
                <div className="mt-3 font-semibold text-blue-800">{c.t}</div>
                <p className="mt-1 text-sm text-slate-600">{c.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
