"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productApi } from "../api";

export function useCategories(shopId?: string) {
	return useQuery({
		queryKey: ["categories", shopId],
		queryFn: () => productApi.listCategories(shopId!),
		enabled: !!shopId,
	});
}

export function useBrands(shopId?: string) {
	return useQuery({ queryKey: ["brands", shopId], queryFn: () => productApi.listBrands(shopId!), enabled: !!shopId });
}

export function useUnits(shopId?: string) {
	return useQuery({ queryKey: ["units", shopId], queryFn: () => productApi.listUnits(shopId!), enabled: !!shopId });
}

export function useCreateCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { shopId: string; name: string; parentId?: string }) => productApi.createCategory(payload),
		onSuccess: () => {
			toast.success("Category created");
			qc.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useCreateBrand() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { shopId: string; name: string }) => productApi.createBrand(payload),
		onSuccess: () => {
			toast.success("Brand created");
			qc.invalidateQueries({ queryKey: ["brands"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useCreateUnit() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { shopId: string; name: string; shortName: string }) => productApi.createUnit(payload),
		onSuccess: () => {
			toast.success("Unit created");
			qc.invalidateQueries({ queryKey: ["units"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
