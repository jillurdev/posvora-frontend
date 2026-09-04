"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";
import type { ReportFilter } from "../types";

export function useSellReport(params: ReportFilter, enabled = true) {
	return useQuery({
		queryKey: ["reports", "sell", params],
		queryFn: () => reportsApi.sellReport(params),
		enabled,
	});
}

export function useSellVatReport(params: ReportFilter & { groupBy?: "day" | "month" }, enabled = true) {
	return useQuery({
		queryKey: ["reports", "sell-vat", params],
		queryFn: () => reportsApi.sellVatReport(params),
		enabled,
	});
}

export function useYearlySellVatReport(params: ReportFilter, enabled = true) {
	return useQuery({
		queryKey: ["reports", "sell-vat-yearly", params],
		queryFn: () => reportsApi.yearlySellVatReport(params),
		enabled,
	});
}

export function useDailySellReport(params: { date?: string; shopId?: string }, enabled = true) {
	return useQuery({
		queryKey: ["reports", "daily-sell", params],
		queryFn: () => reportsApi.dailySellReport(params),
		enabled,
	});
}

export function useCategoryWiseSellReport(params: ReportFilter, enabled = true) {
	return useQuery({
		queryKey: ["reports", "category-wise-sell", params],
		queryFn: () => reportsApi.categoryWiseSellReport(params),
		enabled,
	});
}

export function useBrandWiseSellReport(params: ReportFilter, enabled = true) {
	return useQuery({
		queryKey: ["reports", "brand-wise-sell", params],
		queryFn: () => reportsApi.brandWiseSellReport(params),
		enabled,
	});
}

export function useProductWiseSellReport(params: ReportFilter, enabled = true) {
	return useQuery({
		queryKey: ["reports", "product-wise-sell", params],
		queryFn: () => reportsApi.productWiseSellReport(params),
		enabled,
	});
}

export function useMinStockReport(params: { shopId?: string }, enabled = true) {
	return useQuery({
		queryKey: ["reports", "min-stock", params],
		queryFn: () => reportsApi.minStockReport(params),
		enabled,
	});
}

export function useCustomerLedger(customerId: string | undefined, params: ReportFilter) {
	return useQuery({
		queryKey: ["reports", "customer-ledger", customerId, params],
		queryFn: () => reportsApi.customerLedger(customerId!, params),
		enabled: !!customerId,
	});
}
