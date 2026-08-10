export interface Plan {
	id: string;
	name: string;
	slug: string;
	price: number;
	// USD price for Stripe checkout (international orgs). Undefined/null
	// means this plan isn't purchasable outside Bangladesh yet.
	priceUsd?: number | null;
	billingCycle: "MONTHLY" | "YEARLY";
	trialDays?: number;
	branchLimit?: number;
	userLimit?: number;
	storageLimitMb?: number;
	apiLimitPerDay?: number;
	features?: string[];
}

export interface Invoice {
	id: string;
	amount: number;
	currency: string;
	status: string;
	paymentMethod?: string | null;
	createdAt: string;
	paidAt?: string | null;
	plan?: { name: string } | null;
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
	invoices?: Invoice[];
}

export interface MySubscription {
	subscription: Subscription | null;
	hasUsedTrial: boolean;
	// The organization's ISO country code — decides whether pricing here
	// (and at checkout) is in BDT via SSLCommerz or USD via Stripe.
	country: string;
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
	currency: string;
	unavailable?: boolean;
}
