import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { sanitizePhoneInput } from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"verify" | "reset" | "done">("verify");
  const [phone, setPhone] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error("Enter a valid 10-digit phone number");
    if (fatherName.trim().length < 2) return toast.error("Enter your guardian/father name");

    try {
      setIsSubmitting(true);
      await apiRequest("/api/auth/verify-identity", {
        method: "POST",
        body: { phone: phone.trim(), fatherName: fatherName.trim() },
      });
      setStep("reset");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      setIsSubmitting(true);
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: { phone: phone.trim(), fatherName: fatherName.trim(), newPassword },
      });
      setStep("done");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-16">
        <Card className="border-blue-100 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                <KeyRound className="h-7 w-7" />
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-blue-800">
                Reset Password
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                {step === "verify"
                  ? "Verify your identity using your registered phone and guardian name."
                  : step === "reset"
                    ? "Set your new password below."
                    : "Your password has been reset."}
              </p>
            </div>

            {step === "verify" && (
              <form onSubmit={verifyIdentity} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="phone">Registered Phone Number</Label>
                  <Input
                    id="phone"
                    className="mt-1 h-11"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName">Father / Guardian Name</Label>
                  <Input
                    id="fatherName"
                    className="mt-1 h-11"
                    placeholder="As entered during registration"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                </div>
                <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-slate-600">
                  We use your phone number and guardian name to verify your identity.
                </p>
                <Button
                  disabled={isSubmitting}
                  className="h-11 w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Verifying..." : "Verify Identity"}
                </Button>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={resetPassword} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      className="h-11 pr-10"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      className="h-11 pr-10"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  disabled={isSubmitting}
                  className="h-11 w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            {step === "done" && (
              <div className="mt-6 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Password reset successfully! You can now log in with your new password.
                </p>
                <Button
                  className="mt-5 h-11 w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate({ to: "/login" })}
                >
                  Go to Login
                </Button>
              </div>
            )}

            {step !== "done" && (
              <p className="mt-5 text-center text-sm text-slate-500">
                Remembered it?{" "}
                <Link
                  to="/login/user"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
