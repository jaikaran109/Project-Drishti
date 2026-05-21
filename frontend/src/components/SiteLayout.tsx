import { ReactNode, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Home, Info, Building2, Stethoscope, Phone, CalendarCheck, LogOut, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EyeBackground } from "./EyeBackground";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/facilities", label: "Facilities", icon: Building2 },
  { to: "/services", label: "Services", icon: Stethoscope },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/appointment-info", label: "Appointment Info", icon: CalendarCheck },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <EyeBackground />
      <header className="relative z-10 border-b border-blue-100/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-gradient-to-b from-blue-50 to-white">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-blue-700">
                    <Eye className="h-5 w-5" /> Drishti
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {navItems.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-slate-700 hover:bg-blue-100/70 hover:text-blue-700"
                    >
                      <n.icon className="h-4 w-4" /> {n.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
                <Eye className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-semibold tracking-tight text-blue-800">Drishti</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Smart Rural Healthcare</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {role === null ? (
              <>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => navigate({ to: "/login" })}>
                  Login
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate({ to: "/register" })}>
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate({ to: role === "admin" ? "/admin" : "/dashboard" })}
                >
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => { logout(); navigate({ to: "/" }); }}>
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mt-16 border-t border-blue-100 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <div>
              <div className="font-semibold">Drishti</div>
              <div className="text-xs text-blue-100">Smart Rural Healthcare</div>
            </div>
          </div>
          <div className="text-sm text-blue-100">© 2026 Drishti. All rights reserved.</div>
          <div className="text-sm text-blue-100">Helping Rural India See Better 💙</div>
        </div>
      </footer>
    </div>
  );
}
