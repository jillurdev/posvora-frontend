import { httpClient } from "@/services/httpClient";
import type { CheckoutResult, DurationQuote, MySubscription, Plan } from "./types";

export const subscriptionApi = {
	plans: () => httpClient.get<Plan[]>("/subscription/plans"),
	me: () => httpClient.get<MySubscription>("/subscription/me"),
	// Live price preview for a chosen duration — no side effects, safe to
	// call repeatedly while the owner is still picking a duration.
	quote: (planId: string, durationMonths?: number) =>
		httpClient.get<DurationQuote>(`/subscription/plans/${planId}/quote`, durationMonths ? { durationMonths } : undefined),
	// Replaces the old, unguarded `subscribe` call — the backend decides
	// whether this activates immediately (free plan / first free trial),
	// gets scheduled for period end (downgrade), or needs SSLCommerz
	// payment first (optionally for a custom multi-month duration).
	checkout: (planId: string, durationMonths?: number) =>
		httpClient.post<CheckoutResult>("/subscription/checkout", { planId, durationMonths }),
	cancel: () => httpClient.post("/subscription/cancel"),
};
