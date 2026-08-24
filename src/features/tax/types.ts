export interface TaxRule {
	id: string;
	shopId: string;
	name: string;
	ratePercent: number;
	countryCode?: string | null;
	categoryId?: string | null;
	category?: { id: string; name: string } | null;
	isDefault: boolean;
	isActive: boolean;
	createdAt: string;
}

export interface CreateTaxRulePayload {
	shopId: string;
	name: string;
	ratePercent: number;
	countryCode?: string;
	categoryId?: string;
	isDefault?: boolean;
}

export interface UpdateTaxRulePayload {
	name?: string;
	ratePercent?: number;
	countryCode?: string;
	categoryId?: string;
	isDefault?: boolean;
	isActive?: boolean;
}
