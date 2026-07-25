export interface Warehouse {
	id: string;
	branchId: string;
	name: string;
	address?: string | null;
	isDefault?: boolean;
	createdAt: string;
}

export interface WarehousePayload {
	branchId: string;
	name: string;
	address?: string;
	isDefault?: boolean;
}
