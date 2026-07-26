export interface Shop {
	id: string;
	name: string;
	slug?: string;
	address?: string | null;
	bin?: string | null;
	vatNumber?: string | null;
	currency?: string | null;
	timezone?: string | null;
	createdAt: string;
}

export interface ShopPayload {
	name: string;
	address?: string;
	bin?: string;
	vatNumber?: string;
	currency?: string;
	timezone?: string;
	slug?: string;
}
