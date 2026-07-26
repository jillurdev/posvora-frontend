import type { SystemRole } from "./roles";

export interface AuthUser {
	id: string;
	email: string;
	name: string;
	phone?: string | null;
	avatarUrl?: string | null;
	status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
	organizationId: string | null;
	organization?: { id: string; name: string; handle: string | null } | null;
	roles: SystemRole[];
	mustChangePassword?: boolean;
	twoFactorEnabled?: boolean;
}
