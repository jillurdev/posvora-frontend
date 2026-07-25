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
}

export interface SupplierPayload {
	shopId: string;
	name: string;
	phone?: string;
	email?: string;
	address?: string;
	groupId?: string;
}
