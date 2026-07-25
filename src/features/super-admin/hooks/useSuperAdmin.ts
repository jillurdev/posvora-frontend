"use client";

import { useQuery } from "@tanstack/react-query";
import { superAdminApi } from "../api";

export function useAdminDashboard() {
	return useQuery({ queryKey: ["admin", "dashboard"], queryFn: superAdminApi.dashboard });
}

export function useAdminOrganizations(params?: { page?: number; limit?: number; search?: string }) {
	return useQuery({ queryKey: ["admin", "organizations", params], queryFn: () => superAdminApi.organizations(params) });
}
