"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesApi } from "../api";
import type { CreateSalePayload } from "../types";

export function useSales(branchId: string, params?: { customerId?: string; status?: string; page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["sales", branchId, params],
		queryFn: () => salesApi.list(branchId, params),
		enabled: !!branchId,
	});
}

export function useCreateSale() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateSalePayload) => salesApi.create(payload),
		onSuccess: () => {
			toast.success("Sale completed");
			qc.invalidateQueries({ queryKey: ["sales"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
