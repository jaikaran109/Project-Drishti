import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, FilePlus, Files, User as UserIcon, Camera, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Application, getApplications } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (role !== "user") { navigate({ to: "/login" }); return; }
    const all = getApplications();
    setApps(all.filter((a) => a.phone === user?.phone || a.patientName === user?.name));
  }, [role, user]);

  if (!user) return null;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="border-blue-100 bg-white/90 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="mx-auto relative">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blue-100 text-blue-700">
                  <UserIcon className="h-12 w-12" />
                </div>
                <button className="absolute bottom-0 right-1/2 translate-x-12 grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white shadow">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-4 font-semibold text-blue-800">{user.name}</div>
              <div className="text-sm text-slate-500">{user.phone}</div>
              {user.address && <div className="mt-2 text-xs text-slate-500 leading-snug">{user.address}</div>}
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-white/90 backdrop-blur">
            <CardContent className="p-2">
              <SideItem icon={Files} label="Dashboard" active />
              <SideItem icon={CalendarPlus} label="My Applications" />
              <SideItem icon={UserIcon} label="Profile" />
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <div className="space-y-5">
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-blue-800">Welcome, {user.name.split(" ")[0]}</h1>
                <p className="text-sm text-slate-600">We are here to help you.</p>
              </div>
              <Link to="/apply">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <CalendarPlus className="h-4 w-4" /> Apply for Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-semibold text-blue-800 mb-3">Your Applications</h2>
            {apps.length === 0 ? (
              <Card className="border-blue-100 bg-white/85">
                <CardContent className="p-8 text-center text-slate-500">
                  <FilePlus className="mx-auto h-8 w-8 text-blue-400" />
                  <div className="mt-2 text-sm">You have no applications yet.</div>
                  <Link to="/apply"><Button className="mt-4 bg-blue-600 hover:bg-blue-700">Apply Now</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {apps.map((a) => <AppStatusCard key={a.id} a={a} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function SideItem({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-blue-50/60"}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

export function AppStatusCard({ a }: { a: Application }) {
  if (a.status === "Approved") {
    return (
      <Card className="border-green-200 bg-green-50/60">
        <CardContent className="p-5 flex gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-700"><CheckCircle2 className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-green-800">Confirmed</div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{a.id}</Badge>
            </div>
            <div className="text-sm text-slate-600">Your appointment is scheduled.</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div><div className="text-xs text-slate-500">Date</div><div className="font-medium">{a.appointmentDate}</div></div>
              <div><div className="text-xs text-slate-500">Time</div><div className="font-medium">{a.appointmentTime}</div></div>
              <div><div className="text-xs text-slate-500">Queue #</div><div className="font-medium">{a.queueNumber}</div></div>
            </div>
            <div className="mt-2 text-xs text-slate-500">Please reach 15 minutes before your slot with this ID.</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (a.status === "Rejected") {
    return (
      <Card className="border-red-200 bg-red-50/60">
        <CardContent className="p-5 flex gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-700"><XCircle className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-red-800">Rejected</div>
              <Badge variant="secondary">{a.id}</Badge>
            </div>
            <div className="text-sm text-slate-600">Sorry, your application has been rejected.</div>
            <div className="mt-1 text-xs text-slate-500"><span className="font-medium">Reason:</span> {a.rejectReason || "Not specified"}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-amber-200 bg-amber-50/60">
      <CardContent className="p-5 flex gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700"><Clock className="h-5 w-5" /></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-amber-800">Pending</div>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{a.id}</Badge>
          </div>
          <div className="text-sm text-slate-600">Your application is under review. We will update you soon.</div>
          <div className="mt-1 text-xs text-slate-500">Submitted: {a.createdAt}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 self-center" />
      </CardContent>
    </Card>
  );
}
