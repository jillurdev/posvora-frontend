import { httpClient } from "@/services/httpClient";
import type { Account, DailyClosing, Expense, ExpenseCategory, ProfitAndLoss, TrialBalance } from "./types";

export const accountingApi = {
	listAccounts: (shopId: string) => httpClient.get<Account[]>("/accounting/accounts", { shopId }),
	createAccount: (payload: { shopId: string; code: string; name: string; type: string; parentId?: string }) =>
		httpClient.post<Account>("/accounting/accounts", payload),
	listExpenseCategories: (shopId: string) =>
		httpClient.get<ExpenseCategory[]>("/accounting/expense-categories", { shopId }),
	createExpenseCategory: (payload: { shopId: string; name: string }) =>
		httpClient.post<ExpenseCategory>("/accounting/expense-categories", payload),
	listExpenses: (params: { branchId?: string; categoryId?: string }) =>
		httpClient.get<Expense[]>("/accounting/expenses", params),
	createExpense: (payload: { branchId: string; categoryId: string; amount: number; frequency?: string; note?: string }) =>
		httpClient.post<Expense>("/accounting/expenses", payload),
	closeDay: (branchId: string, payload: { date: string; openingCash: number; closingCash: number }) =>
		httpClient.post<DailyClosing>(`/accounting/branches/${branchId}/close-day`, payload),
	profitLoss: (branchId: string, params: { from: string; to: string }) =>
		httpClient.get<ProfitAndLoss>(`/accounting/branches/${branchId}/profit-loss`, params),
	trialBalance: (shopId: string) => httpClient.get<TrialBalance>("/accounting/trial-balance", { shopId }),
};
