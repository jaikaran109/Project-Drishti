import { createFileRoute, Link } from "@tanstack/react-router";
import {
  type LucideIcon,
  CalendarPlus,
  FilePlus,
  Files,
  UserRound,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  CalendarCheck,
  MapPin,
  Hash,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useApplications } from "@/hooks/use-applications";
import { type Application } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, canRender, isReady } = useAuthGuard("user");
  const { applications, isLoading } = useApplications(canRender);

  if (!isReady) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-8 text-center text-slate-500">
              Loading your dashboard...
            </CardContent>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  if (!canRender || !user) return null;

  const welcomeName = user.name.split(" ")[0] || user.name;
  const confirmedAppointments = applications.filter((a) => a.status === "approved");
  const latestConfirmed = confirmedAppointments[0] ?? null;

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[300px_1fr]">

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="border-blue-100 bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700">
                <UserRound className="h-10 w-10" />
              </div>
              <div className="mt-4 text-center">
                <div className="font-semibold text-blue-800">{user.name}</div>
                <div className="text-sm text-slate-500">{user.phone}</div>
                <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100">Patient</Badge>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <ProfileRow label="Guardian" value={user.fatherName} />
                <ProfileRow label="Email" value={user.email || "Not provided"} />
                <ProfileRow label="Address" value={user.address || "Not provided"} />
                <ProfileRow
                  label="Age / Gender"
                  value={`${user.age ?? "NA"} / ${user.gender || "NA"}`}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-white/90 backdrop-blur">
            <CardContent className="space-y-1 p-2">
              <NavItem to="/dashboard" icon={Files} label="Dashboard" active />
              <NavItem to="/profile" icon={UserRound} label="Profile" />
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="space-y-5">

          {/* Welcome banner */}
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-blue-800 md:text-2xl">
                  Welcome, {welcomeName} 👋
                </h1>
                <p className="text-sm text-slate-500">
                  Track your appointment requests and check your confirmed schedule.
                </p>
              </div>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/apply">
                  <CalendarPlus className="h-4 w-4" /> Apply for Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ✅ Appointment Confirmed Notification */}
          {latestConfirmed && (
            <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm shadow-green-100">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                    <Bell className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-green-800 text-lg">
                        🎉 Your Appointment is Confirmed!
                      </p>
                      <Badge className="bg-green-600 text-white hover:bg-green-600">New</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      The clinic has reviewed your request and fixed your appointment. Please arrive <span className="font-semibold">15 minutes early</span> and carry this confirmation.
                    </p>
                    <Separator className="my-3 bg-green-200" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <AppointmentDetail
                        icon={CalendarCheck}
                        label="Date"
                        value={latestConfirmed.appointmentDate || "--"}
                        color="text-green-700"
                      />
                      <AppointmentDetail
                        icon={Clock}
                        label="Time"
                        value={latestConfirmed.appointmentTime || "--"}
                        color="text-green-700"
                      />
                      <AppointmentDetail
                        icon={Hash}
                        label="Queue No."
                        value={latestConfirmed.queueNumber ? `#${latestConfirmed.queueNumber}` : "--"}
                        color="text-green-700"
                      />
                      <AppointmentDetail
                        icon={MapPin}
                        label="Venue"
                        value="Drishti Clinic"
                        color="text-green-700"
                      />
                    </div>
                    <div className="mt-3 rounded-lg border border-green-200 bg-white/60 px-3 py-2 text-xs text-slate-600">
                      <span className="font-medium">Problem:</span> {latestConfirmed.problem}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applications list */}
          <div id="applications">
            <h2 className="mb-3 font-semibold text-blue-800">All Your Applications</h2>
            {isLoading ? (
              <Card className="border-blue-100 bg-white/85">
                <CardContent className="p-8 text-center text-slate-500">
                  Loading your applications...
                </CardContent>
              </Card>
            ) : applications.length === 0 ? (
              <Card className="border-blue-100 bg-white/85">
                <CardContent className="p-8 text-center text-slate-500">
                  <FilePlus className="mx-auto h-8 w-8 text-blue-300" />
                  <div className="mt-2 text-sm">You have no applications yet.</div>
                  <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Link to="/apply">Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {applications.map((application) => (
                  <AppStatusCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function AppointmentDetail({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Icon className={`h-3 w-3 ${color}`} /> {label}
      </div>
      <div className={`font-bold text-base ${color}`}>{value}</div>
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: "/dashboard" | "/profile";
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active ? "bg-blue-50 font-medium text-blue-700" : "text-slate-600 hover:bg-blue-50/60"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-slate-700">{value}</div>
    </div>
  );
}

function AppStatusCard({ application }: { application: Application }) {
  if (application.status === "approved") {
    return (
      <Card className="border-green-200 bg-green-50/60">
        <CardContent className="flex gap-4 p-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-green-800">Appointment Confirmed ✅</div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                #{application.queueNumber ?? "--"}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">{application.problem}</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <StatusInfo label="Date" value={application.appointmentDate || "--"} />
              <StatusInfo label="Time" value={application.appointmentTime || "--"} />
              <StatusInfo label="Queue" value={application.queueNumber ? `#${application.queueNumber}` : "--"} />
            </div>
            <p className="mt-2 text-xs text-green-700 font-medium">
              📍 Please arrive 15 minutes early at Drishti Clinic with this confirmation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (application.status === "rejected") {
    return (
      <Card className="border-red-200 bg-red-50/60">
        <CardContent className="flex gap-4 p-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-red-800">Application Rejected</div>
              <Badge variant="secondary" className="text-xs">Closed</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">{application.problem}</div>
            <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-slate-600">
              <span className="font-medium text-red-700">Reason:</span>{" "}
              {application.rejectReason || "Not specified"}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              You can submit a new application with updated details.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/60">
      <CardContent className="flex gap-4 p-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
          <Clock className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-amber-800">Pending Review</div>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs">Waiting</Badge>
          </div>
          <div className="mt-1 text-sm text-slate-600">{application.problem}</div>
          <p className="mt-2 text-xs text-slate-500">
            Submitted on {application.createdAt} — the clinic staff will review and confirm your appointment soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-slate-700">{value}</div>
    </div>
  );
}
