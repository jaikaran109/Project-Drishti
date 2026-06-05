import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "user" | "admin";

export type AuthUser = {
  _id: string;
  name: string;
  phone: string;
  fatherName: string;
  email?: string;
  address?: string;
  age?: number;
  gender?: string;
  role: UserRole;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  role: UserRole | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

type ProfileResponse = {
  user: AuthUser;
};

export const AUTH_STORAGE_KEY = "drishti_auth";
export const AUTH_EVENT_NAME = "drishti-auth-changed";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const AuthContext = createContext<AuthContextValue | null>(null);

const isBrowser = () => typeof window !== "undefined";
const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const writeStoredSession = (session: AuthSession | null, notify: boolean) => {
  if (!isBrowser()) {
    return;
  }

  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  if (notify) {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }
};

export const getStoredSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    return rawSession ? (JSON.parse(rawSession) as AuthSession) : null;
  } catch {
    return null;
  }
};

export const storeSession = (session: AuthSession) => {
  writeStoredSession(session, true);
};

export const clearStoredSession = () => {
  writeStoredSession(null, true);
};

export const getAuthToken = () => {
  return getStoredSession()?.token ?? null;
};

export const hasAuthToken = () => {
  return Boolean(getAuthToken());
};

const fetchProfile = async (token: string) => {
  const response = await fetch(buildApiUrl("/api/auth/profile"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json().catch(() => null)) as ProfileResponse | null;

  if (!response.ok || !data?.user) {
    throw new Error("Unable to restore your session");
  }

  return data.user;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      const storedSession = getStoredSession();

      if (!storedSession?.token) {
        if (!ignore) {
          setSession(null);
          setIsReady(true);
        }
        return;
      }

      try {
        const user = await fetchProfile(storedSession.token);

        if (ignore) {
          return;
        }

        const nextSession = {
          token: storedSession.token,
          user,
        };

        writeStoredSession(nextSession, false);
        setSession(nextSession);
      } catch {
        writeStoredSession(null, false);

        if (!ignore) {
          setSession(null);
        }
      } finally {
        if (!ignore) {
          setIsReady(true);
        }
      }
    };

    void restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const handleAuthChange = () => {
      setSession(getStoredSession());
      setIsReady(true);
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const login = (nextSession: AuthSession) => {
    setSession(nextSession);
    setIsReady(true);
    storeSession(nextSession);
  };

  const logout = () => {
    setSession(null);
    setIsReady(true);
    clearStoredSession();
  };

  const refreshProfile = async () => {
    if (!session?.token) {
      return;
    }

    const user = await fetchProfile(session.token);
    const nextSession = {
      token: session.token,
      user,
    };

    setSession(nextSession);
    storeSession(nextSession);
  };

  const value: AuthContextValue = {
    token: session?.token ?? null,
    user: session?.user ?? null,
    role: session?.user.role ?? null,
    isReady,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
    refreshProfile,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider missing");
  }

  return context;
};
