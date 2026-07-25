"use client";

import { useQuery } from "@tanstack/react-query";
import { auditLogApi } from "../api";

export function useAuditLogs(params?: { page?: number; limit?: number; entity?: string }) {
	return useQuery({ queryKey: ["audit-logs", params], queryFn: () => auditLogApi.list(params) });
}
