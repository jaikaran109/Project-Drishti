import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { loginUser as loginUserRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  normalizeIdentifierInput,
  validateAdminLoginForm,
} from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/login/admin")({ component: AdminLogin });

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateAdminLoginForm(identifier, password);
    if (validationError) return toast.error(validationError);

    try {
      setIsSubmitting(true);
      const response = await loginUserRequest({
        identifier: identifier.trim(),
        password,
      });

      if (response.user.role !== "admin") {
        return toast.error("This account does not have staff/admin access");
      }

      login({ token: response.token, user: response.user });
      toast.success(`Welcome back, ${response.user.name}`);
      navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-16">
        <Card className="border-emerald-200 bg-white/90 shadow-lg shadow-emerald-50 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="relative mx-auto w-fit">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <Badge className="absolute -right-3 -top-2 bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-emerald-600">
                  STAFF
                </Badge>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-emerald-800">
                Staff / Admin Portal
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Restricted access — authorized clinic staff only.
              </p>
            </div>

            <div className="my-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              🔒 This portal is for doctors and clinic administrators. If you are
              a patient, please use the{" "}
              <Link to="/login/user" className="font-semibold underline">
                User Login
              </Link>{" "}
              instead.
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="identifier" className="text-emerald-800">
                  Email or Phone
                </Label>
                <Input
                  id="identifier"
                  className="mt-1 h-11 border-emerald-200 focus-visible:ring-emerald-400"
                  autoComplete="username"
                  placeholder="Admin email or 10-digit phone"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(normalizeIdentifierInput(e.target.value))
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-emerald-800">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-11 border-emerald-200 pr-10 focus-visible:ring-emerald-400"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                disabled={isSubmitting}
                className="h-11 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <ShieldCheck className="h-4 w-4" />
                {isSubmitting ? "Verifying..." : "Secure Staff Login"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              <Link
                to="/login"
                className="font-medium text-emerald-700 hover:underline"
              >
                ← Back to login selection
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
