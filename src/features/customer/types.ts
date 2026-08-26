export interface CustomerGroup {
	id: string;
	shopId: string;
	name: string;
	type: string;
	discountPercent?: number | null;
}

export interface Customer {
	id: string;
	shopId: string;
	name: string;
	phone?: string | null;
	email?: string | null;
	address?: string | null;
	groupId?: string | null;
	createdAt: string;
	/**
	 * Ledger-derived outstanding balance per currency (positive = customer
	 * owes the shop), computed from ReceivableEntry — the accounting source
	 * of truth. May contain multiple currencies for multi-currency shops.
	 */
	balancesByCurrency?: Record<string, number>;
	// Only present on the single-customer detail endpoint (GET /customers/:id).
	notes?: CustomerNote[];
	followUps?: FollowUp[];
	sales?: { id: string; totalAmount: number; createdAt: string; status?: string }[];
}

export interface CustomerPayload {
	shopId: string;
	name: string;
	phone?: string;
	email?: string;
	address?: string;
	groupId?: string;
	birthday?: string;
	referredById?: string;
}

export interface ReceivableEntry {
	id: string;
	customerId: string;
	currency: string;
	debit: number;
	credit: number;
	balanceAfter: number;
	sourceType: string;
	sourceId: string;
	note?: string | null;
	createdAt: string;
}

export interface CustomerStatement {
	customer: Customer;
	balances: Record<string, number>;
	entries: ReceivableEntry[];
}

export interface CustomerNote {
	id: string;
	customerId: string;
	note: string;
	createdById?: string | null;
	createdAt: string;
}

export interface FollowUp {
	id: string;
	customerId: string;
	dueDate: string;
	note?: string | null;
	isDone: boolean;
	createdById?: string | null;
	createdAt: string;
	customer?: Customer;
}
