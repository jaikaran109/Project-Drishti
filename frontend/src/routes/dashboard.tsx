import { createFileRoute, Link } from "@tanstack/react-router";
import { type LucideIcon, CalendarPlus, FilePlus, Files, UserRound, Clock, CheckCircle2, XCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  if (!canRender || !user) {
    return null;
  }

  const welcomeName = user.name.split(" ")[0] || user.name;

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <Card id="profile-summary" className="border-blue-100 bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700">
                <UserRound className="h-10 w-10" />
              </div>
              <div className="mt-4 text-center">
                <div className="font-semibold text-blue-800">{user.name}</div>
                <div className="text-sm text-slate-500">{user.phone}</div>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <ProfileRow label="Guardian" value={user.fatherName} />
                <ProfileRow label="Email" value={user.email || "Not provided"} />
                <ProfileRow label="Address" value={user.address || "Not provided"} />
                <ProfileRow
                  label="Age / Gender"
                  value={`${user.age ? `${user.age}` : "NA"} / ${user.gender || "NA"}`}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-white/90 backdrop-blur">
            <CardContent className="space-y-1 p-2">
              <DashboardNavItem to="/dashboard" icon={Files} label="Dashboard" active />
              <AnchorNavItem href="#applications" icon={CalendarPlus} label="My Applications" />
              <DashboardNavItem to="/profile" icon={UserRound} label="Profile" />
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-5">
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-blue-800 md:text-2xl">
                  Welcome, {welcomeName}
                </h1>
                <p className="text-sm text-slate-600">
                  Track your appointment requests and stay updated on their status.
                </p>
              </div>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/apply">
                  <CalendarPlus className="h-4 w-4" /> Apply for Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div id="applications">
            <h2 className="mb-3 font-semibold text-blue-800">Your Applications</h2>
            {isLoading ? (
              <Card className="border-blue-100 bg-white/85">
                <CardContent className="p-8 text-center text-slate-500">
                  Loading your applications...
                </CardContent>
              </Card>
            ) : applications.length === 0 ? (
              <Card className="border-blue-100 bg-white/85">
                <CardContent className="p-8 text-center text-slate-500">
                  <FilePlus className="mx-auto h-8 w-8 text-blue-400" />
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

function DashboardNavItem({
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
        active
          ? "bg-blue-50 font-medium text-blue-700"
          : "text-slate-600 hover:bg-blue-50/60"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function AnchorNavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-blue-50/60"
    >
      <Icon className="h-4 w-4" /> {label}
    </a>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-slate-700">{value}</div>
    </div>
  );
}

function AppStatusCard({ application }: { application: Application }) {
  if (application.status === "approved") {
    return (
      <Card className="border-green-200 bg-green-50/60">
        <CardContent className="flex gap-4 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-green-800">Confirmed</div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {application.id}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">{application.problem}</div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <StatusInfo label="Date" value={application.appointmentDate || "--"} />
              <StatusInfo label="Time" value={application.appointmentTime || "--"} />
              <StatusInfo
                label="Queue #"
                value={application.queueNumber ? String(application.queueNumber) : "--"}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Please reach 15 minutes early with this application ID.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (application.status === "rejected") {
    return (
      <Card className="border-red-200 bg-red-50/60">
        <CardContent className="flex gap-4 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-700">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-red-800">Rejected</div>
              <Badge variant="secondary">{application.id}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">{application.problem}</div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="font-medium">Reason:</span>{" "}
              {application.rejectReason || "Not specified"}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/60">
      <CardContent className="flex gap-4 p-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700">
          <Clock className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-amber-800">Pending</div>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              {application.id}
            </Badge>
          </div>
          <div className="mt-1 text-sm text-slate-600">{application.problem}</div>
          <div className="mt-2 text-xs text-slate-500">
            Submitted: {application.createdAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-700">{value}</div>
    </div>
  );
}
