import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { type Application, updateApplication } from "@/lib/api";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useApplications } from "@/hooks/use-applications";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FilePlus,
  Calendar as CalendarIcon,
  ClipboardList,
  User,
  Phone,
  Stethoscope,
  Hash,
  Bell,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { user, canRender, isReady } = useAuthGuard("admin");
  const { applications, isLoading, refresh } = useApplications(canRender);

  const pendingApplications = applications.filter((a) => a.status === "pending");
  const approvedApplications = applications.filter((a) => a.status === "approved");
  const rejectedApplications = applications.filter((a) => a.status === "rejected");

  const stats = [
    { label: "Total", total: applications.length, icon: FilePlus, color: "text-blue-700 bg-blue-100" },
    { label: "Pending", total: pendingApplications.length, icon: Clock, color: "text-amber-700 bg-amber-100" },
    { label: "Confirmed", total: approvedApplications.length, icon: CheckCircle2, color: "text-green-700 bg-green-100" },
    { label: "Rejected", total: rejectedApplications.length, icon: XCircle, color: "text-red-700 bg-red-100" },
  ];

  if (!isReady) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-7xl px-4 py-8">
          <Card className="border-emerald-100 bg-white/90">
            <CardContent className="p-8 text-center text-slate-500">
              Loading staff dashboard...
            </CardContent>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  if (!canRender) return null;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8">

        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800 md:text-3xl">
              Staff Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Welcome back, <span className="font-medium text-emerald-700">{user?.name}</span> — review and confirm patient appointments below.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-fit border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={refresh}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {/* Pending alert banner */}
        {pendingApplications.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Bell className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{pendingApplications.length} appointment{pendingApplications.length > 1 ? "s" : ""} waiting for your review.</span>{" "}
              Please confirm or reject them so patients are notified.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-slate-100 bg-white/90">
              <CardContent className="flex items-center gap-3 p-5">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{stat.total}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications table */}
        <Card className="border-slate-100 bg-white/90">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-emerald-800">Patient Applications</h2>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                Newest first
              </span>
            </div>
            <Tabs defaultValue="pending">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="pending" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
                  Pending ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({applications.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  Confirmed ({approvedApplications.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                  Rejected ({rejectedApplications.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <AppsTable list={pendingApplications} allApplications={applications} isLoading={isLoading} onChange={refresh} />
              </TabsContent>
              <TabsContent value="all">
                <AppsTable list={applications} allApplications={applications} isLoading={isLoading} onChange={refresh} />
              </TabsContent>
              <TabsContent value="approved">
                <AppsTable list={approvedApplications} allApplications={applications} isLoading={isLoading} onChange={refresh} />
              </TabsContent>
              <TabsContent value="rejected">
                <AppsTable list={rejectedApplications} allApplications={applications} isLoading={isLoading} onChange={refresh} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Today's confirmed schedule */}
        <Card className="border-slate-100 bg-white/90">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-emerald-800">
              <ClipboardList className="h-5 w-5" />
              <h2 className="font-semibold">Confirmed Schedule</h2>
            </div>
            <div className="mt-4 space-y-2">
              {approvedApplications.length === 0 ? (
                <p className="text-sm text-slate-400">No confirmed appointments yet.</p>
              ) : (
                approvedApplications.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                    <div className="text-sm">
                      <div className="font-medium text-emerald-800">
                        Queue #{a.queueNumber ?? "--"} — {a.patientName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {a.appointmentDate || "--"} at {a.appointmentTime || "--"}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </section>
    </SiteLayout>
  );
}

function AppsTable({
  list,
  allApplications,
  isLoading,
  onChange,
}: {
  list: Application[];
  allApplications: Application[];
  isLoading: boolean;
  onChange: () => void;
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-400">
                Loading applications...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && list.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-400">
                No applications in this section.
              </TableCell>
            </TableRow>
          )}
          {list.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.patientName}</TableCell>
              <TableCell>{application.phone}</TableCell>
              <TableCell className="max-w-[160px] truncate text-slate-500">{application.problem}</TableCell>
              <TableCell>
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell className="text-slate-500">{application.createdAt}</TableCell>
              <TableCell className="text-right">
                <ReviewDialog
                  application={application}
                  allApplications={allApplications}
                  onChange={onChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  if (status === "approved")
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>;
  if (status === "rejected")
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
  return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
}

function ReviewDialog({
  application,
  allApplications,
  onChange,
}: {
  application: Application;
  allApplications: Application[];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(application.appointmentDate || new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(application.appointmentTime || "10:00");
  const [queue, setQueue] = useState(application.queueNumber || 1);
  const [reason, setReason] = useState(application.rejectReason || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedQueue = useMemo(
    () => getNextQueueNumber(allApplications, date, application.id),
    [allApplications, date, application.id],
  );

  useEffect(() => {
    if (!open) return;
    const nextDate = application.appointmentDate || new Date().toISOString().slice(0, 10);
    setDate(nextDate);
    setTime(application.appointmentTime || "10:00");
    setQueue(application.queueNumber || getNextQueueNumber(allApplications, nextDate, application.id));
    setReason(application.rejectReason || "");
  }, [open, allApplications, application]);

  const confirm = async () => {
    if (!date || !time || queue <= 0)
      return toast.error("Please set a valid date, time, and queue number");
    try {
      setIsSubmitting(true);
      await updateApplication(application.id, {
        status: "approved",
        appointmentDate: date,
        appointmentTime: time,
        queueNumber: queue,
      });
      toast.success(`✅ Appointment confirmed for ${application.patientName} — they will see the notification on their dashboard.`);
      setOpen(false);
      onChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to confirm appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reject = async () => {
    if (!reason.trim()) return toast.error("Please provide a rejection reason so the patient understands");
    try {
      setIsSubmitting(true);
      await updateApplication(application.id, {
        status: "rejected",
        rejectReason: reason,
      });
      toast.success("Application rejected. Patient will see the reason on their dashboard.");
      setOpen(false);
      onChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reject application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyProcessed = application.status !== "pending";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={application.status === "pending" ? "default" : "outline"}
          className={
            application.status === "pending"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }
        >
          {application.status === "pending" ? "Review" : "View"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800">
            <Stethoscope className="h-5 w-5" />
            {isAlreadyProcessed ? "Application Details" : "Review Appointment Request"}
          </DialogTitle>
        </DialogHeader>

        {/* Patient info */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Patient Information</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span className="font-medium text-slate-800">{application.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="text-slate-700">{application.phone}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">Submitted on {application.createdAt}</div>
        </div>

        {/* Medical details */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">Problem / Symptoms</p>
          <p className="text-sm font-medium text-slate-800">{application.problem}</p>
          <Separator className="my-2" />
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-700">Medical Details</p>
          <p className="text-sm text-slate-600">{application.details}</p>
          {application.previousTreatment && (
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-medium">Previous treatment:</span> {application.previousTreatment}
            </p>
          )}
          {application.reportName && (
            <p className="mt-1 text-xs text-slate-500">
              <span className="font-medium">Report:</span> {application.reportName}
            </p>
          )}
        </div>

        {/* If already confirmed — show appointment info */}
        {application.status === "approved" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-700">
              ✅ Appointment Confirmed — Patient Notified
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-500">Date</div>
                <div className="font-semibold text-green-800">{application.appointmentDate}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Time</div>
                <div className="font-semibold text-green-800">{application.appointmentTime}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Queue #</div>
                <div className="font-semibold text-green-800">#{application.queueNumber}</div>
              </div>
            </div>
          </div>
        )}

        {/* If rejected — show reason */}
        {application.status === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-700">
              ❌ Rejected — Patient Notified
            </p>
            <p className="text-sm text-slate-600">{application.rejectReason || "No reason provided"}</p>
          </div>
        )}

        {/* Schedule form — only for pending */}
        {application.status === "pending" && (
          <>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                📅 Fix Appointment — Patient will be notified instantly
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="flex items-center gap-1 text-xs text-emerald-800">
                    <CalendarIcon className="h-3 w-3" /> Date
                  </Label>
                  <Input
                    className="mt-1 h-10 border-emerald-200 focus-visible:ring-emerald-400"
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-emerald-800">Time</Label>
                  <Input
                    className="mt-1 h-10 border-emerald-200 focus-visible:ring-emerald-400"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-1 text-xs text-emerald-800">
                    <Hash className="h-3 w-3" /> Queue No.
                  </Label>
                  <Input
                    className="mt-1 h-10 border-emerald-200 focus-visible:ring-emerald-400"
                    type="number"
                    min={1}
                    value={queue}
                    onChange={(e) => setQueue(Number(e.target.value))}
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Suggested: #{suggestedQueue}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/30 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-600">
                Rejection Reason (required if rejecting)
              </p>
              <Textarea
                className="min-h-[70px] border-red-200 focus-visible:ring-red-300"
                placeholder="e.g. Incomplete information, please resubmit with full details"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={isSubmitting}
                className="h-11 bg-emerald-600 hover:bg-emerald-700"
                onClick={confirm}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitting ? "Confirming..." : "Confirm & Notify Patient"}
              </Button>
              <Button
                disabled={isSubmitting}
                variant="destructive"
                className="h-11"
                onClick={reject}
              >
                <XCircle className="h-4 w-4" />
                {isSubmitting ? "Rejecting..." : "Reject & Notify Patient"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getNextQueueNumber(
  applications: Application[],
  appointmentDate: string,
  currentId: string,
) {
  const queues = applications
    .filter((a) => a.id !== currentId && a.status === "approved" && a.appointmentDate === appointmentDate)
    .map((a) => a.queueNumber || 0);
  return queues.length === 0 ? 1 : Math.max(...queues) + 1;
}
