import { httpClient } from "@/services/httpClient";
import type { AdminLoginPayload, AdminForgotPasswordPayload, AdminResetPasswordPayload, SuperAdminProfile } from "./types";

interface AdminLoginResult {
	admin: { id: string; name: string; email: string };
	accessToken: string;
}

export const adminAuthApi = {
	login: (payload: AdminLoginPayload) => httpClient.post<AdminLoginResult>("/auth/admin/login", payload),
	logout: () => httpClient.post("/auth/admin/logout"),
	me: () => httpClient.get<SuperAdminProfile>("/admin/me"),
	updateProfile: (payload: { name?: string; phone?: string }) =>
		httpClient.patch<SuperAdminProfile>("/admin/me", payload),
	changePassword: (payload: { currentPassword: string; newPassword: string }) =>
		httpClient.post<{ message: string }>("/admin/change-password", payload),
	forgotPassword: (payload: AdminForgotPasswordPayload) =>
		httpClient.post<{ message: string }>("/auth/admin/forgot-password", payload),
	resetPassword: (payload: AdminResetPasswordPayload) =>
		httpClient.post<{ message: string }>("/auth/admin/reset-password", payload),
};
