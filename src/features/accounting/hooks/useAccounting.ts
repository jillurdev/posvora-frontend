"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountingApi } from "../api";

export function useAccounts(shopId?: string) {
	return useQuery({ queryKey: ["accounts", shopId], queryFn: () => accountingApi.listAccounts(shopId!), enabled: !!shopId });
}

export function useExpenseCategories(shopId?: string) {
	return useQuery({
		queryKey: ["expense-categories", shopId],
		queryFn: () => accountingApi.listExpenseCategories(shopId!),
		enabled: !!shopId,
	});
}

export function useExpenses(params: { branchId?: string; categoryId?: string }) {
	return useQuery({
		queryKey: ["expenses", params],
		queryFn: () => accountingApi.listExpenses(params),
		enabled: !!params.branchId,
	});
}

export function useCreateExpense() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: { branchId: string; categoryId: string; amount: number; frequency?: string; note?: string }) =>
			accountingApi.createExpense(payload),
		onSuccess: () => {
			toast.success("Expense recorded");
			qc.invalidateQueries({ queryKey: ["expenses"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useTrialBalance(shopId?: string) {
	return useQuery({
		queryKey: ["trial-balance", shopId],
		queryFn: () => accountingApi.trialBalance(shopId!),
		enabled: !!shopId,
	});
}

export function useProfitLoss(branchId?: string, params?: { from: string; to: string }) {
	return useQuery({
		queryKey: ["profit-loss", branchId, params],
		queryFn: () => accountingApi.profitLoss(branchId!, params!),
		enabled: !!branchId && !!params?.from && !!params?.to,
	});
}

export function useCloseDay() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ branchId, payload }: { branchId: string; payload: { date: string; openingCash: number; closingCash: number } }) =>
			accountingApi.closeDay(branchId, payload),
		onSuccess: () => {
			toast.success("Day closed successfully");
			qc.invalidateQueries({ queryKey: ["expenses"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
