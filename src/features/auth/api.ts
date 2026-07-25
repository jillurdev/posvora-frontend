import { httpClient } from "@/services/httpClient";
import type {
	AuthResult,
	ChangePasswordPayload,
	ForgotPasswordPayload,
	LoginPayload,
	RegisterPayload,
	ResetPasswordPayload,
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
		httpClient.post("/auth/change-password", {
			currentPassword: payload.oldPassword,
			newPassword: payload.newPassword,
		}),
	forgotPassword: (payload: ForgotPasswordPayload) =>
		httpClient.post<{ message: string }>("/auth/forgot-password", payload),
	resetPassword: (payload: ResetPasswordPayload) =>
		httpClient.post<{ message: string }>("/auth/reset-password", payload),
	me: () => httpClient.get<AuthResult["user"]>("/users/me"),
};
