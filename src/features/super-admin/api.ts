import { httpClient } from "@/services/httpClient";
import type { AdminDashboard, AdminOrganization } from "./types";
import type { SupportTicket, SupportTicketStatus } from "@/features/support/types";

export const superAdminApi = {
	dashboard: () => httpClient.get<AdminDashboard>("/admin/dashboard"),
	organizations: (params?: { page?: number; limit?: number; search?: string }) =>
		httpClient.getPaginated<AdminOrganization[]>("/admin/organizations", params),
	toggleOrganization: (id: string) => httpClient.patch(`/admin/organizations/${id}/toggle`),
	supportTickets: (status?: string) =>
		httpClient.get<SupportTicket[]>("/admin/support-tickets", status ? { status } : undefined),
	supportTicket: (id: string) => httpClient.get<SupportTicket>(`/admin/support-tickets/${id}`),
	replySupportTicket: (id: string, message: string) =>
		httpClient.post(`/admin/support-tickets/${id}/messages`, { message }),
	updateSupportTicketStatus: (id: string, status: SupportTicketStatus) =>
		httpClient.patch(`/admin/support-tickets/${id}/status`, { status }),
	createAnnouncement: (payload: { title: string; message: string }) => httpClient.post("/admin/announcements", payload),
};
