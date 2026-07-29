import type { Plan, Subscription } from "./types";

/** Plans use a large sentinel (e.g. 999) rather than a literal unlimited flag. */
function formatLimit(n: number | undefined, unit: string) {
	if (n === undefined) return null;
	if (n >= 999) return `Unlimited ${unit}`;
	return `${n.toLocaleString()} ${unit}${n === 1 ? "" : "s"}`;
}

function formatStorage(mb: number | undefined) {
	if (mb === undefined) return null;
	if (mb >= 999_000) return "Unlimited storage";
	return mb >= 1024 ? `${(mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1)} GB storage` : `${mb} MB storage`;
}

/** What the plan card should show so an owner can actually compare capacity, not just price. */
export function planLimitLines(plan: Plan): string[] {
	return [
		formatLimit(plan.branchLimit, "branch"),
		formatLimit(plan.userLimit, "user"),
		formatStorage(plan.storageLimitMb),
		plan.apiLimitPerDay !== undefined ? `${plan.apiLimitPerDay.toLocaleString()} API calls/day` : null,
	].filter((line): line is string => !!line);
}

export function daysRemaining(dateStr?: string | null): number | null {
	if (!dateStr) return null;
	const diffMs = new Date(dateStr).getTime() - Date.now();
	return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export interface RenewalWarning {
	level: "urgent" | "notice";
	daysLeft: number;
	isTrial: boolean;
}

/**
 * Surfaces a renewal warning starting 15 days out — clients running real
 * businesses on this accumulate a lot of data, so they need advance notice,
 * not a same-day surprise. Escalates to "urgent" inside the last 3 days.
 * The Free plan is perpetual (no currentEnd), so it never warns.
 */
export function getRenewalWarning(subscription?: Subscription | null): RenewalWarning | null {
	if (!subscription || subscription.plan?.price === 0) return null;

	const isTrial = subscription.status === "TRIALING";
	if (subscription.status !== "TRIALING" && subscription.status !== "ACTIVE") return null;

	const boundary = isTrial ? subscription.trialEndsAt : subscription.currentEnd;
	const daysLeft = daysRemaining(boundary);
	if (daysLeft === null || daysLeft > 15) return null;

	return { level: daysLeft <= 3 ? "urgent" : "notice", daysLeft, isTrial };
}

/** Mirrors the backend's `isSubscriptionCurrentlyActive` — true while the current trial/paid period hasn't lapsed yet. */
export function isSubscriptionCurrentlyActive(subscription?: Subscription | null): boolean {
	if (!subscription) return false;
	if (subscription.status !== "ACTIVE" && subscription.status !== "TRIALING") return false;
	const boundary = subscription.status === "TRIALING" ? subscription.trialEndsAt : subscription.currentEnd;
	if (!boundary) return true;
	return new Date(boundary).getTime() > Date.now();
}

/** True when picking this plan would activate a genuinely free trial — no duration/payment step needed. */
export function isTrialEligible(plan: Plan, subscription: Subscription | null | undefined, hasUsedTrial: boolean): boolean {
	return (plan.trialDays ?? 0) > 0 && !hasUsedTrial && !isSubscriptionCurrentlyActive(subscription);
}
