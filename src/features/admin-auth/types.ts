export interface SuperAdminProfile {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	isActive: boolean;
	lastLoginAt?: string | null;
}

export interface AdminLoginPayload {
	email: string;
	password: string;
}
