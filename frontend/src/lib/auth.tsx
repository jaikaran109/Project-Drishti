import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "user" | "admin" | null;
export type User = {
  name: string;
  phone: string;
  address?: string;
  fatherName?: string;
  age?: string;
  gender?: string;
  email?: string;
};

type AuthCtx = {
  role: Role;
  user: User | null;
  loginUser: (u: User) => void;
  loginAdmin: () => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("drishti_role") as Role;
      const u = localStorage.getItem("drishti_user");
      if (r) setRole(r);
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const loginUser = (u: User) => {
    setUser(u);
    setRole("user");
    localStorage.setItem("drishti_user", JSON.stringify(u));
    localStorage.setItem("drishti_role", "user");
  };
  const loginAdmin = () => {
    setRole("admin");
    setUser({ name: "Dr. Sandeep Verma", phone: "Admin" });
    localStorage.setItem("drishti_role", "admin");
    localStorage.setItem("drishti_user", JSON.stringify({ name: "Dr. Sandeep Verma", phone: "Admin" }));
  };
  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem("drishti_role");
    localStorage.removeItem("drishti_user");
  };

  return <Ctx.Provider value={{ role, user, loginUser, loginAdmin, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider missing");
  return c;
};
