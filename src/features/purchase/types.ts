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

export interface Purchase {
	id: string;
	branchId: string;
	supplierId: string;
	status: string;
	subTotal: number;
	totalAmount: number;
	paidAmount?: number | null;
	dueAmount?: number | null;
	createdAt: string;
}
