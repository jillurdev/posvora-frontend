"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { superAdminApi } from "../api";
import type { SupportTicketStatus } from "@/features/support/types";

export function useAdminDashboard() {
	return useQuery({ queryKey: ["admin", "dashboard"], queryFn: superAdminApi.dashboard });
}

export function useAdminOrganizations(params?: { page?: number; limit?: number; search?: string }) {
	return useQuery({ queryKey: ["admin", "organizations", params], queryFn: () => superAdminApi.organizations(params) });
}

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
