import { httpClient } from "@/services/httpClient";
import type { CheckoutResult, DurationQuote, MySubscription, Plan } from "./types";

export type PaymentGateway = "SSLCOMMERZ" | "STRIPE" | "RAZORPAY";

export const subscriptionApi = {
	plans: () => httpClient.get<Plan[]>("/subscription/plans"),
	me: () => httpClient.get<MySubscription>("/subscription/mine/all"),
	// Live price preview for a chosen duration — no side effects, safe to
	// call repeatedly while the owner is still picking a duration.
	// `gateway` is the customer's own payment-method choice (SSLCommerz/BDT
	// vs Stripe/USD vs Razorpay/INR) — not derived from their country.
	// Omit to preview the organization's country-based default.
	quote: (planId: string, durationMonths?: number, gateway?: PaymentGateway) =>
		httpClient.get<DurationQuote>(`/subscription/plans/${planId}/quote`, {
			...(durationMonths ? { durationMonths } : {}),
			...(gateway ? { gateway } : {}),
		}),
	// Replaces the old, unguarded `subscribe` call — the backend decides
	// whether this activates immediately (free plan / first free trial),
	// gets scheduled for period end (downgrade), or needs payment first
	// (via whichever gateway the customer picked, optionally for a custom
	// multi-month duration). `autoRenew` is Stripe-only — opts into a real
	// recurring Stripe subscription instead of a fixed-term prepay; the
	// backend rejects combining it with durationMonths.
	checkout: (planId: string, durationMonths?: number, gateway?: PaymentGateway, autoRenew?: boolean) =>
		httpClient.post<CheckoutResult>("/subscription/checkout", { planId, durationMonths, gateway, autoRenew }),
	// Switches the org's running plan to one it already holds banked
	// (PAUSED) — no payment, no time lost either direction.
	switchTo: (subscriptionId: string) =>
		httpClient.post<{ id: string; status: string }>("/subscription/switch", { subscriptionId }),
	// Omit subscriptionId to cancel whatever plan is currently running;
	// pass it to cancel a specific banked plan instead.
	cancel: (subscriptionId?: string) => httpClient.post("/subscription/cancel", subscriptionId ? { subscriptionId } : undefined),
};
