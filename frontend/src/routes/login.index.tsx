import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login/")({ component: LoginSelect });

function LoginSelect() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 md:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-600">Select your role to continue</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/login/user"
            className="rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Card className="border-blue-200 bg-white/85 backdrop-blur hover:border-blue-400">
              <CardContent className="p-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                  <User className="h-8 w-8" />
                </div>
                <div className="mt-4 text-lg font-semibold text-blue-800">Patient Login</div>
                <p className="mt-1 text-sm text-slate-500">
                  Book appointments and track your queue status
                </p>
                <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                  Continue as Patient <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            to="/login/admin"
            className="rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Card className="border-emerald-200 bg-white/85 backdrop-blur hover:border-emerald-400">
              <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-fit">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <Badge className="absolute -right-3 -top-2 bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-emerald-600">
                    STAFF
                  </Badge>
                </div>
                <div className="mt-4 text-lg font-semibold text-emerald-800">Staff / Admin Login</div>
                <p className="mt-1 text-sm text-slate-500">
                  Manage appointments and clinic operations
                </p>
                <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                  Continue as Staff <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          New patient?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-700 hover:underline"
          >
            Register here
          </Link>
        </p>
      </section>
    </SiteLayout>
  );
}
