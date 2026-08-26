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

export interface TrialBalanceRow {
	accountId: string;
	code: string;
	name: string;
	type: string;
	totalDebit: number;
	totalCredit: number;
	balance: number;
}

export interface TrialBalance {
	accounts: TrialBalanceRow[];
	isBalanced: boolean;
}

export interface ProfitAndLoss {
	revenue: number;
	costOfGoodsSold: number;
	expenses: number;
	grossProfit: number;
	netProfit: number;
}

export interface DailyClosing {
	id: string;
	branchId: string;
	date: string;
	openingCash: number;
	closingCash: number;
	totalSales: number;
	totalExpense: number;
	closedById: string;
}
