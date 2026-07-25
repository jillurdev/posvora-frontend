import { httpClient } from "@/services/httpClient";
import type { AdminDashboard, AdminOrganization } from "./types";

export const superAdminApi = {
	dashboard: () => httpClient.get<AdminDashboard>("/admin/dashboard"),
	organizations: (params?: { page?: number; limit?: number; search?: string }) =>
		httpClient.getPaginated<AdminOrganization[]>("/admin/organizations", params),
	toggleOrganization: (id: string) => httpClient.patch(`/admin/organizations/${id}/toggle`),
	supportTickets: () => httpClient.get("/admin/support-tickets"),
	createAnnouncement: (payload: { title: string; body: string }) => httpClient.post("/admin/announcements", payload),
};
