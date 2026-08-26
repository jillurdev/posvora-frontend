"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerApi } from "../api";
import type { CustomerPayload } from "../types";

export function useCustomers(shopId: string, params?: { search?: string; page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["customers", shopId, params],
		queryFn: () => customerApi.list(shopId, params),
		enabled: !!shopId,
	});
}

export function useCustomerGroups(shopId?: string) {
	return useQuery({
		queryKey: ["customer-groups", shopId],
		queryFn: () => customerApi.listGroups(shopId!),
		enabled: !!shopId,
	});
}

export function useCreateCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CustomerPayload) => customerApi.create(payload),
		onSuccess: () => {
			toast.success("Customer added");
			qc.invalidateQueries({ queryKey: ["customers"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => customerApi.remove(id),
		onSuccess: () => {
			toast.success("Customer removed");
			qc.invalidateQueries({ queryKey: ["customers"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useCustomer(id: string) {
	return useQuery({ queryKey: ["customer", id], queryFn: () => customerApi.get(id), enabled: !!id });
}

export function useCustomerStatement(id: string, currency?: string) {
	return useQuery({
		queryKey: ["customer-statement", id, currency],
		queryFn: () => customerApi.statement(id, currency),
		enabled: !!id,
	});
}

export function useUpdateCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomerPayload> }) => customerApi.update(id, payload),
		onSuccess: (_data, vars) => {
			toast.success("Customer updated");
			qc.invalidateQueries({ queryKey: ["customers"] });
			qc.invalidateQueries({ queryKey: ["customer", vars.id] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useAddCustomerNote() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, note }: { id: string; note: string }) => customerApi.addNote(id, note),
		onSuccess: (_data, vars) => {
			toast.success("Note added");
			qc.invalidateQueries({ queryKey: ["customer", vars.id] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useAddCustomerFollowUp() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { dueDate: string; note?: string } }) =>
			customerApi.addFollowUp(id, payload),
		onSuccess: (_data, vars) => {
			toast.success("Follow-up scheduled");
			qc.invalidateQueries({ queryKey: ["customer", vars.id] });
			qc.invalidateQueries({ queryKey: ["due-follow-ups"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDueFollowUps() {
	return useQuery({ queryKey: ["due-follow-ups"], queryFn: customerApi.dueFollowUps });
}
