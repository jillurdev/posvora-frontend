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
	// Only present on the single-supplier detail endpoint (GET /suppliers/:id).
	purchases?: { id: string; totalAmount: number; createdAt: string; status?: string }[];
}

export interface SupplierPayload {
	shopId: string;
	name: string;
	phone?: string;
	email?: string;
	address?: string;
	groupId?: string;
}

export interface PayableEntry {
	id: string;
	supplierId: string;
	currency: string;
	debit: number;
	credit: number;
	balanceAfter: number;
	sourceType: string;
	sourceId: string;
	note?: string | null;
	createdAt: string;
}

export interface SupplierStatement {
	supplier: Supplier;
	balances: Record<string, number>;
	entries: PayableEntry[];
}
