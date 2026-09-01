export interface PlanPrice {
	currencyCode: string;
	amount: number;
	countryCode?: string | null;
	billingCycle: "MONTHLY" | "YEARLY";
}

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
	// Per-currency list prices (BDT, USD, etc.) — populated on the public
	// /subscription/plans endpoint. Absent/empty means only `price` (BDT)
	// and optionally `priceUsd` apply.
	prices?: PlanPrice[];
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
	// AWAITING_PAYMENT | TRIALING | ACTIVE | PAUSED | PAST_DUE | CANCELLED | EXPIRED
	status: string;
	trialEndsAt?: string | null;
	currentEnd?: string | null;
	// Set while this row is PAUSED (banked) — how much purchased time is
	// frozen on it, in milliseconds. Convert to days for display:
	// Math.ceil(Number(pausedRemainingMs) / 86_400_000).
	pausedRemainingMs?: string | number | null;
	pausedAt?: string | null;
	plan?: Plan;
	invoices?: Invoice[];
	// Set once a Stripe recurring subscription is active for this org — see
	// subscription.service's invoice.paid webhook handling on the backend.
	// Non-null means Stripe is auto-charging the saved card every billing
	// cycle; nextBillingAt is when that next charge will happen.
	autoRenew?: boolean;
	gatewaySubscriptionId?: string | null;
	nextBillingAt?: string | null;
}

export interface MySubscription {
	// The plan currently granting access. Kept for backward compatibility —
	// same value as `active`.
	subscription: Subscription | null;
	active: Subscription | null;
	// Other plans this org has already paid for and can switch into any
	// time, at no extra cost — see SubscriptionService.switchTo() on the
	// backend.
	paused: Subscription[];
	all?: Subscription[];
	hasUsedTrial: boolean;
	// The organization's ISO country code — decides whether pricing here
	// (and at checkout) is in BDT via SSLCommerz or USD via Stripe.
	country: string;
}

export interface CheckoutResult {
	requiresPayment: boolean;
	// True when the payment just confirmed was for a plan other than the
	// one currently running — it lands PAUSED (banked) instead of ACTIVE,
	// ready to switch into any time.
	banked: boolean;
	gatewayUrl?: string;
	durationMonths?: number;
	discountPercent?: number;
	amount?: number;
	subscription?: Subscription;
}

export interface DurationQuote {
	months: number;
	discountPercent: number;
	listAmount: number;
	amount: number;
	monthlyRate: number;
	currency: string;
	unavailable?: boolean;
}
