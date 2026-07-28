export interface Plan {
	id: string;
	name: string;
	price: number;
	billingCycle: string;
	trialDays?: number;
	features?: string[];
}

export interface Subscription {
	id: string;
	planId: string;
	status: string;
	trialEndsAt?: string | null;
	currentEnd?: string | null;
	currentPeriodEnd?: string | null;
	scheduledPlanId?: string | null;
	scheduledPlan?: Plan | null;
	scheduledEffectiveAt?: string | null;
	plan?: Plan;
}

export interface CheckoutResult {
	requiresPayment: boolean;
	scheduled: boolean;
	gatewayUrl?: string;
	effectiveAt?: string;
	subscription?: Subscription;
}
