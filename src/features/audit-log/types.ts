export interface AuditLogUser {
	id: string;
	name: string;
	email: string;
	roles: {
		role: { id: string; name: string; systemRole: string };
	}[];
}

export interface AuditLog {
	id: string;
	organizationId: string;
	userId?: string | null;
	action: string;
	module: string;
	entityId?: string | null;
	ipAddress?: string | null;
	changes?: Record<string, unknown> | null;
	createdAt: string;
	user?: AuditLogUser | null;
}
