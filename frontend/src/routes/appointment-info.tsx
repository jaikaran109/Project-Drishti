import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/appointment-info")({ component: Info });

function Info() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Appointment Info</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Drishti uses a fair, queue-based appointment system. After you apply, the doctor reviews
          your case and assigns a confirmed date, time and queue number.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: Clock, t: "Pending", d: "Your application is under review. We will update you soon.", c: "bg-amber-50 border-amber-200 text-amber-800" },
            { icon: CheckCircle2, t: "Confirmed", d: "Date, time and queue number assigned. Reach 15 min early.", c: "bg-green-50 border-green-200 text-green-800" },
            { icon: XCircle, t: "Rejected", d: "Application could not be approved. Reason will be shared.", c: "bg-red-50 border-red-200 text-red-800" },
          ].map((s) => (
            <Card key={s.t} className={`${s.c}`}>
              <CardContent className="p-6">
                <s.icon className="h-6 w-6" />
                <div className="mt-2 font-semibold">{s.t}</div>
                <p className="text-sm opacity-80 mt-1">{s.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-8 text-center">
            <CalendarCheck className="mx-auto h-8 w-8 text-blue-700" />
            <h2 className="mt-2 text-xl font-semibold text-blue-800">Ready to book?</h2>
            <p className="text-sm text-slate-600 mt-1">Create your account and apply in under 2 minutes.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/register"><Button className="bg-blue-600 hover:bg-blue-700">Register</Button></Link>
              <Link to="/login"><Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Login</Button></Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
