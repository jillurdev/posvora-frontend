import { httpClient } from "@/services/httpClient";
import type {
	AdminDashboard,
	AdminInvoice,
	AdminOrganization,
	AdminOrganizationDetail,
	Announcement,
	AssignSubscriptionPayload,
	BillingSummary,
	CreatePlanPayload,
	CreatePlatformAdminPayload,
	KycDocument,
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
	announcements: (organizationId?: string) =>
		httpClient.get<Announcement[]>("/admin/announcements", organizationId ? { organizationId } : undefined),
	createAnnouncement: (payload: { title: string; message: string; organizationId?: string }) =>
		httpClient.post<Announcement>("/admin/announcements", payload),
	toggleAnnouncement: (id: string, isActive: boolean) =>
		httpClient.patch<Announcement>(`/admin/announcements/${id}/toggle`, { isActive }),

	billingSummary: () => httpClient.get<BillingSummary>("/admin/billing/summary"),
	invoices: (params?: { page?: number; limit?: number; status?: string; organizationId?: string }) =>
		httpClient.getPaginated<AdminInvoice[]>("/admin/billing/invoices", params),
	markInvoicePaid: (id: string, note?: string) =>
		httpClient.patch<AdminInvoice>(`/admin/billing/invoices/${id}/mark-paid`, { note }),

	kycDocuments: (status?: string) =>
		httpClient.get<KycDocument[]>("/admin/kyc/documents", status ? { status } : undefined),
	kycDocument: (id: string) => httpClient.get<KycDocument>(`/admin/kyc/documents/${id}`),
	reviewKycDocument: (id: string, payload: { approve: boolean; note?: string }) =>
		httpClient.patch<KycDocument>(`/admin/kyc/documents/${id}/review`, payload),
};
