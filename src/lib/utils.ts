import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatMoney(amount: number | string, currency = "BDT") {
	const value = typeof amount === "string" ? Number(amount) : amount;
	return new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(value || 0);
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
