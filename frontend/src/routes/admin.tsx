import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { Application, getApplications, updateApplication } from "@/lib/store";
import { CheckCircle2, XCircle, Clock, FilePlus, AlertTriangle, IndianRupee, Calendar as CalendarIcon, Users, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [fee, setFee] = useState(50);

  useEffect(() => { if (role !== "admin") navigate({ to: "/login" }); }, [role]);
  useEffect(() => { setApps(getApplications()); }, []);

  const refresh = () => setApps(getApplications());

  const pending = apps.filter((a) => a.status === "Pending");
  const approved = apps.filter((a) => a.status === "Approved");
  const rejected = apps.filter((a) => a.status === "Rejected");

  const stats = useMemo(() => ([
    { l: "Total Applications", n: apps.length, icon: FilePlus, color: "text-blue-700 bg-blue-100" },
    { l: "Pending Review", n: pending.length, icon: Clock, color: "text-amber-700 bg-amber-100" },
    { l: "Confirmed", n: approved.length, icon: CheckCircle2, color: "text-green-700 bg-green-100" },
    { l: "Rejected", n: rejected.length, icon: XCircle, color: "text-red-700 bg-red-100" },
  ]), [apps]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Welcome, Dr. Sandeep Verma</h1>
          <p className="text-slate-600 text-sm">Manage applications, appointments and the daily schedule.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.l} className="border-blue-100 bg-white/90">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.color}`}><s.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-2xl font-bold text-blue-800">{s.n}</div>
                  <div className="text-xs text-slate-500">{s.l}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-blue-100 bg-white/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-blue-800">Applications</h2>
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" /> Spam detection active
              </div>
            </div>
            <Tabs defaultValue="all">
              <TabsList className="bg-blue-50">
                <TabsTrigger value="all">All ({apps.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
                <TabsTrigger value="approved">Confirmed ({approved.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all"><AppsTable list={apps} onChange={refresh} /></TabsContent>
              <TabsContent value="pending"><AppsTable list={pending} onChange={refresh} /></TabsContent>
              <TabsContent value="approved"><AppsTable list={approved} onChange={refresh} /></TabsContent>
              <TabsContent value="rejected"><AppsTable list={rejected} onChange={refresh} /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-blue-800">Daily Schedule Manager</h2>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4" /> Add Slot</Button>
              </div>
              <div className="mt-4 space-y-2">
                {approved.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-800">{a.appointmentTime || "—"} · {a.patientName}</div>
                      <div className="text-xs text-slate-500">{a.appointmentDate} · Queue #{a.queueNumber}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>
                  </div>
                ))}
                {approved.length === 0 && <div className="text-sm text-slate-500">No confirmed appointments yet.</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-6">
              <h2 className="font-semibold text-blue-800">Settings</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Patient limit / day</Label>
                  <Input className="h-11 mt-1" type="number" value={dailyLimit} onChange={(e) => setDailyLimit(+e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> Appointment fee (₹)</Label>
                  <Input className="h-11 mt-1" type="number" value={fee} onChange={(e) => setFee(+e.target.value)} />
                </div>
              </div>
              <Button className="mt-5 bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Settings saved")}>Save Settings</Button>
              <p className="mt-3 text-xs text-slate-500">A small appointment fee helps reduce fake or spam applications.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}

function AppsTable({ list, onChange }: { list: Application[]; onChange: () => void }) {
  return (
    <div className="overflow-x-auto mt-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.id}</TableCell>
              <TableCell>{a.patientName}</TableCell>
              <TableCell>{a.phone}</TableCell>
              <TableCell>{a.createdAt}</TableCell>
              <TableCell><StatusBadge s={a.status} /></TableCell>
              <TableCell className="text-right"><ReviewDialog a={a} onChange={onChange} /></TableCell>
            </TableRow>
          ))}
          {list.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-sm text-slate-500 py-8">No applications.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ s }: { s: Application["status"] }) {
  if (s === "Approved") return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>;
  if (s === "Rejected") return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
  return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
}

function ReviewDialog({ a, onChange }: { a: Application; onChange: () => void }) {
  const [date, setDate] = useState(a.appointmentDate || "2026-05-29");
  const [time, setTime] = useState(a.appointmentTime || "10:00 AM");
  const [queue, setQueue] = useState(a.queueNumber || 1);
  const [reason, setReason] = useState(a.rejectReason || "");

  const approve = () => {
    updateApplication(a.id, { status: "Approved", appointmentDate: date, appointmentTime: time, queueNumber: queue });
    toast.success("Appointment confirmed");
    onChange();
  };
  const reject = () => {
    updateApplication(a.id, { status: "Rejected", rejectReason: reason || "Not specified" });
    toast("Application rejected");
    onChange();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Review</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="text-blue-800">Review Application — {a.id}</DialogTitle></DialogHeader>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <Section title="Patient Details">
              <Row k="Name" v={a.patientName} />
              <Row k="Phone" v={a.phone} />
              <Row k="Submitted" v={a.createdAt} />
            </Section>
            <Section title="Medical Issue">
              <p className="text-sm text-slate-600">{a.details}</p>
              {a.previousTreatment && <p className="mt-2 text-xs text-slate-500"><span className="font-medium">Previous: </span>{a.previousTreatment}</p>}
            </Section>
          </div>
          <div className="space-y-3">
            <Section title="Problem / Symptoms">
              <p className="text-sm text-slate-600">{a.problem}</p>
            </Section>
            <Section title="Schedule Appointment">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> Date</Label>
                  <Input className="h-10 mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Time</Label>
                  <Input className="h-10 mt-1" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Queue #</Label>
                  <Input className="h-10 mt-1" type="number" value={queue} onChange={(e) => setQueue(+e.target.value)} />
                </div>
              </div>
            </Section>
            <Section title="Rejection Reason (if rejecting)">
              <Input className="h-10" placeholder="e.g. Incomplete information" value={reason} onChange={(e) => setReason(e.target.value)} />
            </Section>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button className="bg-green-600 hover:bg-green-700" onClick={approve}><CheckCircle2 className="h-4 w-4" /> Confirm & Schedule</Button>
          <Button variant="destructive" onClick={reject}><XCircle className="h-4 w-4" /> Reject Application</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="text-sm flex justify-between gap-3"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-800 text-right">{v}</span></div>;
}
