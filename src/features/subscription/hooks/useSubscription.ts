"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionApi } from "../api";
import type { CheckoutResult } from "../types";

export function usePlans() {
	return useQuery({ queryKey: ["plans"], queryFn: subscriptionApi.plans });
}

export function usePlanQuote(planId: string | undefined, durationMonths: number | undefined) {
	return useQuery({
		queryKey: ["subscription", "quote", planId, durationMonths],
		queryFn: () => subscriptionApi.quote(planId!, durationMonths),
		enabled: !!planId,
	});
}

export function useMySubscription() {
	return useQuery({ queryKey: ["subscription", "me"], queryFn: subscriptionApi.me, retry: false });
}

/**
 * Kicks off a plan change. The caller must branch on the result:
 *  - `requiresPayment` -> redirect the browser to `gatewayUrl` (SSLCommerz).
 *  - `scheduled` -> nothing to pay now, the plan switches at `effectiveAt`.
 *  - neither -> a free trial was activated immediately.
 */
export function useCheckout() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ planId, durationMonths }: { planId: string; durationMonths?: number }) =>
			subscriptionApi.checkout(planId, durationMonths),
		onSuccess: (result: CheckoutResult) => {
			if (result.requiresPayment && result.gatewayUrl) {
				window.location.href = result.gatewayUrl;
				return;
			}
			if (result.scheduled) {
				toast.success("Plan change scheduled for the end of your current billing period.");
			} else if (result.creditApplied) {
				toast.success("Your remaining plan balance covered this upgrade — no payment needed!");
			} else {
				toast.success("Your plan is now active.");
			}
			qc.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

export function useCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => subscriptionApi.cancel(),
		onSuccess: () => {
			toast.success("Subscription cancelled.");
			qc.invalidateQueries({ queryKey: ["subscription"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});
}
