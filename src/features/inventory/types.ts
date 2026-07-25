export interface StockItem {
	id: string;
	warehouseId: string;
	productId: string;
	variantId?: string | null;
	quantity: number;
	product?: { name: string; sku: string };
	warehouse?: { name: string };
}

export interface StockMovement {
	id: string;
	type: string;
	quantity: number;
	warehouseId: string;
	productId: string;
	note?: string | null;
	createdAt: string;
}

export interface StockInPayload {
	warehouseId: string;
	productId: string;
	variantId?: string;
	quantity: number;
	batchNo?: string;
	expiryDate?: string;
	note?: string;
}

export interface StockOutPayload {
	warehouseId: string;
	productId: string;
	variantId?: string;
	quantity: number;
	note?: string;
}

export interface StockTransferPayload {
	fromWarehouseId: string;
	toWarehouseId: string;
	productId: string;
	variantId?: string;
	quantity: number;
	note?: string;
}
