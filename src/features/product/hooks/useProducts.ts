"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productApi } from "../api";
import type { CreateProductPayload, ListProductsQuery } from "../types";

export function useProducts(query: ListProductsQuery) {
	return useQuery({
		queryKey: ["products", query],
		queryFn: () => productApi.list(query),
		enabled: !!query.shopId,
	});
}

export function useProduct(id?: string) {
	return useQuery({ queryKey: ["products", id], queryFn: () => productApi.get(id!), enabled: !!id });
}

export function useCreateProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateProductPayload) => productApi.create(payload),
		onSuccess: () => {
			toast.success("Product created");
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUpdateProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateProductPayload> }) =>
			productApi.update(id, payload),
		onSuccess: () => {
			toast.success("Product updated");
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => productApi.remove(id),
		onSuccess: () => {
			toast.success("Product removed");
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
