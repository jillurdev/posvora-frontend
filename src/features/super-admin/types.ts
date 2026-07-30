export interface AdminDashboard {
	totalOrganizations: number;
	shops: number;
	activeSubscriptions: number;
	openSupportTickets: number;
	revenueThisMonth?: number;
}

export interface AdminOrgOwner {
	id: string;
	name: string;
	email: string | null;
	phone?: string | null;
	lastLoginAt?: string | null;
}

export interface AdminPlanSummary {
	id: string;
	name: string;
	slug: string;
	price: string | number;
	billingCycle: string;
}

export interface AdminSubscriptionSummary {
	id: string;
	status: string;
	trialEndsAt?: string | null;
	currentStart: string;
	currentEnd?: string | null;
	autoRenew: boolean;
	plan: AdminPlanSummary;
}

export interface AdminShopSummary {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

export interface AdminOrganization {
	id: string;
	name: string;
	businessType: string;
	isActive: boolean;
	createdAt: string;
	owner?: AdminOrgOwner;
	shops?: AdminShopSummary[];
	subscription?: AdminSubscriptionSummary | null;
}

export interface AdminOrganizationDetail extends AdminOrganization {
	_count?: { users: number; supportTickets: number };
}

export interface Plan {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	price: string | number;
	billingCycle: "MONTHLY" | "YEARLY";
	trialDays: number;
	branchLimit: number;
	userLimit: number;
	storageLimitMb: number;
	apiLimitPerDay: number;
	isActive: boolean;
	isPublic: boolean;
	createdAt: string;
	_count?: { subscriptions: number };
}

export interface CreatePlanPayload {
	name: string;
	slug: string;
	description?: string;
	price: number;
	billingCycle: "MONTHLY" | "YEARLY";
	trialDays?: number;
	branchLimit?: number;
	userLimit?: number;
	storageLimitMb?: number;
	apiLimitPerDay?: number;
	isPublic?: boolean;
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>;

export interface PlatformAdmin {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	role: "OWNER" | "ADMIN" | "SUPPORT";
	isActive: boolean;
	lastLoginAt?: string | null;
	createdAt: string;
}

export type KycDocumentType = "NID" | "PASSPORT" | "TRADE_LICENSE";
export type KycReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface KycDocument {
	id: string;
	organizationId: string;
	type: KycDocumentType;
	fileUrl: string;
	status: KycReviewStatus;
	rejectionReason?: string | null;
	reviewedById?: string | null;
	reviewedAt?: string | null;
	createdAt: string;
	organization?: { id: string; name: string; handle: string | null };
	submittedBy?: { id: string; name: string; email: string };
}

export interface CreatePlatformAdminPayload {
	name: string;
	email: string;
	phone?: string;
	password: string;
	role?: "ADMIN" | "SUPPORT";
}

export interface AssignSubscriptionPayload {
	planId: string;
	status?: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED";
	currentEnd?: string;
}
