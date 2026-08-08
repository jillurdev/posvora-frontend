"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { purchaseApi } from "../api";
import type { CreatePurchasePayload } from "../types";
import type { PurchasePaymentMethod } from "../types";

export function usePurchases(branchId: string, params?: { supplierId?: string; page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["purchases", branchId, params],
		queryFn: () => purchaseApi.list(branchId, params),
		enabled: !!branchId,
	});
}

export function usePurchase(id?: string) {
	return useQuery({
		queryKey: ["purchases", id],
		queryFn: () => purchaseApi.get(id!),
		enabled: !!id,
	});
}

export function useCreatePurchase() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreatePurchasePayload) => purchaseApi.create(payload),
		onSuccess: () => {
			toast.success("Purchase order created");
			qc.invalidateQueries({ queryKey: ["purchases"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useReceivePurchase(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { warehouseId: string; items: { purchaseItemId: string; quantity: number }[] }) =>
			purchaseApi.receive(id, payload),
		onSuccess: () => {
			toast.success("Stock received and inventory updated");
			qc.invalidateQueries({ queryKey: ["purchases"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useAddPurchasePayment(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { method: PurchasePaymentMethod; amount: number; transactionRef?: string }) =>
			purchaseApi.addPayment(id, payload),
		onSuccess: () => {
			toast.success("Payment recorded");
			qc.invalidateQueries({ queryKey: ["purchases"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
