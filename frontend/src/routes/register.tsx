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
import { registerUser } from "@/lib/api";
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
  const { login } = useAuth();
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
  });

  const set = (key: string, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateRegisterForm(form);

    if (validationError) {
      return toast.error(validationError);
    }

    try {
      setIsSubmitting(true);

      const response = await registerUser(prepareRegisterPayload(form));

      login({
        token: response.token,
        user: response.user,
      });

      toast.success(response.message || "Registration successful");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card className="border-blue-100 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-800 md:text-3xl">
                Create Your Account
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Fill the details below to register for your eye-care appointments.
              </p>
            </div>
            <form onSubmit={submit} className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Full Name *">
                <Input
                  className="h-11"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Age">
                <Input
                  className="h-11"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your age"
                  value={form.age}
                  onChange={(e) => set("age", sanitizeAgeInput(e.target.value))}
                />
              </Field>
              <Field label="Phone Number *">
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
              <Field label="Address">
                <Input
                  className="h-11"
                  autoComplete="street-address"
                  placeholder="Enter your full address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
              <Field label="Father / Guardian Name *">
                <Input
                  className="h-11"
                  placeholder="Enter father or guardian name"
                  value={form.fatherName}
                  onChange={(e) => set("fatherName", e.target.value)}
                />
              </Field>
              <Field label="Gender">
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
              <Field label="Email (Optional)">
                <Input
                  className="h-11"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <div />
              <Field label="Password *">
                <Input
                  className="h-11"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </Field>
              <Field label="Confirm Password *">
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
                  className="h-12 w-full bg-blue-600 text-base hover:bg-blue-700"
                >
                  {isSubmitting ? "Creating Account..." : "Register"}
                </Button>
                <p className="mt-4 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-700 hover:underline"
                  >
                    Login
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
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-sm text-slate-700">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
