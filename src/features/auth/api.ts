import { httpClient } from "@/services/httpClient";
import type {
	AuthResult,
	ChangePasswordPayload,
	EnableTwoFactorResult,
	ForgotPasswordPayload,
	LoginPayload,
	LoginResult,
	RegisterPayload,
	RegisterPendingResult,
	ResendOtpPayload,
	ResetPasswordPayload,
	TwoFactorSetup,
	VerifyEmailPayload,
	VerifyTwoFactorPayload,
} from "./types";

export const authApi = {
	register: (payload: RegisterPayload) =>
		httpClient.post<RegisterPendingResult>("/auth/register", payload),
	verifyEmail: (payload: VerifyEmailPayload) =>
		httpClient.post<AuthResult>("/auth/verify-email", payload),
	resendOtp: (payload: ResendOtpPayload) =>
		httpClient.post<{ message: string }>("/auth/resend-otp", payload),
	login: (payload: LoginPayload) =>
		httpClient.post<LoginResult>("/auth/login", payload),
	verifyTwoFactor: (payload: VerifyTwoFactorPayload) =>
		httpClient.post<AuthResult>("/auth/2fa/verify", payload),
	logout: (refreshToken?: string) =>
		httpClient.post("/auth/logout", { refreshToken }),
	refresh: (refreshToken?: string) =>
		httpClient.post<AuthResult>("/auth/refresh", { refreshToken }),
	changePassword: (payload: ChangePasswordPayload) =>
		httpClient.post("/auth/change-password", {
			currentPassword: payload.oldPassword,
			newPassword: payload.newPassword,
		}),
	setupTwoFactor: () => httpClient.post<TwoFactorSetup>("/auth/2fa/setup", {}),
	enableTwoFactor: (token: string) =>
		httpClient.post<EnableTwoFactorResult>("/auth/2fa/enable", { token }),
	disableTwoFactor: (password: string, token: string) =>
		httpClient.post<{ message: string }>("/auth/2fa/disable", {
			password,
			token,
		}),
	forgotPassword: (payload: ForgotPasswordPayload) =>
		httpClient.post<{ message: string }>("/auth/forgot-password", payload),
	resetPassword: (payload: ResetPasswordPayload) =>
		httpClient.post<{ message: string }>("/auth/reset-password", payload),
	me: () => httpClient.get<AuthResult["user"]>("/users/me"),
};
