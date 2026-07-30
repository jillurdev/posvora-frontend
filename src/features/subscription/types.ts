export interface Plan {
	id: string;
	name: string;
	slug: string;
	price: number;
	billingCycle: "MONTHLY" | "YEARLY";
	trialDays?: number;
	branchLimit?: number;
	userLimit?: number;
	storageLimitMb?: number;
	apiLimitPerDay?: number;
	features?: string[];
}

export interface Subscription {
	id: string;
	planId: string;
	status: string;
	trialEndsAt?: string | null;
	currentEnd?: string | null;
	scheduledPlanId?: string | null;
	scheduledPlan?: Plan | null;
	scheduledEffectiveAt?: string | null;
	creditBalance?: number;
	plan?: Plan;
}

export interface MySubscription {
	subscription: Subscription | null;
	hasUsedTrial: boolean;
}

export interface CheckoutResult {
	requiresPayment: boolean;
	scheduled: boolean;
	gatewayUrl?: string;
	effectiveAt?: string;
	durationMonths?: number;
	discountPercent?: number;
	creditApplied?: number;
	amount?: number;
	subscription?: Subscription;
}

export interface DurationQuote {
	months: number;
	discountPercent: number;
	listAmount: number;
	creditAmount: number;
	amount: number;
	monthlyRate: number;
}
