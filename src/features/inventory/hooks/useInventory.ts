"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inventoryApi } from "../api";
import type { StockInPayload, StockOutPayload, StockTransferPayload } from "../types";

export function useStock(params: { warehouseId?: string; branchId?: string; productId?: string }) {
	return useQuery({ queryKey: ["inventory", "stock", params], queryFn: () => inventoryApi.stock(params) });
}

export function useLowStock(params: { warehouseId?: string; branchId?: string }) {
	return useQuery({ queryKey: ["inventory", "low-stock", params], queryFn: () => inventoryApi.lowStock(params) });
}

export function useStockMovements(params: { warehouseId?: string; branchId?: string; productId?: string }) {
	return useQuery({ queryKey: ["inventory", "movements", params], queryFn: () => inventoryApi.movements(params) });
}

export function useStockIn() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: StockInPayload) => inventoryApi.stockIn(payload),
		onSuccess: () => {
			toast.success("Stock added");
			qc.invalidateQueries({ queryKey: ["inventory"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useStockOut() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: StockOutPayload) => inventoryApi.stockOut(payload),
		onSuccess: () => {
			toast.success("Stock removed");
			qc.invalidateQueries({ queryKey: ["inventory"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useStockTransfer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: StockTransferPayload) => inventoryApi.transfer(payload),
		onSuccess: () => {
			toast.success("Stock transferred");
			qc.invalidateQueries({ queryKey: ["inventory"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
