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
