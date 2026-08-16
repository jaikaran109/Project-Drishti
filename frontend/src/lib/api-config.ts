const FALLBACK_API_BASE_URL = "https://project-drishti-le4s.onrender.com";

type RuntimeApiConfig = {
  __API_URL__?: string;
  __APP_CONFIG__?: {
    API_URL?: string;
  };
  API_URL?: string;
};

const readBuildTimeApiUrl = () => {
  if (typeof import.meta === "undefined") {
    return "";
  }

  const env = import.meta.env as Record<string, string | undefined> | undefined;
  if (!env) {
    return "";
  }

  return (
    env.VITE_API_URL ??
    env.PUBLIC_API_URL ??
    env.VITE_BACKEND_URL ??
    env.API_URL ??
    ""
  );
};

const readRuntimeApiUrl = () => {
  if (typeof globalThis === "undefined") {
    return "";
  }

  const runtimeConfig = globalThis as typeof globalThis & RuntimeApiConfig;
  return (
    runtimeConfig.__API_URL__ ??
    runtimeConfig.__APP_CONFIG__?.API_URL ??
    runtimeConfig.API_URL ??
    ""
  );
};

export const getApiBaseUrl = () => {
  const configuredUrl = readBuildTimeApiUrl() || readRuntimeApiUrl() || FALLBACK_API_BASE_URL;
  return configuredUrl.replace(/\/+$/, "");
};

export const buildApiUrl = (path: string) => {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${sanitizedPath}`;
};
