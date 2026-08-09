"use client";

import { useCallback } from "react";
import { useActiveShop } from "@/context/ActiveShopContext";
import { formatMoney } from "@/lib/utils";

/**
 * Returns the active shop's currency code (e.g. "BDT", "USD", "INR"),
 * falling back to "BDT" only if the shop hasn't set one — matching the
 * backend's own Shop.currency default so the two stay in sync.
 */
export function useCurrency(): string {
	const { shops, activeShopId } = useActiveShop();
	const activeShop = shops.find(s => s.id === activeShopId);
	return activeShop?.currency || "BDT";
}

/**
 * Returns the active shop's ISO country code (e.g. "BD", "US"), falling
 * back to "BD" only if the shop hasn't set one — matching the backend's
 * own Shop.country default so the two stay in sync.
 */
export function useCountry(): string {
	const { shops, activeShopId } = useActiveShop();
	const activeShop = shops.find(s => s.id === activeShopId);
	return activeShop?.country || "BD";
}

/**
 * Same formatting as `formatMoney`, but bound to the active shop's own
 * currency automatically. Prefer this over importing `formatMoney`
 * directly anywhere inside the authenticated dashboard.
 */
export function useFormatMoney() {
	const currency = useCurrency();
	return useCallback((amount: number | string) => formatMoney(amount, currency), [currency]);
}
