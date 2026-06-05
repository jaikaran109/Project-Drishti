import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CircleHelp,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { user, canRender, isReady } = useAuthGuard("admin");
  const { applications, isLoading, refresh } = useApplications(canRender);

  const pendingApplications = applications.filter(
    (application) => application.status === "pending",
  );
  const approvedApplications = applications.filter(
    (application) => application.status === "approved",
  );
  const rejectedApplications = applications.filter(
    (application) => application.status === "rejected",
  );

  const stats = [
    {
      label: "Total Applications",
      total: applications.length,
      icon: FilePlus,
      color: "text-blue-700 bg-blue-100",
    },
    {
      label: "Pending Review",
      total: pendingApplications.length,
      icon: Clock,
      color: "text-amber-700 bg-amber-100",
    },
    {
      label: "Confirmed",
      total: approvedApplications.length,
      icon: CheckCircle2,
      color: "text-green-700 bg-green-100",
    },
    {
      label: "Rejected",
      total: rejectedApplications.length,
      icon: XCircle,
      color: "text-red-700 bg-red-100",
    },
  ];

  if (!isReady) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-7xl px-4 py-8">
          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-8 text-center text-slate-500">
              Loading the admin dashboard...
            </CardContent>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  if (!canRender) {
    return null;
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-800 md:text-3xl">
            Welcome, {user?.name || "Admin"}
          </h1>
          <p className="text-sm text-slate-600">
            Review patient applications, assign queue numbers, and schedule
            confirmed appointments.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-blue-100 bg-white/90">
              <CardContent className="flex items-center gap-3 p-5">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-800">
                    {stat.total}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-blue-100 bg-white/90">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-blue-800">Applications</h2>
              <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
                Sorted by newest submissions
              </div>
            </div>
            <Tabs defaultValue="all">
              <TabsList className="bg-blue-50">
                <TabsTrigger value="all">
                  All ({applications.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Confirmed ({approvedApplications.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedApplications.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <AppsTable
                  list={applications}
                  allApplications={applications}
                  isLoading={isLoading}
                  onChange={refresh}
                />
              </TabsContent>
              <TabsContent value="pending">
                <AppsTable
                  list={pendingApplications}
                  allApplications={applications}
                  isLoading={isLoading}
                  onChange={refresh}
                />
              </TabsContent>
              <TabsContent value="approved">
                <AppsTable
                  list={approvedApplications}
                  allApplications={applications}
                  isLoading={isLoading}
                  onChange={refresh}
                />
              </TabsContent>
              <TabsContent value="rejected">
                <AppsTable
                  list={rejectedApplications}
                  allApplications={applications}
                  isLoading={isLoading}
                  onChange={refresh}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-blue-800">
                <ClipboardList className="h-5 w-5" />
                <h2 className="font-semibold">Confirmed Schedule</h2>
              </div>
              <div className="mt-4 space-y-2">
                {approvedApplications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/40 p-3"
                  >
                    <div className="text-sm">
                      <div className="font-medium text-blue-800">
                        {application.appointmentTime || "--"} -{" "}
                        {application.patientName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {application.appointmentDate || "--"} - Queue #
                        {application.queueNumber || "--"}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Confirmed
                    </Badge>
                  </div>
                ))}
                {approvedApplications.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    No confirmed appointments yet.
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-blue-800">
                <CircleHelp className="h-5 w-5" />
                <h2 className="font-semibold">Review Checklist</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <ChecklistItem text="Confirm the patient problem and details are complete." />
                <ChecklistItem text="Assign a valid appointment date, time, and queue number before approval." />
                <ChecklistItem text="Reject incomplete applications with a short reason so the patient understands what happened." />
                <ChecklistItem text="Avoid duplicate queue numbers for the same appointment date." />
              </div>
            </CardContent>
          </Card>
        </div>
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
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-slate-500"
              >
                Loading applications...
              </TableCell>
            </TableRow>
          ) : null}
          {list.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.id}</TableCell>
              <TableCell>{application.patientName}</TableCell>
              <TableCell>{application.phone}</TableCell>
              <TableCell>
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell>{application.createdAt}</TableCell>
              <TableCell className="text-right">
                <ReviewDialog
                  application={application}
                  allApplications={allApplications}
                  onChange={onChange}
                />
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && list.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-slate-500"
              >
                No applications found in this section.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  if (status === "approved") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Confirmed
      </Badge>
    );
  }

  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        Rejected
      </Badge>
    );
  }

  return (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
      Pending
    </Badge>
  );
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
  const [date, setDate] = useState(
    application.appointmentDate || new Date().toISOString().slice(0, 10),
  );
  const [time, setTime] = useState(application.appointmentTime || "10:00");
  const [queue, setQueue] = useState(application.queueNumber || 1);
  const [reason, setReason] = useState(application.rejectReason || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedQueueNumber = useMemo(() => {
    return getNextQueueNumber(allApplications, date, application.id);
  }, [allApplications, application.id, date]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextDate =
      application.appointmentDate || new Date().toISOString().slice(0, 10);
    const nextQueue = application.queueNumber || getNextQueueNumber(allApplications, nextDate, application.id);

    setDate(nextDate);
    setTime(application.appointmentTime || "10:00");
    setQueue(nextQueue);
    setReason(application.rejectReason || "");
  }, [
    allApplications,
    application.appointmentDate,
    application.appointmentTime,
    application.id,
    application.queueNumber,
    application.rejectReason,
    open,
  ]);

  const approve = async () => {
    if (!date || !time || queue <= 0) {
      return toast.error("Please add date, time, and queue number");
    }

    try {
      setIsSubmitting(true);
      await updateApplication(application.id, {
        status: "approved",
        appointmentDate: date,
        appointmentTime: time,
        queueNumber: queue,
      });
      toast.success("Appointment confirmed");
      setOpen(false);
      onChange();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const reject = async () => {
    try {
      setIsSubmitting(true);
      await updateApplication(application.id, {
        status: "rejected",
        rejectReason: reason || "Not specified",
      });
      toast.success("Application rejected");
      setOpen(false);
      onChange();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-800">
            Review Application - {application.id}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <Section title="Patient Details">
              <InfoRow label="Name" value={application.patientName} />
              <InfoRow label="Phone" value={application.phone} />
              <InfoRow label="Submitted" value={application.createdAt} />
            </Section>
            <Section title="Medical Issue">
              <p className="text-sm text-slate-600">{application.details}</p>
              {application.previousTreatment ? (
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-medium">Previous treatment:</span>{" "}
                  {application.previousTreatment}
                </p>
              ) : null}
              {application.reportName ? (
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-medium">Report reference:</span>{" "}
                  {application.reportName}
                </p>
              ) : null}
            </Section>
          </div>
          <div className="space-y-3">
            <Section title="Problem / Symptoms">
              <p className="text-sm text-slate-600">{application.problem}</p>
            </Section>
            <Section title="Schedule Appointment">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="flex items-center gap-1 text-xs">
                    <CalendarIcon className="h-3 w-3" /> Date
                  </Label>
                  <Input
                    className="mt-1 h-10"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Time</Label>
                  <Input
                    className="mt-1 h-10"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Queue #</Label>
                  <Input
                    className="mt-1 h-10"
                    type="number"
                    min={1}
                    value={queue}
                    onChange={(e) => setQueue(Number(e.target.value))}
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Suggested next queue: #{suggestedQueueNumber}
                  </p>
                </div>
              </div>
            </Section>
            <Section title="Rejection Reason (if rejecting)">
              <Input
                className="h-10"
                placeholder="e.g. Incomplete information"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Section>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
            onClick={approve}
          >
            <CheckCircle2 className="h-4 w-4" />{" "}
            {isSubmitting ? "Saving..." : "Confirm & Schedule"}
          </Button>
          <Button
            disabled={isSubmitting}
            variant="destructive"
            onClick={reject}
          >
            <XCircle className="h-4 w-4" /> Reject Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">
        {value || "--"}
      </span>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-4 py-3">
      {text}
    </div>
  );
}

function getNextQueueNumber(
  applications: Application[],
  appointmentDate: string,
  currentApplicationId: string,
) {
  const assignedQueues = applications
    .filter(
      (application) =>
        application.id !== currentApplicationId &&
        application.status === "approved" &&
        application.appointmentDate === appointmentDate,
    )
    .map((application) => application.queueNumber || 0);

  if (assignedQueues.length === 0) {
    return 1;
  }

  return Math.max(...assignedQueues) + 1;
}
