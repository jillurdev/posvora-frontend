export type SuperAdminRole = "OWNER" | "ADMIN" | "SUPPORT";

export interface SuperAdminProfile {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	role: SuperAdminRole;
	isActive: boolean;
	lastLoginAt?: string | null;
}

export interface AdminLoginPayload {
	email: string;
	password: string;
}

export interface AdminForgotPasswordPayload {
	email: string;
}

export interface AdminResetPasswordPayload {
	token: string;
	newPassword: string;
}
