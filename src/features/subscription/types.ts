export interface Plan {
	id: string;
	name: string;
	price: number;
	billingCycle: string;
	features?: string[];
}

export interface Subscription {
	id: string;
	planId: string;
	status: string;
	currentPeriodEnd?: string | null;
	plan?: Plan;
}
