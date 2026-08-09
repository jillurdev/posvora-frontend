"use client";

import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useAccounts, useExpenseCategories, useExpenses, useCreateExpense } from "@/features/accounting/hooks/useAccounting";
import type { Account, Expense } from "@/features/accounting/types";
import { formatDate } from "@/lib/utils";
import { useFormatMoney } from "@/hooks/useCurrency";

export default function AccountingPage() {
	const formatMoney = useFormatMoney();
	const { activeShopId, shops } = useActiveShop();
	const { data: branches = [] } = useBranches();
	const { data: accounts = [] } = useAccounts(activeShopId ?? undefined);
	const { data: categories = [] } = useExpenseCategories(activeShopId ?? undefined);
	const { data: expenses = [], isLoading } = useExpenses({ branchId: branches[0]?.id });
	const createExpense = useCreateExpense();

	const [modalOpen, setModalOpen] = useState(false);
	const [categoryId, setCategoryId] = useState("");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");

	if (shops.length === 0) {
		return <EmptyState icon={Wallet} title="Create a shop first" description="Accounting is scoped to a shop." />;
	}

	const handleSubmit = () => {
		if (!branches[0]) return;
		createExpense.mutate(
			{ branchId: branches[0].id, categoryId, amount: Number(amount), note: note || undefined },
			{ onSuccess: () => { setCategoryId(""); setAmount(""); setNote(""); setModalOpen(false); } },
		);
	};

	const expenseColumns: Column<Expense>[] = [
		{ header: "Date", accessor: e => formatDate(e.createdAt) },
		{ header: "Category", accessor: e => categories.find(c => c.id === e.categoryId)?.name ?? "—" },
		{ header: "Amount", accessor: e => formatMoney(e.amount) },
		{ header: "Note", accessor: e => e.note ?? "—" },
	];

	const accountColumns: Column<Account>[] = [
		{ header: "Code", accessor: a => a.code },
		{ header: "Name", accessor: a => a.name },
		{ header: "Type", accessor: a => a.type },
	];

	return (
		<div>
			<PageHeader
				title="Accounting"
				description="Chart of accounts, expenses and day closing."
				action={<Button onClick={() => setModalOpen(true)} disabled={!branches[0]}><Plus className="h-4 w-4" /> Record expense</Button>}
			/>

			<div className="mb-8">
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Recent expenses</h2>
				<DataTable columns={expenseColumns} data={expenses} isLoading={isLoading} rowKey={e => e.id} emptyTitle="No expenses recorded" />
			</div>

			<div>
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Chart of accounts</h2>
				<DataTable columns={accountColumns} data={accounts} rowKey={a => a.id} emptyTitle="No accounts set up yet" />
			</div>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record expense">
				<div className="space-y-4">
					<SelectField id="expense-category" label="Category" required value={categoryId} onChange={e => setCategoryId(e.target.value)}>
						<option value="" disabled>Select category</option>
						{categories.map(c => (
							<option key={c.id} value={c.id}>{c.name}</option>
						))}
					</SelectField>
					<TextField
						id="expense-amount"
						label="Amount"
						required
						type="number"
						step="0.01"
						value={amount}
						onChange={e => setAmount(e.target.value)}
					/>
					<TextField id="expense-note" label="Note" value={note} onChange={e => setNote(e.target.value)} />
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button onClick={handleSubmit} isLoading={createExpense.isPending} disabled={!categoryId || !amount}>Save</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
