import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  HeartHandshake,
  Stethoscope,
  Users,
  CheckCircle2,
  CalendarCheck,
  Award,
  ShieldCheck,
  MapPin,
  Lightbulb,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 md:pb-16 md:pt-20">
        <div className="rounded-3xl border border-blue-100 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm md:p-14">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-medium text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted Rural Healthcare
            Portal
          </div>
          <h1 className="text-5xl font-bold text-blue-800 md:text-7xl">Drishti</h1>
          <p className="mt-3 text-lg font-medium text-slate-700 md:text-2xl">
            Digital Rural Eye-Care & Smart Appointment Platform
          </p>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
            Helping patients avoid long waiting lines and making healthcare
            appointments simple, organized, and accessible, especially for rural
            and semi-urban families.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card className="border-blue-100 bg-white/80 backdrop-blur">
            <CardContent className="flex gap-4 p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">Our Purpose</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  We are committed to providing quality eye care to rural
                  communities. Our mission is to make eye treatment accessible,
                  affordable, and efficient for everyone.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-white/80 backdrop-blur">
            <CardContent className="flex gap-4 p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">Our Doctor</div>
                <div className="mt-1 text-sm font-medium text-slate-800">
                  Dr. Sandeep Verma
                </div>
                <p className="text-xs text-slate-500">MBBS, MS (Ophthalmology)</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Well-known eye specialist with 10+ years of experience in eye
                  care and surgeries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-blue-700">
          Our Impact
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Users, n: "12,450+", l: "Registered Patients" },
            { icon: Eye, n: "8,320+", l: "Patients Treated" },
            { icon: CheckCircle2, n: "2,150+", l: "Successful Operations" },
            { icon: CalendarCheck, n: "6,720+", l: "Appointments Completed" },
          ].map((stat) => (
            <Card
              key={stat.l}
              className="border-blue-100 bg-white/85 backdrop-blur transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-2xl font-bold text-blue-800 md:text-3xl">
                  {stat.n}
                </div>
                <div className="text-xs text-slate-500 md:text-sm">{stat.l}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 md:grid-cols-2">
        {[
          {
            icon: HeartHandshake,
            title: "Our Mission",
            description:
              "To deliver dignified, affordable, and timely eye-care to every village. We believe quality vision is a fundamental right, not a privilege.",
          },
          {
            icon: MapPin,
            title: "Rural Healthcare Support",
            description:
              "We work directly with village panchayats and primary health centres to reach patients in remote areas with mobile clinics and outreach camps.",
          },
          {
            icon: Lightbulb,
            title: "Eye Treatment Awareness",
            description:
              "Educating families about cataract, refractive errors, diabetic retinopathy, and preventive eye care through community programs.",
          },
          {
            icon: Award,
            title: "Trusted Healthcare Process",
            description:
              "Government-aligned protocols, qualified specialists, transparent records, and a fair appointment queue with no middlemen and no chaos.",
          },
        ].map((section) => (
          <Card
            key={section.title}
            className="border-blue-100 bg-white/80 backdrop-blur"
          >
            <CardContent className="flex gap-4 p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
                <section.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">
                  {section.title}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {section.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 md:p-12">
          <h3 className="text-center text-2xl font-bold text-blue-800 md:text-3xl">
            How Drishti Works
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
            A simple 4-step process designed for everyone with no technical
            skills needed.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              {
                n: "1",
                t: "Register",
                d: "Create your free patient account in under a minute.",
              },
              {
                n: "2",
                t: "Apply",
                d: "Describe your problem and upload any medical reports.",
              },
              {
                n: "3",
                t: "Approval",
                d: "Doctor reviews your case and assigns a date and time.",
              },
              {
                n: "4",
                t: "Visit",
                d: "Show up at your slot with no queue and no waiting.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-blue-100 bg-white p-5 text-center"
              >
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-600 font-semibold text-white">
                  {step.n}
                </div>
                <div className="mt-3 font-semibold text-blue-800">{step.t}</div>
                <p className="mt-1 text-sm text-slate-600">{step.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/register">Get Started - It's Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
