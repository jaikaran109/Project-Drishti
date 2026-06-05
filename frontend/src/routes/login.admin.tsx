import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateAdminLoginForm(identifier, password);

    if (validationError) {
      return toast.error(validationError);
    }

    try {
      setIsSubmitting(true);

      const response = await loginUserRequest({
        identifier: identifier.trim(),
        password,
      });

      if (response.user.role !== "admin") {
        return toast.error("This account does not have admin access");
      }

      login({
        token: response.token,
        user: response.user,
      });

      toast.success(`Welcome, ${response.user.name}`);
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
        <Card className="border-blue-100 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                <Stethoscope className="h-7 w-7" />
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-blue-800">
                Doctor/Admin Login
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Use your registered admin email or 10-digit phone number.
              </p>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="identifier">Email or Phone</Label>
                <Input
                  id="identifier"
                  className="mt-1 h-11"
                  autoComplete="username"
                  placeholder="Enter admin email or phone"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(normalizeIdentifierInput(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="mt-1 h-11"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-slate-600">
                Admin access is limited to authorized clinic and review staff.
              </p>
              <Button
                disabled={isSubmitting}
                className="h-11 w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Signing In..." : "Secure Login"}
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              Need a patient account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-700 hover:underline"
              >
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
