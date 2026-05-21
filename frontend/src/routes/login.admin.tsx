import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login/admin")({ component: AdminLogin });

function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState("admin");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) return toast.error("Please enter ID and password");
    loginAdmin();
    toast.success("Welcome, Dr. Verma");
    navigate({ to: "/admin" });
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
              <h1 className="mt-3 text-2xl font-semibold text-blue-800">Doctor/Admin Login</h1>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="id">ID / Email</Label>
                <Input id="id" className="mt-1 h-11" placeholder="Enter ID or email" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="mt-1 h-11" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <Checkbox /> Remember Me
                </label>
                <a className="text-blue-700 hover:underline" href="#">Forgot Password?</a>
              </div>
              <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">Secure Login</Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="text-blue-700 font-medium hover:underline">Register</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
