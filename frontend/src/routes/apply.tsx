import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { addApplication } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/apply")({ component: Apply });

function Apply() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ problem: "", details: "", previousTreatment: "", reportName: "" });

  useEffect(() => { if (role !== "user") navigate({ to: "/login" }); }, [role]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.problem || !form.details) return toast.error("Please fill required fields");
    addApplication({
      patientName: user!.name,
      phone: user!.phone,
      problem: form.problem,
      details: form.details,
      previousTreatment: form.previousTreatment,
      reportName: form.reportName,
    });
    toast.success("Application submitted");
    navigate({ to: "/dashboard" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border-blue-100 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            <h1 className="text-xl md:text-2xl font-semibold text-blue-800">Patient Information & Appointment Request</h1>
            <p className="text-sm text-slate-500">Please describe your problem clearly.</p>
            <form onSubmit={submit} className="mt-6 space-y-5">
              <div>
                <Label>Patient Problem / Symptoms *</Label>
                <Input className="h-11 mt-1" placeholder="Describe your eye problem / symptoms" value={form.problem} onChange={(e) => set("problem", e.target.value)} />
              </div>
              <div>
                <Label>Medical Issue Details *</Label>
                <Textarea className="mt-1 min-h-28" placeholder="Enter details of your medical issue" value={form.details} onChange={(e) => set("details", e.target.value)} />
              </div>
              <div>
                <Label>Previous Treatment Details (if any)</Label>
                <Input className="h-11 mt-1" placeholder="Enter previous treatment or doctor name" value={form.previousTreatment} onChange={(e) => set("previousTreatment", e.target.value)} />
              </div>
              <div>
                <Label>Upload Medical Report (if any)</Label>
                <label className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-200 rounded-xl py-8 cursor-pointer hover:bg-blue-50/40">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <div className="text-sm text-slate-600">Click to upload image</div>
                  <div className="text-xs text-slate-400">(JPG, PNG, PDF)</div>
                  <input type="file" className="hidden" onChange={(e) => set("reportName", e.target.files?.[0]?.name || "")} />
                  {form.reportName && <div className="text-xs text-blue-700 font-medium">{form.reportName}</div>}
                </label>
              </div>
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base">Submit Application</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
