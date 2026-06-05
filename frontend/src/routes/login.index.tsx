import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { User, Stethoscope, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login/")({ component: LoginSelect });

function LoginSelect() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 md:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-600">Please select your role to login</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <RoleCard
            to="/login/user"
            title="User Login"
            description="Login as patient"
            icon={User}
          />
          <RoleCard
            to="/login/admin"
            title="Doctor/Admin Login"
            description="Login as doctor or administrator"
            icon={Stethoscope}
          />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </section>
    </SiteLayout>
  );
}

function RoleCard({
  to,
  title,
  description,
  icon: Icon,
}: {
  to: "/login/user" | "/login/admin";
  title: string;
  description: string;
  icon: typeof User;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Card className="border-blue-100 bg-white/85 backdrop-blur hover:border-blue-300">
        <CardContent className="p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-700">
            <Icon className="h-8 w-8" />
          </div>
          <div className="mt-4 text-lg font-semibold text-blue-800">{title}</div>
          <p className="text-sm text-slate-500">{description}</p>
          <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Continue <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
