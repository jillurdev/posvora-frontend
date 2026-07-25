export interface AdminDashboard {
	totalOrganizations: number;
	activeSubscriptions: number;
	openSupportTickets: number;
	revenueThisMonth?: number;
}

export interface AdminOrganization {
	id: string;
	name: string;
	businessType: string;
	isActive: boolean;
	createdAt: string;
}
