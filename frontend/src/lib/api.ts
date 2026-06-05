import {
  clearStoredSession,
  getAuthToken,
  type AuthSession,
  type AuthUser,
} from "./auth";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export type Application = {
  id: string;
  patientName: string;
  phone: string;
  problem: string;
  details: string;
  previousTreatment?: string;
  reportName?: string;
  status: ApplicationStatus;
  createdAt: string;
  appointmentDate?: string;
  appointmentTime?: string;
  queueNumber?: number;
  rejectReason?: string;
};

export type RegisterPayload = {
  name: string;
  phone: string;
  fatherName: string;
  email?: string;
  address?: string;
  age?: string;
  gender?: string;
  password: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type CreateApplicationPayload = {
  problem: string;
  details: string;
  previousTreatment?: string;
  reportName?: string;
};

export type UpdateApplicationPayload = {
  status: ApplicationStatus;
  appointmentDate?: string;
  appointmentTime?: string;
  queueNumber?: number;
  rejectReason?: string;
};

type AuthResponse = AuthSession & {
  message: string;
};

type ApplicationsResponse = {
  applications: Application[];
};

type ApplicationResponse = {
  application: Application;
  message: string;
};

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object;
  token?: string | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { body, headers, token, ...rest } = options;
  const requestHeaders = new Headers(headers);
  const resolvedToken = token ?? getAuthToken();
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (resolvedToken) {
    requestHeaders.set("Authorization", `Bearer ${resolvedToken}`);
  }

  const response = await fetch(buildApiUrl(path), {
    ...rest,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const rawResponse = await response.text();
  let data: unknown = null;

  if (rawResponse) {
    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = rawResponse;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }

    const errorMessage =
      typeof data === "object" && data && "message" in data
        ? String(data.message)
        : "Request failed";

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const registerUser = async (payload: RegisterPayload) => {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
};

export const loginUser = async (payload: LoginPayload) => {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
};

export const fetchUserProfile = async () => {
  return apiRequest<{ user: AuthUser }>("/api/auth/profile");
};

export const fetchApplications = async () => {
  const response = await apiRequest<ApplicationsResponse>("/api/applications");
  return response.applications;
};

export const createApplication = async (payload: CreateApplicationPayload) => {
  const response = await apiRequest<ApplicationResponse>("/api/applications", {
    method: "POST",
    body: payload,
  });

  return response.application;
};

export const updateApplication = async (
  id: string,
  payload: UpdateApplicationPayload,
) => {
  const response = await apiRequest<ApplicationResponse>(`/api/applications/${id}`, {
    method: "PUT",
    body: payload,
  });

  return response.application;
};
