import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login/")({ component: LoginSelect });

function LoginSelect() {
  const navigate = useNavigate();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Welcome Back</h1>
          <p className="mt-2 text-slate-600">Please select your role to login</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Card
            className="cursor-pointer border-blue-100 bg-white/85 backdrop-blur hover:border-blue-300 hover:shadow-md transition"
            onClick={() => navigate({ to: "/login/user" })}
          >
            <CardContent className="p-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                <User className="h-8 w-8" />
              </div>
              <div className="mt-4 text-lg font-semibold text-blue-800">User Login</div>
              <p className="text-sm text-slate-500">Login as Patient</p>
              <Button className="mt-5 w-full bg-blue-600 hover:bg-blue-700">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer border-blue-100 bg-white/85 backdrop-blur hover:border-blue-300 hover:shadow-md transition"
            onClick={() => navigate({ to: "/login/admin" })}
          >
            <CardContent className="p-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div className="mt-4 text-lg font-semibold text-blue-800">Doctor/Admin Login</div>
              <p className="text-sm text-slate-500">Login as Doctor or Administrator</p>
              <Button className="mt-5 w-full bg-blue-600 hover:bg-blue-700">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-blue-700 hover:underline">Register</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
