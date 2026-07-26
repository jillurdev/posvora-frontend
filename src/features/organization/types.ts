export interface Organization {
	id: string;
	name: string;
	handle?: string | null;
	businessType: string;
	email?: string | null;
	phone?: string | null;
	address?: string | null;
	logoUrl?: string | null;
	isActive?: boolean;
	createdAt: string;
}

export interface UpdateOrganizationPayload {
	name?: string;
	handle?: string;
	email?: string;
	phone?: string;
	address?: string;
	logoUrl?: string;
}

export interface DashboardSummary {
	products: number;
	customers: number;
	salesToday: number;
	revenueThisMonth: number;
}
