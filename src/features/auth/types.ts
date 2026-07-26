import type { AuthUser } from "@/types/user";

export interface LoginPayload {
	identifier: string;
	password: string;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	phone?: string;
	organizationName: string;
	businessType: string;
}

export interface ChangePasswordPayload {
	oldPassword: string;
	newPassword: string;
}

export interface ForgotPasswordPayload {
	email: string;
}

export interface ResetPasswordPayload {
	token: string;
	newPassword: string;
}

export interface AuthResult {
	user: AuthUser;
	organization?: { id: string; name: string; handle: string | null };
	accessToken?: string;
	refreshToken?: string;
}
