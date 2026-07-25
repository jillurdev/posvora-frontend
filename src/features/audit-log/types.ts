export interface AuditLog {
	id: string;
	userId?: string | null;
	action: string;
	entity: string;
	entityId?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt: string;
}
