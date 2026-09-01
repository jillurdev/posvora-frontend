"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionApi, type PaymentGateway } from "../api";
import type { CheckoutResult } from "../types";

export function usePlans() {
	return useQuery({ queryKey: ["plans"], queryFn: subscriptionApi.plans });
}

export function usePlanQuote(planId: string | undefined, durationMonths: number | undefined, gateway?: PaymentGateway) {
	return useQuery({
		queryKey: ["subscription", "quote", planId, durationMonths, gateway],
		queryFn: () => subscriptionApi.quote(planId!, durationMonths, gateway),
		enabled: !!planId,
	});
}

export function useMySubscription() {
	return useQuery({ queryKey: ["subscription", "me"], queryFn: subscriptionApi.me, retry: false });
}

/**
 * Kicks off a plan change. The caller must branch on the result:
 *  - `requiresPayment` -> redirect the browser to `gatewayUrl` (SSLCommerz, Stripe, or Razorpay, whichever the customer picked).
 *  - `banked` (after payment confirms) -> the plan was paid for but another plan is already running, so it landed PAUSED — switch into it any time via useSwitchPlan.
 *  - neither -> a free trial (or the Free plan) was activated immediately.
 */
export function useCheckout() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ planId, durationMonths, gateway, autoRenew }: { planId: string; durationMonths?: number; gateway?: PaymentGateway; autoRenew?: boolean }) =>
			subscriptionApi.checkout(planId, durationMonths, gateway, autoRenew),
		onSuccess: (result: CheckoutResult) => {
			if (result.requiresPayment && result.gatewayUrl) {
				window.location.href = result.gatewayUrl;
				return;
			}
			toast.success("Your plan is now active.");
			qc.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

/** Switches the org's running plan to an already-held, banked (PAUSED) plan — no payment involved. */
export function useSwitchPlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (subscriptionId: string) => subscriptionApi.switchTo(subscriptionId),
		onSuccess: () => {
			toast.success("Switched plans.");
			qc.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (subscriptionId?: string) => subscriptionApi.cancel(subscriptionId),
		onSuccess: () => {
			toast.success("Subscription cancelled.");
			qc.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
