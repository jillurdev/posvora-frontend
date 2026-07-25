export interface Account {
	id: string;
	shopId: string;
	code: string;
	name: string;
	type: string;
	parentId?: string | null;
}

export interface ExpenseCategory {
	id: string;
	shopId: string;
	name: string;
}

export interface Expense {
	id: string;
	branchId: string;
	categoryId: string;
	amount: number;
	frequency?: string | null;
	note?: string | null;
	createdAt: string;
}
