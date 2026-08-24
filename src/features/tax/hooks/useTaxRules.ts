"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taxApi } from "../api";
import type { CreateTaxRulePayload, UpdateTaxRulePayload } from "../types";

export function useTaxRules(shopId?: string) {
	return useQuery({
		queryKey: ["tax-rules", shopId],
		queryFn: () => taxApi.list(shopId!),
		enabled: !!shopId,
	});
}

export function useCreateTaxRule() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateTaxRulePayload) => taxApi.create(payload),
		onSuccess: (_data, variables) => {
			toast.success("Tax rule added");
			qc.invalidateQueries({ queryKey: ["tax-rules", variables.shopId] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useUpdateTaxRule(shopId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateTaxRulePayload }) => taxApi.update(id, payload),
		onSuccess: () => {
			toast.success("Tax rule updated");
			qc.invalidateQueries({ queryKey: ["tax-rules", shopId] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useDeleteTaxRule(shopId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => taxApi.remove(id),
		onSuccess: () => {
			toast.success("Tax rule removed");
			qc.invalidateQueries({ queryKey: ["tax-rules", shopId] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
