import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { RefreshCw, UserRound, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { refreshProfile } = useAuth();
  const { user, canRender, isReady } = useAuthGuard("user");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshProfile();
      toast.success("Profile refreshed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to refresh profile",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isReady) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-4xl px-4 py-12">
          <Card className="border-blue-100 bg-white/90">
            <CardContent className="p-8 text-center text-slate-500">
              Loading your profile...
            </CardContent>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  if (!canRender || !user) {
    return null;
  }

  const profileItems = [
    { icon: UserRound, label: "Full Name", value: user.name },
    { icon: Phone, label: "Phone Number", value: user.phone },
    { icon: UserRound, label: "Father / Guardian", value: user.fatherName },
    { icon: Mail, label: "Email", value: user.email || "Not provided" },
    { icon: MapPin, label: "Address", value: user.address || "Not provided" },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Patient Profile
              </Badge>
              <h1 className="mt-3 text-2xl font-bold text-blue-800 md:text-3xl">
                {user.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Review your saved Drishti account details and appointment access.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={isRefreshing}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleRefresh}
              >
                <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/apply">Apply for Appointment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {profileItems.map((item) => (
            <Card key={item.label} className="border-blue-100 bg-white/90">
              <CardContent className="flex gap-4 p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-1 font-medium text-slate-800">
                    {item.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-blue-100 bg-white/90">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
            <InfoBlock label="Age" value={user.age ? String(user.age) : "Not provided"} />
            <InfoBlock label="Gender" value={user.gender || "Not provided"} />
            <InfoBlock label="Role" value={user.role} />
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 font-semibold capitalize text-blue-800">{value}</div>
    </div>
  );
}
