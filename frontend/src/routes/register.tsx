import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ShieldCheck } from "lucide-react";
import { registerUser, registerAdmin } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  prepareRegisterPayload,
  sanitizeAgeInput,
  sanitizePhoneInput,
  validateRegisterForm,
} from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const { login, user, isReady } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fatherName: "",
    email: "",
    address: "",
    age: "",
    gender: "",
    password: "",
    confirm: "",
    role: "user" as "user" | "admin",
    employeeNumber: "",
  });

  const set = (key: string, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const isAdminUser = user?.role === "admin";
  const isStaff = form.role === "admin";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateRegisterForm(form);
    if (validationError) return toast.error(validationError);

    try {
      setIsSubmitting(true);
      const payload = prepareRegisterPayload(form);
      const response = isStaff ? await registerAdmin(payload) : await registerUser(payload);
      if (!isStaff) login({ token: response.token, user: response.user });
      toast.success(response.message || "Registration successful");
      navigate({ to: isStaff ? "/admin" : "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReady && !isAdminUser && form.role === "admin") {
    setForm((f) => ({ ...f, role: "user" }));
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card
          className={`bg-white/90 backdrop-blur ${
            isStaff ? "border-emerald-200" : "border-blue-100"
          }`}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <h1
                className={`text-2xl font-bold md:text-3xl ${
                  isStaff ? "text-emerald-800" : "text-blue-800"
                }`}
              >
                Create Your Account
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isStaff
                  ? "Register as clinic staff or doctor."
                  : "Fill the details below to register for your eye-care appointments."}
              </p>
            </div>

            {/* Role Selector */}
            <div className={`mt-6 grid gap-3 ${isAdminUser ? "grid-cols-2" : "grid-cols-1"}`}>
              <button
                type="button"
                onClick={() => set("role", "user")}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                  !isStaff
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-500 hover:border-blue-300"
                }`}
              >
                <User className="h-4 w-4" /> Patient
              </button>
              {isAdminUser && (
                <button
                  type="button"
                  onClick={() => set("role", "admin")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                    isStaff
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:border-emerald-300"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" /> Staff / Doctor
                </button>
              )}
            </div>

            {isStaff && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800">
                🔒 Staff registration can only be done by an existing admin.
              </div>
            )}

            <form onSubmit={submit} className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Full Name *" isStaff={isStaff}>
                <Input
                  className="h-11"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Age" isStaff={isStaff}>
                <Input
                  className="h-11"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your age"
                  value={form.age}
                  onChange={(e) => set("age", sanitizeAgeInput(e.target.value))}
                />
              </Field>
              <Field label="Phone Number *" isStaff={isStaff}>
                <Input
                  className="h-11"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={form.phone}
                  onChange={(e) => set("phone", sanitizePhoneInput(e.target.value))}
                />
              </Field>
              <Field label="Address" isStaff={isStaff}>
                <Input
                  className="h-11"
                  autoComplete="street-address"
                  placeholder="Enter your full address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
              <Field label="Father / Guardian Name *" isStaff={isStaff}>
                <Input
                  className="h-11"
                  placeholder="Enter father or guardian name"
                  value={form.fatherName}
                  onChange={(e) => set("fatherName", e.target.value)}
                />
              </Field>
              <Field label="Gender" isStaff={isStaff}>
                <Select
                  value={form.gender}
                  onValueChange={(value) => set("gender", value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Email (Optional)" isStaff={isStaff}>
                <Input
                  className="h-11"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              {isStaff ? (
                <Field label="Employee Number *" isStaff={isStaff}>
                  <Input
                    className="h-11 border-emerald-200 focus-visible:ring-emerald-400"
                    placeholder="e.g. EMP-2024-001"
                    value={form.employeeNumber}
                    onChange={(e) => set("employeeNumber", e.target.value)}
                  />
                </Field>
              ) : (
                <div />
              )}
              <Field label="Password *" isStaff={isStaff}>
                <Input
                  className="h-11"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </Field>
              <Field label="Confirm Password *" isStaff={isStaff}>
                <Input
                  className="h-11"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Button
                  disabled={isSubmitting}
                  className={`h-12 w-full text-base ${
                    isStaff
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : isStaff
                      ? "Register as Staff"
                      : "Register as Patient"}
                </Button>
                <p className="mt-4 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to={isStaff ? "/login/admin" : "/login/user"}
                    className={`font-medium hover:underline ${
                      isStaff ? "text-emerald-700" : "text-blue-700"
                    }`}
                  >
                    {isStaff ? "Staff Login" : "Patient Login"}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  children,
  isStaff,
}: {
  label: string;
  children: React.ReactNode;
  isStaff?: boolean;
}) {
  return (
    <div>
      <Label className={`text-sm ${isStaff ? "text-emerald-800" : "text-slate-700"}`}>
        {label}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
