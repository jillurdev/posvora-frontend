export interface SaleItemPayload {
	productId: string;
	variantId?: string;
	quantity: number;
	unitPrice: number;
	discountAmount?: number;
	vatAmount?: number;
	warehouseId?: string;
	serialNo?: string;
	imei?: string;
}

export type SalePaymentMethod =
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

export interface SalePaymentPayload {
	method: SalePaymentMethod;
	amount: number;
	transactionRef?: string;
}

export interface CreateSalePayload {
	branchId: string;
	warehouseId: string;
	customerId?: string;
	items: SaleItemPayload[];
	discountAmount?: number;
	couponCode?: string;
	vatPercent?: number;
	payments?: SalePaymentPayload[];
	note?: string;
	holdSale?: boolean;
}

export interface Sale {
	id: string;
	branchId: string;
	warehouseId?: string;
	customerId?: string | null;
	customer?: { id: string; name: string; phone?: string | null } | null;
	invoiceNo: string;
	status: string;
	isHeld?: boolean;
	subtotal: number;
	discountAmount?: number | null;
	vatAmount?: number | null;
	totalAmount: number;
	paidAmount?: number | null;
	dueAmount?: number | null;
	note?: string | null;
	createdAt: string;
	items?: Array<{
		id: string;
		productId: string;
		variantId?: string | null;
		quantity: number;
		unitPrice: number;
		discountAmount?: number | null;
		product?: { name: string; sku: string };
		variant?: { sku: string } | null;
	}>;
}
