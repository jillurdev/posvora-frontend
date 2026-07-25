"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { warehouseApi } from "../api";
import type { WarehousePayload } from "../types";

export function useWarehouses() {
	return useQuery({ queryKey: ["warehouses"], queryFn: warehouseApi.list });
}

export function useCreateWarehouse() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: WarehousePayload) => warehouseApi.create(payload),
		onSuccess: () => {
			toast.success("Warehouse created");
			qc.invalidateQueries({ queryKey: ["warehouses"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteWarehouse() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => warehouseApi.remove(id),
		onSuccess: () => {
			toast.success("Warehouse removed");
			qc.invalidateQueries({ queryKey: ["warehouses"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
