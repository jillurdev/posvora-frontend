import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatMoney(
	amount: number | string,
	currency = "BDT",
	options?: { locale?: string; minimumFractionDigits?: number; maximumFractionDigits?: number },
) {
	const value = typeof amount === "string" ? Number(amount) : amount;
	try {
		return new Intl.NumberFormat(options?.locale, {
			style: "currency",
			currency,
			minimumFractionDigits: options?.minimumFractionDigits,
			maximumFractionDigits: options?.maximumFractionDigits,
		}).format(value || 0);
	} catch {
		// An invalid/unsupported ISO 4217 currency code was stored (e.g. a
		// typo when a shop's settings were configured) — fail soft with a
		// plain number instead of crashing the page.
		return `${currency} ${(value || 0).toFixed(2)}`;
	}
}

export function formatDate(date: string | Date) {
	return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
		new Date(date),
	);
}

export function formatDateTime(date: string | Date) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}


/** Exact-rate multiplication helper for display/reporting conversions. Financial posting must persist the rate used. */
export function convertMoney(amount: number | string, rate: number | string): number {
	const value = typeof amount === "string" ? Number(amount) : amount;
	const fx = typeof rate === "string" ? Number(rate) : rate;
	return Number.isFinite(value) && Number.isFinite(fx) ? value * fx : 0;
}
