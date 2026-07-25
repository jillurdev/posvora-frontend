export interface Organization {
	id: string;
	name: string;
	businessType: string;
	email?: string | null;
	phone?: string | null;
	address?: string | null;
	logoUrl?: string | null;
	createdAt: string;
}

export interface UpdateOrganizationPayload {
	name?: string;
	email?: string;
	phone?: string;
	address?: string;
	logoUrl?: string;
}
