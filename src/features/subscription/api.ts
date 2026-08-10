import { httpClient } from "@/services/httpClient";
import type { CheckoutResult, DurationQuote, MySubscription, Plan } from "./types";

export type PaymentGateway = "SSLCOMMERZ" | "STRIPE";

export const subscriptionApi = {
	plans: () => httpClient.get<Plan[]>("/subscription/plans"),
	me: () => httpClient.get<MySubscription>("/subscription/me"),
	// Live price preview for a chosen duration — no side effects, safe to
	// call repeatedly while the owner is still picking a duration.
	// `gateway` is the customer's own payment-method choice (SSLCommerz/BDT
	// vs Stripe/USD) — not derived from their country. Omit to preview the
	// organization's country-based default.
	quote: (planId: string, durationMonths?: number, gateway?: PaymentGateway) =>
		httpClient.get<DurationQuote>(`/subscription/plans/${planId}/quote`, {
			...(durationMonths ? { durationMonths } : {}),
			...(gateway ? { gateway } : {}),
		}),
	// Replaces the old, unguarded `subscribe` call — the backend decides
	// whether this activates immediately (free plan / first free trial),
	// gets scheduled for period end (downgrade), or needs payment first
	// (via whichever gateway the customer picked, optionally for a custom
	// multi-month duration).
	checkout: (planId: string, durationMonths?: number, gateway?: PaymentGateway) =>
		httpClient.post<CheckoutResult>("/subscription/checkout", { planId, durationMonths, gateway }),
	cancel: () => httpClient.post("/subscription/cancel"),
};
