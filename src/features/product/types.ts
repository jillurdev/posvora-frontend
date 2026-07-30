export interface Category {
	id: string;
	shopId: string;
	name: string;
	parentId?: string | null;
}

export interface Brand {
	id: string;
	shopId: string;
	name: string;
}

export interface Unit {
	id: string;
	shopId: string;
	name: string;
	shortName: string;
	baseUnitId?: string | null;
	conversionFactor?: number | null;
}

export interface ProductVariant {
	id?: string;
	sku: string;
	barcode?: string;
	color?: string;
	size?: string;
	storage?: string;
	ram?: string;
	costPrice?: number;
	sellingPrice?: number;
}

export interface Product {
	id: string;
	shopId: string;
	name: string;
	sku: string;
	barcode?: string | null;
	categoryId?: string | null;
	brandId?: string | null;
	unitId?: string | null;
	category?: { id: string; name: string } | null;
	brand?: { id: string; name: string } | null;
	unit?: { id: string; name: string; shortName: string } | null;
	description?: string | null;
	costPrice?: number | null;
	sellingPrice?: number | null;
	wholesalePrice?: number | null;
	dealerPrice?: number | null;
	corporatePrice?: number | null;
	trackSerial?: boolean;
	trackImei?: boolean;
	trackBatch?: boolean;
	trackExpiry?: boolean;
	stockAlertQty?: number | null;
	variants?: ProductVariant[];
	createdAt: string;
}

export interface CreateProductPayload {
	shopId: string;
	name: string;
	sku: string;
	barcode?: string;
	categoryId?: string;
	brandId?: string;
	unitId?: string;
	description?: string;
	costPrice?: number;
	sellingPrice?: number;
	wholesalePrice?: number;
	dealerPrice?: number;
	corporatePrice?: number;
	trackSerial?: boolean;
	trackImei?: boolean;
	trackBatch?: boolean;
	trackExpiry?: boolean;
	stockAlertQty?: number;
	variants?: ProductVariant[];
	openingQuantity?: number;
	openingWarehouseId?: string;
}

export interface ListProductsQuery {
	shopId: string;
	search?: string;
	categoryId?: string;
	brandId?: string;
	page?: number;
	limit?: number;
}
