import { httpClient } from "@/services/httpClient";
import type { AdminLoginPayload, SuperAdminProfile } from "./types";

interface AdminLoginResult {
	admin: { id: string; name: string; email: string };
	accessToken: string;
}

export const adminAuthApi = {
	login: (payload: AdminLoginPayload) => httpClient.post<AdminLoginResult>("/auth/admin/login", payload),
	logout: () => httpClient.post("/auth/admin/logout"),
	me: () => httpClient.get<SuperAdminProfile>("/admin/me"),
};
