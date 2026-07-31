"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { shopApi } from "../api";
import type { ShopPayload } from "../types";

export function useShops() {
	return useQuery({ queryKey: ["shops"], queryFn: shopApi.list });
}

export function useCreateShop() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: ShopPayload) => shopApi.create(payload),
		onSuccess: () => {
			toast.success("Shop created");
			qc.invalidateQueries({ queryKey: ["shops"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUpdateShop() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: Partial<ShopPayload> }) => shopApi.update(id, payload),
		onSuccess: () => {
			toast.success("Shop updated");
			qc.invalidateQueries({ queryKey: ["shops"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteShop() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => shopApi.remove(id),
		onSuccess: () => {
			toast.success("Shop removed");
			qc.invalidateQueries({ queryKey: ["shops"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUploadShopLogo() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) => shopApi.uploadLogo(id, file),
		onSuccess: () => {
			toast.success("Shop logo updated");
			qc.invalidateQueries({ queryKey: ["shops"] });
		},
		onError: (err: Error) => toast.error(err.message || "Could not upload logo"),
	});
}
