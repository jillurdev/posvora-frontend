export interface SupplierGroup {
	id: string;
	shopId: string;
	name: string;
	type: string;
}

export interface Supplier {
	id: string;
	shopId: string;
	name: string;
	phone?: string | null;
	email?: string | null;
	address?: string | null;
	groupId?: string | null;
	createdAt: string;
	/**
	 * Ledger-derived outstanding balance per currency (positive = the shop
	 * owes the supplier), computed from PayableEntry — the accounting
	 * source of truth. May contain multiple currencies for multi-currency
	 * shops.
	 */
	balancesByCurrency?: Record<string, number>;
}

export interface SupplierPayload {
	shopId: string;
	name: string;
	phone?: string;
	email?: string;
	address?: string;
	groupId?: string;
}
