import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, HeartHandshake, Stethoscope, Users, CheckCircle2, CalendarCheck, Award, ShieldCheck, MapPin, Clock, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="rounded-3xl border border-blue-100 bg-white/70 backdrop-blur-sm shadow-sm p-8 md:p-14 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-medium text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted Rural Healthcare Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-blue-800">Drishti</h1>
          <p className="mt-3 text-lg md:text-2xl font-medium text-slate-700">
            Digital Rural Eye-Care & Smart Appointment Platform
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-slate-600 leading-relaxed">
            Helping patients avoid long waiting lines and making healthcare appointments simple,
            organized, and accessible — especially for rural and semi-urban families.
          </p>
        </div>

        {/* Purpose + Doctor */}
        <div className="grid md:grid-cols-2 gap-5 mt-6">
          <Card className="border-blue-100 bg-white/80 backdrop-blur">
            <CardContent className="p-6 flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">Our Purpose</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  We are committed to providing quality eye care to rural communities. Our mission
                  is to make eye treatment accessible, affordable and efficient for everyone.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-white/80 backdrop-blur">
            <CardContent className="p-6 flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">Our Doctor</div>
                <div className="mt-1 text-sm font-medium text-slate-800">Dr. Sandeep Verma</div>
                <p className="text-xs text-slate-500">MBBS, MS (Ophthalmology)</p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Well-known Eye Specialist with 10+ years of experience in eye care and surgeries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-blue-700">Our Impact</h2>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, n: "12,450+", l: "Registered Patients" },
            { icon: Eye, n: "8,320+", l: "Patients Treated" },
            { icon: CheckCircle2, n: "2,150+", l: "Successful Operations" },
            { icon: CalendarCheck, n: "6,720+", l: "Appointments Completed" },
          ].map((s) => (
            <Card key={s.l} className="border-blue-100 bg-white/85 backdrop-blur hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-2xl md:text-3xl font-bold text-blue-800">{s.n}</div>
                <div className="text-xs md:text-sm text-slate-500">{s.l}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission / Rural / Awareness / Process */}
      <section className="mx-auto max-w-7xl px-4 pb-16 grid md:grid-cols-2 gap-5">
        {[
          { icon: HeartHandshake, t: "Our Mission", d: "To deliver dignified, affordable and timely eye-care to every village. We believe quality vision is a fundamental right, not a privilege." },
          { icon: MapPin, t: "Rural Healthcare Support", d: "We work directly with village panchayats and primary health centres to reach patients in remote areas with mobile clinics and outreach camps." },
          { icon: Lightbulb, t: "Eye Treatment Awareness", d: "Educating families about cataract, refractive errors, diabetic retinopathy and preventive eye care through community programs." },
          { icon: Award, t: "Trusted Healthcare Process", d: "Government-aligned protocols, qualified specialists, transparent records, and a fair appointment queue — no middlemen, no chaos." },
        ].map((s) => (
          <Card key={s.t} className="border-blue-100 bg-white/80 backdrop-blur">
            <CardContent className="p-6 flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">{s.t}</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 md:p-12">
          <h3 className="text-center text-2xl md:text-3xl font-bold text-blue-800">How Drishti Works</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
            A simple, 4-step process designed for everyone — no technical skills needed.
          </p>
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            {[
              { n: "1", t: "Register", d: "Create your free patient account in under a minute." },
              { n: "2", t: "Apply", d: "Describe your problem and upload any medical reports." },
              { n: "3", t: "Approval", d: "Doctor reviews your case and assigns a date & time." },
              { n: "4", t: "Visit", d: "Show up at your slot — no queue, no waiting." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-blue-100 p-5 text-center">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white font-semibold">{s.n}</div>
                <div className="mt-3 font-semibold text-blue-800">{s.t}</div>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Get Started — It's Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
