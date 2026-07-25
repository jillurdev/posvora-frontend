import { httpClient } from "@/services/httpClient";
import type {
	AuthResult,
	ChangePasswordPayload,
	LoginPayload,
	RegisterPayload,
} from "./types";

export const authApi = {
	register: (payload: RegisterPayload) =>
		httpClient.post<AuthResult>("/auth/register", payload),
	login: (payload: LoginPayload) =>
		httpClient.post<AuthResult>("/auth/login", payload),
	logout: (refreshToken?: string) =>
		httpClient.post("/auth/logout", { refreshToken }),
	refresh: (refreshToken?: string) =>
		httpClient.post<AuthResult>("/auth/refresh", { refreshToken }),
	changePassword: (payload: ChangePasswordPayload) =>
		httpClient.post("/auth/change-password", payload),
	me: () => httpClient.get<AuthResult["user"]>("/users/me"),
};
