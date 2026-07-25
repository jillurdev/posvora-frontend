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
