"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { superAdminApi } from "../api";
import type { SupportTicketStatus } from "@/features/support/types";
import type { AssignSubscriptionPayload, CreatePlanPayload, CreatePlatformAdminPayload, UpdatePlanPayload } from "../types";

export function useAdminDashboard() {
	return useQuery({ queryKey: ["admin", "dashboard"], queryFn: superAdminApi.dashboard });
}

export function useAdminOrganizations(params?: { page?: number; limit?: number; search?: string }) {
	return useQuery({ queryKey: ["admin", "organizations", params], queryFn: () => superAdminApi.organizations(params) });
}

export function useAdminOrganization(id: string) {
	return useQuery({
		queryKey: ["admin", "organizations", id],
		queryFn: () => superAdminApi.organization(id),
		enabled: !!id,
	});
}

export function useAdminToggleOrganization() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => superAdminApi.toggleOrganization(id, isActive),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "organizations"] });
			qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
			toast.success("Organization status updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not update organization"),
	});
}

export function useAdminAssignSubscription(organizationId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: AssignSubscriptionPayload) => superAdminApi.assignSubscription(organizationId, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "organizations", organizationId] });
			qc.invalidateQueries({ queryKey: ["admin", "organizations"] });
			qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
			toast.success("Subscription updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not update subscription"),
	});
}

// ── Plans ──────────────────────────────────────────────────────
export function useAdminPlans() {
	return useQuery({ queryKey: ["admin", "plans"], queryFn: superAdminApi.plans });
}

export function useAdminCreatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreatePlanPayload) => superAdminApi.createPlan(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "plans"] });
			toast.success("Plan created");
		},
		onError: (err: Error) => toast.error(err.message || "Could not create plan"),
	});
}

export function useAdminUpdatePlan(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: UpdatePlanPayload) => superAdminApi.updatePlan(id, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "plans"] });
			toast.success("Plan updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not update plan"),
	});
}

export function useAdminTogglePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => superAdminApi.togglePlan(id, isActive),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "plans"] });
			toast.success("Plan status updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not update plan status"),
	});
}

// ── Platform staff ─────────────────────────────────────────────
export function useAdminStaff() {
	return useQuery({ queryKey: ["admin", "admins"], queryFn: superAdminApi.admins });
}

export function useAdminCreateStaff() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreatePlatformAdminPayload) => superAdminApi.createAdmin(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "admins"] });
			toast.success("Platform admin created");
		},
		onError: (err: Error) => toast.error(err.message || "Could not create admin"),
	});
}

export function useAdminToggleStaff() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => superAdminApi.toggleAdmin(id, isActive),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "admins"] });
			toast.success("Admin status updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not update admin status"),
	});
}

// ── Support tickets ────────────────────────────────────────────
export function useAdminSupportTickets(status?: string) {
	return useQuery({
		queryKey: ["admin", "support-tickets", status],
		queryFn: () => superAdminApi.supportTickets(status),
	});
}

export function useAdminSupportTicket(id: string) {
	return useQuery({
		queryKey: ["admin", "support-tickets", id],
		queryFn: () => superAdminApi.supportTicket(id),
		enabled: !!id,
	});
}

export function useAdminReplySupportTicket(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (message: string) => superAdminApi.replySupportTicket(id, message),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "support-tickets", id] }),
		onError: (err: Error) => toast.error(err.message || "Could not send reply"),
	});
}

export function useAdminUpdateTicketStatus(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (status: SupportTicketStatus) => superAdminApi.updateSupportTicketStatus(id, status),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "support-tickets", id] });
			qc.invalidateQueries({ queryKey: ["admin", "support-tickets"] });
			toast.success("Status updated");
		},
		onError: (err: Error) => toast.error(err.message || "Could not update status"),
	});
}

// ── KYC (organization verification) ─────────────────────────────
export function useAdminKycDocuments(status?: string) {
	return useQuery({
		queryKey: ["admin", "kyc-documents", status],
		queryFn: () => superAdminApi.kycDocuments(status),
	});
}

export function useAdminKycDocument(id: string) {
	return useQuery({
		queryKey: ["admin", "kyc-documents", id],
		queryFn: () => superAdminApi.kycDocument(id),
		enabled: !!id,
	});
}

export function useAdminReviewKycDocument() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, approve, note }: { id: string; approve: boolean; note?: string }) =>
			superAdminApi.reviewKycDocument(id, { approve, note }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "kyc-documents"] });
			qc.invalidateQueries({ queryKey: ["admin", "organizations"] });
			toast.success("KYC document reviewed");
		},
		onError: (err: Error) => toast.error(err.message || "Could not review document"),
	});
}

// ── Announcements (platform → organization messaging) ───────────
export function useAdminAnnouncements(organizationId?: string) {
	return useQuery({
		queryKey: ["admin", "announcements", organizationId],
		queryFn: () => superAdminApi.announcements(organizationId),
	});
}

export function useCreateAnnouncement() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { title: string; message: string; organizationId?: string }) =>
			superAdminApi.createAnnouncement(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "announcements"] });
			toast.success("Message sent");
		},
		onError: (err: Error) => toast.error(err.message || "Could not send message"),
	});
}

export function useToggleAnnouncement() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			superAdminApi.toggleAnnouncement(id, isActive),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "announcements"] });
			toast.success("Announcement updated");
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

// ── Billing ───────────────────────────────────────────────────────
export function useAdminBillingSummary() {
	return useQuery({ queryKey: ["admin", "billing", "summary"], queryFn: superAdminApi.billingSummary });
}

export function useAdminInvoices(params?: { page?: number; limit?: number; status?: string; organizationId?: string }) {
	return useQuery({
		queryKey: ["admin", "billing", "invoices", params],
		queryFn: () => superAdminApi.invoices(params),
	});
}

export function useMarkInvoicePaid() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, note }: { id: string; note?: string }) => superAdminApi.markInvoicePaid(id, note),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "billing"] });
			qc.invalidateQueries({ queryKey: ["admin", "organizations"] });
			toast.success("Invoice marked as paid");
		},
		onError: (err: Error) => toast.error(err.message || "Could not mark invoice as paid"),
	});
}
