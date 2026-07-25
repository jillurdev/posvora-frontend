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
