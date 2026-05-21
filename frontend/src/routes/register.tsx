import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", phone: "", fatherName: "", email: "", address: "", age: "", gender: "",
    password: "", confirm: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.fatherName || !form.password) return toast.error("Please fill required fields");
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    loginUser({
      name: form.name, phone: form.phone, fatherName: form.fatherName,
      email: form.email, address: form.address, age: form.age, gender: form.gender,
    });
    toast.success("Registration successful");
    navigate({ to: "/dashboard" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card className="border-blue-100 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Create Your Account</h1>
              <p className="mt-1 text-sm text-slate-500">Fill the details below to register</p>
            </div>
            <form onSubmit={submit} className="mt-8 grid md:grid-cols-2 gap-5">
              <Field label="Full Name *">
                <Input className="h-11" placeholder="Enter your full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Age">
                <Input className="h-11" placeholder="Enter your age" value={form.age} onChange={(e) => set("age", e.target.value)} />
              </Field>
              <Field label="Phone Number *">
                <Input className="h-11" placeholder="Enter your phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Address">
                <Input className="h-11" placeholder="Enter your full address" value={form.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <Field label="Father / Guardian Name *">
                <Input className="h-11" placeholder="Enter father / guardian name" value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
              </Field>
              <Field label="Gender">
                <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Email (Optional)">
                <Input className="h-11" type="email" placeholder="Enter your email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <div />
              <Field label="Password *">
                <Input className="h-11" type="password" placeholder="Create a password" value={form.password} onChange={(e) => set("password", e.target.value)} />
              </Field>
              <Field label="Confirm Password *">
                <Input className="h-11" type="password" placeholder="Confirm your password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
              </Field>
              <div className="md:col-span-2">
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base">Register</Button>
                <p className="mt-4 text-center text-sm text-slate-500">
                  Already have an account? <Link to="/login" className="text-blue-700 font-medium hover:underline">Login</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm text-slate-700">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
