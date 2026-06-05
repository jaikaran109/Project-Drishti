import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type UserRole } from "@/lib/auth";

export function useAuthGuard(requiredRole?: UserRole) {
  const navigate = useNavigate();
  const { isReady, isAuthenticated, role, user } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      navigate({ to: "/login", replace: true });
      return;
    }

    if (requiredRole && role !== requiredRole) {
      navigate({
        to: role === "admin" ? "/admin" : "/dashboard",
        replace: true,
      });
    }
  }, [isAuthenticated, isReady, navigate, requiredRole, role]);

  return {
    isReady,
    user,
    role,
    canRender: isReady && isAuthenticated && (!requiredRole || role === requiredRole),
  };
}
