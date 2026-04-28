import api from "./api";

/**
 * ══════════════════════════════════════════════
 *  VAMA — Authentication Service
 *  Spring Boot endpoints: /api/auth/*
 * ══════════════════════════════════════════════
 */

/* ── Types ──────────────────────────────────── */
export interface LoginPayload {
  email: string;
  password: string;
  role: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
  extraFields?: Record<string, string>;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    profileComplete: boolean;
  };
}

/* ── Login ──────────────────────────────────── */
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  const result: AuthResponse = response.data.data;
  sessionStorage.setItem("authToken", result.token);
  sessionStorage.setItem("userRole", result.user.role);
  sessionStorage.setItem("userEmail", result.user.email);
  sessionStorage.setItem("userName", result.user.fullName);
  return result;
};

/* ── Register ──────────────────────────────── */
export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  const result: AuthResponse = response.data.data;
  sessionStorage.setItem("authToken", result.token);
  sessionStorage.setItem("userRole", result.user.role);
  sessionStorage.setItem("userEmail", result.user.email);
  sessionStorage.setItem("userName", result.user.fullName);
  return result;
};

/* ── Logout ─────────────────────────────────── */
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    sessionStorage.clear();
  }
};

/* ── Verify Token ──────────────────────────── */
export const verifyToken = async (): Promise<AuthResponse["user"] | null> => {
  try {
    const response = await api.get("/auth/me");
    return response.data.data;
  } catch {
    return null;
  }
};

/* ── Refresh Token ─────────────────────────── */
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await api.post("/auth/refresh");
    const result: AuthResponse = response.data.data;
    sessionStorage.setItem("authToken", result.token);
    return result.token;
  } catch {
    return null;
  }
};
