import { httpClient } from "@/services/httpClient";
import type { AuditLog } from "./types";

export const auditLogApi = {
	list: (params?: { page?: number; limit?: number; entity?: string }) =>
		httpClient.getPaginated<AuditLog[]>("/audit-logs", params),
};
