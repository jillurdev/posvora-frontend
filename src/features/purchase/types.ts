export interface PurchaseItemPayload {
	productId: string;
	variantId?: string;
	quantity: number;
	unitCost: number;
}

export interface CreatePurchasePayload {
	branchId: string;
	supplierId: string;
	items: PurchaseItemPayload[];
	discountAmount?: number;
	vatAmount?: number;
	note?: string;
}

export type PurchaseStatus = "REQUESTED" | "ORDERED" | "PARTIALLY_RECEIVED" | "RECEIVED" | "BILLED" | "RETURNED" | "CANCELLED";

export type PurchasePaymentMethod =
	| "CASH"
	| "BKASH"
	| "NAGAD"
	| "ROCKET"
	| "UPAY"
	| "CARD"
	| "BANK_TRANSFER"
	| "SSLCOMMERZ"
	| "DUE"
	| "LOYALTY_POINT"
	| "OTHER";

export interface PurchaseItem {
	id: string;
	purchaseId: string;
	productId: string;
	variantId?: string | null;
	quantity: number;
	receivedQty: number;
	unitCost: number;
	totalCost: number;
	product?: { id: string; name: string; sku: string } | null;
	variant?: { id: string; sku: string; color?: string | null; size?: string | null; storage?: string | null; ram?: string | null } | null;
}

export interface PurchasePayment {
	id: string;
	method: PurchasePaymentMethod;
	amount: number;
	transactionRef?: string | null;
	createdAt: string;
}

export interface Purchase {
	id: string;
	branchId: string;
	supplierId: string;
	refNo?: string;
	status: PurchaseStatus;
	subtotal: number;
	discountAmount?: number;
	vatAmount?: number;
	totalAmount: number;
	paidAmount?: number | null;
	dueAmount?: number | null;
	note?: string | null;
	createdAt: string;
	supplier?: { id: string; name: string; phone?: string | null } | null;
	items?: PurchaseItem[];
	payments?: PurchasePayment[];
}
