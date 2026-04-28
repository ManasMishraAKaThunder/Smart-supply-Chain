import api from "./api";

/**
 * ══════════════════════════════════════════════
 *  VAMA — User / Profile Service
 *  Spring Boot endpoints: /api/users/*
 * ══════════════════════════════════════════════
 */

/* ── Types ──────────────────────────────────── */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address?: string;
  organization?: string;
  businessName?: string;
  supplyCategory?: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  organization?: string;
  businessName?: string;
  supplyCategory?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/* ── Get Profile ───────────────────────────── */
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/users/profile");
  return response.data.data;
};

/* ── Update Profile ────────────────────────── */
export const updateUserProfile = async (data: UpdateProfilePayload): Promise<UserProfile> => {
  const response = await api.put("/users/profile", data);
  return response.data.data;
};

/* ── Change Password ───────────────────────── */
export const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
  await api.put("/users/password", data);
};

/* ── Get Users by Role (admin) ─────────────── */
export const getUsersByRole = async (role: string): Promise<UserProfile[]> => {
  const response = await api.get(`/users?role=${role}`);
  return response.data.data;
};
