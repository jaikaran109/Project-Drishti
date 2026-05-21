import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Eye, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">About Drishti</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Drishti is a digital eye-care and healthcare management platform built specifically for
          rural and semi-urban communities. We work alongside qualified ophthalmologists and
          government primary health centres to bring trustworthy, organized care to every village.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, t: "Trusted", d: "Government-aligned protocols and verified specialists only." },
            { icon: Eye, t: "Focused", d: "Specialized in eye-care: cataract, refraction, diabetic retinopathy." },
            { icon: HeartHandshake, t: "Caring", d: "Built for non-technical users in simple language and large UI." },
          ].map((c) => (
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
