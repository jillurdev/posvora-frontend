export interface Branch {
	id: string;
	shopId: string;
	name: string;
	code?: string | null;
	address?: string | null;
	phone?: string | null;
	createdAt: string;
}

export interface BranchPayload {
	shopId: string;
	name: string;
	code?: string;
	address?: string;
	phone?: string;
}
