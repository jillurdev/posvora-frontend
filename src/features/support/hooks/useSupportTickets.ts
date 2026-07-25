"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supportApi } from "../api";
import type { CreateTicketPayload } from "../types";

export function useSupportTickets() {
	return useQuery({ queryKey: ["support-tickets"], queryFn: supportApi.list });
}

export function useSupportTicket(id: string) {
	return useQuery({
		queryKey: ["support-tickets", id],
		queryFn: () => supportApi.getOne(id),
		enabled: !!id,
	});
}

export function useCreateSupportTicket() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateTicketPayload) => supportApi.create(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["support-tickets"] });
			toast.success("Ticket submitted — our team will get back to you soon.");
		},
		onError: (err: Error) => toast.error(err.message || "Could not submit ticket"),
	});
}

export function useReplySupportTicket(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (message: string) => supportApi.reply(id, message),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["support-tickets", id] });
		},
		onError: (err: Error) => toast.error(err.message || "Could not send message"),
	});
}
