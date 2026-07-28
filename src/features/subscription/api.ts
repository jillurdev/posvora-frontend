import { httpClient } from "@/services/httpClient";
import type { CheckoutResult, Plan, Subscription } from "./types";

export const subscriptionApi = {
	plans: () => httpClient.get<Plan[]>("/subscription/plans"),
	me: () => httpClient.get<Subscription | null>("/subscription/me"),
	// Replaces the old, unguarded `subscribe` call — the backend decides
	// whether this activates immediately (first free trial), gets scheduled
	// for period end (downgrade), or needs SSLCommerz payment first.
	checkout: (planId: string) => httpClient.post<CheckoutResult>("/subscription/checkout", { planId }),
	cancel: () => httpClient.post("/subscription/cancel"),
};
