export interface SuperAdminStaff {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	isActive: boolean;
	lastLoginAt?: string | null;
	createdAt: string;
}

export interface CreateStaffPayload {
	name: string;
	email: string;
	phone?: string;
	password: string;
}
