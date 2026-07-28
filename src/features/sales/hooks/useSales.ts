"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesApi } from "../api";
import type { CreateSalePayload, SalePaymentPayload } from "../types";

export function useSales(branchId: string, params?: { customerId?: string; status?: string; page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["sales", branchId, params],
		queryFn: () => salesApi.list(branchId, params),
		enabled: !!branchId,
	});
}

export function useSale(id?: string) {
	return useQuery({ queryKey: ["sales", "detail", id], queryFn: () => salesApi.get(id!), enabled: !!id });
}

export function useCreateSale() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateSalePayload) => salesApi.create(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["sales"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useResumeSale() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: CreateSalePayload }) => salesApi.resume(id, payload),
		onSuccess: () => {
			toast.success("Sale completed");
			qc.invalidateQueries({ queryKey: ["sales"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useAddSalePayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: SalePaymentPayload }) => salesApi.addPayment(id, payload),
		onSuccess: () => {
			toast.success("Payment recorded");
			qc.invalidateQueries({ queryKey: ["sales"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

/** Opens the receipt PDF in a new tab. Uses a blob (not a direct <a href>)
 *  because the endpoint requires the auth cookie, which a plain link
 *  navigation still sends — but fetching explicitly lets us surface a
 *  clean error toast instead of a broken-looking blank tab on failure. */
export function useOpenReceipt() {
	return useMutation({
		mutationFn: (id: string) => salesApi.fetchReceiptBlob(id),
		onSuccess: (blob) => {
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank");
			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
