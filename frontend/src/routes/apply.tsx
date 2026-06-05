import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { createApplication } from "@/lib/api";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import {
  isAllowedReportFileName,
  prepareApplicationPayload,
  validateApplicationForm,
} from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/apply")({ component: Apply });

function Apply() {
  const { canRender, isReady } = useAuthGuard("user");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    problem: "",
    details: "",
    previousTreatment: "",
    reportName: "",
  });

  const set = (key: string, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateApplicationForm(form);

    if (validationError) {
      return toast.error(validationError);
    }

    try {
      setIsSubmitting(true);

      await createApplication(prepareApplicationPayload(form));

      toast.success("Application submitted successfully");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-4 py-10">
          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-8 text-center text-slate-500">
              Checking your access...
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
      <section className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border-blue-100 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            <h1 className="text-xl font-semibold text-blue-800 md:text-2xl">
              Patient Information & Appointment Request
            </h1>
            <p className="text-sm text-slate-500">
              Please describe your eye problem clearly so the doctor can review it.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-5">
              <div>
                <Label>Patient Problem / Symptoms *</Label>
                <Input
                  className="mt-1 h-11"
                  placeholder="Describe your eye problem or symptoms"
                  value={form.problem}
                  onChange={(e) => set("problem", e.target.value)}
                />
              </div>
              <div>
                <Label>Medical Issue Details *</Label>
                <Textarea
                  className="mt-1 min-h-28"
                  placeholder="Share details such as duration, pain, redness, or blurred vision"
                  value={form.details}
                  onChange={(e) => set("details", e.target.value)}
                />
              </div>
              <div>
                <Label>Previous Treatment Details (if any)</Label>
                <Input
                  className="mt-1 h-11"
                  placeholder="Enter previous treatment or doctor name"
                  value={form.previousTreatment}
                  onChange={(e) => set("previousTreatment", e.target.value)}
                />
              </div>
              <div>
                <Label>Medical Report Reference (Optional)</Label>
                <label className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-8 hover:bg-blue-50/40">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <div className="text-sm text-slate-600">
                    Choose a PDF, JPG, or PNG report file
                  </div>
                  <div className="text-xs text-slate-400">
                    The selected file name will be stored with your application.
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || "";

                      if (!isAllowedReportFileName(fileName)) {
                        e.target.value = "";
                        set("reportName", "");
                        toast.error("Please choose a PDF, JPG, JPEG, or PNG file");
                        return;
                      }

                      set("reportName", fileName);
                    }}
                  />
                  {form.reportName ? (
                    <div className="text-xs font-medium text-blue-700">
                      {form.reportName}
                    </div>
                  ) : null}
                </label>
              </div>
              <Button
                disabled={isSubmitting}
                className="h-12 w-full bg-blue-600 text-base hover:bg-blue-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
