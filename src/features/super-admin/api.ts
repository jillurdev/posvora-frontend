import { httpClient } from "@/services/httpClient";
import type {
	AdminDashboard,
	AdminOrganization,
	AdminOrganizationDetail,
	AssignSubscriptionPayload,
	CreatePlanPayload,
	CreatePlatformAdminPayload,
	Plan,
	PlatformAdmin,
	UpdatePlanPayload,
} from "./types";
import type { SupportTicket, SupportTicketStatus } from "@/features/support/types";

export const superAdminApi = {
	dashboard: () => httpClient.get<AdminDashboard>("/admin/dashboard"),
	organizations: (params?: { page?: number; limit?: number; search?: string }) =>
		httpClient.getPaginated<AdminOrganization[]>("/admin/organizations", params),
	organization: (id: string) => httpClient.get<AdminOrganizationDetail>(`/admin/organizations/${id}`),
	toggleOrganization: (id: string, isActive: boolean) =>
		httpClient.patch(`/admin/organizations/${id}/toggle`, { isActive }),
	assignSubscription: (id: string, payload: AssignSubscriptionPayload) =>
		httpClient.post(`/admin/organizations/${id}/subscription`, payload),

	plans: () => httpClient.get<Plan[]>("/admin/plans"),
	createPlan: (payload: CreatePlanPayload) => httpClient.post<Plan>("/admin/plans", payload),
	updatePlan: (id: string, payload: UpdatePlanPayload) => httpClient.patch<Plan>(`/admin/plans/${id}`, payload),
	togglePlan: (id: string, isActive: boolean) => httpClient.patch<Plan>(`/admin/plans/${id}/toggle`, { isActive }),

	admins: () => httpClient.get<PlatformAdmin[]>("/admin/admins"),
	createAdmin: (payload: CreatePlatformAdminPayload) => httpClient.post<PlatformAdmin>("/admin/admins", payload),
	toggleAdmin: (id: string, isActive: boolean) =>
		httpClient.patch<PlatformAdmin>(`/admin/admins/${id}/toggle`, { isActive }),

	supportTickets: (status?: string) =>
		httpClient.get<SupportTicket[]>("/admin/support-tickets", status ? { status } : undefined),
	supportTicket: (id: string) => httpClient.get<SupportTicket>(`/admin/support-tickets/${id}`),
	replySupportTicket: (id: string, message: string) =>
		httpClient.post(`/admin/support-tickets/${id}/messages`, { message }),
	updateSupportTicketStatus: (id: string, status: SupportTicketStatus) =>
		httpClient.patch(`/admin/support-tickets/${id}/status`, { status }),
	createAnnouncement: (payload: { title: string; message: string }) => httpClient.post("/admin/announcements", payload),
};
