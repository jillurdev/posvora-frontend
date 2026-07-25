import { httpClient } from "@/services/httpClient";
import type { AdminDashboard, AdminOrganization } from "./types";
import type { SupportTicket, SupportTicketStatus } from "@/features/support/types";
import type { CreateStaffPayload, SuperAdminStaff } from "./staff-types";

export const superAdminApi = {
	dashboard: () => httpClient.get<AdminDashboard>("/admin/dashboard"),
	organizations: (params?: { page?: number; limit?: number; search?: string }) =>
		httpClient.getPaginated<AdminOrganization[]>("/admin/organizations", params),
	// isActive body was previously missing entirely — this always no-op'd.
	toggleOrganization: (id: string, isActive: boolean) =>
		httpClient.patch(`/admin/organizations/${id}/toggle`, { isActive }),
	supportTickets: (status?: string) =>
		httpClient.get<SupportTicket[]>("/admin/support-tickets", status ? { status } : undefined),
	supportTicket: (id: string) => httpClient.get<SupportTicket>(`/admin/support-tickets/${id}`),
	replySupportTicket: (id: string, message: string) =>
		httpClient.post(`/admin/support-tickets/${id}/messages`, { message }),
	updateSupportTicketStatus: (id: string, status: SupportTicketStatus) =>
		httpClient.patch(`/admin/support-tickets/${id}/status`, { status }),
	createAnnouncement: (payload: { title: string; message: string }) => httpClient.post("/admin/announcements", payload),

	// Platform staff (SuperAdmin) management
	listStaff: () => httpClient.get<SuperAdminStaff[]>("/admin/staff"),
	createStaff: (payload: CreateStaffPayload) => httpClient.post<SuperAdminStaff>("/admin/staff", payload),
	toggleStaff: (id: string, isActive: boolean) =>
		httpClient.patch<SuperAdminStaff>(`/admin/staff/${id}/toggle`, { isActive }),
	resetStaffPassword: (id: string, newPassword: string) =>
		httpClient.patch(`/admin/staff/${id}/reset-password`, { newPassword }),
};
