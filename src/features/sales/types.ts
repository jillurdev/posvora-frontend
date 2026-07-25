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

export interface SalePaymentPayload {
	method: "CASH" | "CARD" | "MOBILE_BANKING" | "BANK_TRANSFER" | "CREDIT" | "CHEQUE";
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
	customerId?: string | null;
	status: string;
	subTotal: number;
	discountAmount?: number | null;
	vatAmount?: number | null;
	totalAmount: number;
	paidAmount?: number | null;
	dueAmount?: number | null;
	createdAt: string;
}
