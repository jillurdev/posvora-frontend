"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supplierApi } from "../api";
import type { SupplierPayload } from "../types";

export function useSuppliers(shopId: string, params?: { search?: string; page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["suppliers", shopId, params],
		queryFn: () => supplierApi.list(shopId, params),
		enabled: !!shopId,
	});
}

export function useCreateSupplier() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: SupplierPayload) => supplierApi.create(payload),
		onSuccess: () => {
			toast.success("Supplier added");
			qc.invalidateQueries({ queryKey: ["suppliers"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteSupplier() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => supplierApi.remove(id),
		onSuccess: () => {
			toast.success("Supplier removed");
			qc.invalidateQueries({ queryKey: ["suppliers"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
