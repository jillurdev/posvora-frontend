"use client";

import { useMemo, useState } from "react";
import { Plus, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import {
	useAccounts,
	useExpenseCategories,
	useExpenses,
	useCreateExpense,
	useTrialBalance,
	useProfitLoss,
	useCloseDay,
} from "@/features/accounting/hooks/useAccounting";
import type { Account, Expense, TrialBalanceRow } from "@/features/accounting/types";
import { formatDate } from "@/lib/utils";
import { useFormatMoney } from "@/hooks/useCurrency";

function todayIso() {
	return new Date().toISOString().slice(0, 10);
}

function firstOfMonthIso() {
	const d = new Date();
	return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

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
				description="Chart of accounts, expenses, reports and day closing."
				action={<Button onClick={() => setModalOpen(true)} disabled={!branches[0]}><Plus className="h-4 w-4" /> Record expense</Button>}
			/>

			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
					<TabsTrigger value="profit-loss">Profit &amp; Loss</TabsTrigger>
					<TabsTrigger value="day-close">Day Close</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div>
						<h2 className="mb-3 text-sm font-semibold text-slate-700">Recent expenses</h2>
						<DataTable columns={expenseColumns} data={expenses} isLoading={isLoading} rowKey={e => e.id} emptyTitle="No expenses recorded" />
					</div>

					<div>
						<h2 className="mb-3 text-sm font-semibold text-slate-700">Chart of accounts</h2>
						<DataTable columns={accountColumns} data={accounts} rowKey={a => a.id} emptyTitle="No accounts set up yet" />
					</div>
				</TabsContent>

				<TabsContent value="trial-balance">
					<TrialBalanceTab shopId={activeShopId ?? undefined} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="profit-loss">
					<ProfitLossTab branchId={branches[0]?.id} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="day-close">
					<DayCloseTab branchId={branches[0]?.id} formatMoney={formatMoney} />
				</TabsContent>
			</Tabs>

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

function TrialBalanceTab({ shopId, formatMoney }: { shopId?: string; formatMoney: (n: number | string) => string }) {
	const { data, isLoading } = useTrialBalance(shopId);

	const columns: Column<TrialBalanceRow>[] = [
		{ header: "Code", accessor: r => r.code },
		{ header: "Account", accessor: r => r.name },
		{ header: "Type", accessor: r => r.type },
		{ header: "Debit", accessor: r => formatMoney(r.totalDebit) },
		{ header: "Credit", accessor: r => formatMoney(r.totalCredit) },
		{ header: "Balance", accessor: r => formatMoney(r.balance) },
	];

	if (!shopId) return <EmptyState icon={Wallet} title="Select a shop" description="Trial balance is scoped to a shop." />;

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-sm font-semibold text-slate-700">Trial balance</h2>
				{data && (
					data.isBalanced ? (
						<Badge tone="success"><CheckCircle2 className="mr-1 inline h-3 w-3" /> Balanced</Badge>
					) : (
						<Badge tone="danger"><AlertTriangle className="mr-1 inline h-3 w-3" /> Out of balance</Badge>
					)
				)}
			</div>
			<DataTable columns={columns} data={data?.accounts ?? []} isLoading={isLoading} rowKey={r => r.accountId} emptyTitle="No ledger activity yet" />
		</div>
	);
}

function ProfitLossTab({ branchId, formatMoney }: { branchId?: string; formatMoney: (n: number | string) => string }) {
	const [from, setFrom] = useState(firstOfMonthIso());
	const [to, setTo] = useState(todayIso());
	const params = useMemo(() => ({ from, to }), [from, to]);
	const { data, isLoading } = useProfitLoss(branchId, params);

	if (!branchId) return <EmptyState icon={Wallet} title="Create a branch first" description="Profit & loss is scoped to a branch." />;

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-end gap-3">
				<TextField id="pl-from" label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} />
				<TextField id="pl-to" label="To" type="date" value={to} onChange={e => setTo(e.target.value)} />
			</div>

			{isLoading ? (
				<p className="text-sm text-slate-400">Calculating…</p>
			) : data ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<SummaryCard label="Revenue" value={formatMoney(data.revenue)} />
					<SummaryCard label="Cost of goods sold" value={formatMoney(data.costOfGoodsSold)} />
					<SummaryCard label="Expenses" value={formatMoney(data.expenses)} />
					<SummaryCard label="Gross profit" value={formatMoney(data.grossProfit)} highlight />
					<SummaryCard label="Net profit" value={formatMoney(data.netProfit)} highlight tone={data.netProfit >= 0 ? "success" : "danger"} />
				</div>
			) : (
				<EmptyState title="No data" description="No sales or expenses in this range." />
			)}
		</div>
	);
}

function SummaryCard({
	label,
	value,
	highlight,
	tone = "default",
}: {
	label: string;
	value: string;
	highlight?: boolean;
	tone?: "default" | "success" | "danger";
}) {
	const toneClass = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-red-600" : "text-slate-900";
	return (
		<div className={`rounded-xl border p-4 ${highlight ? "border-slate-300 bg-slate-50" : "border-slate-200"}`}>
			<p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
			<p className={`mt-1 text-lg font-semibold ${toneClass}`}>{value}</p>
		</div>
	);
}

function DayCloseTab({ branchId, formatMoney }: { branchId?: string; formatMoney: (n: number | string) => string }) {
	const [date, setDate] = useState(todayIso());
	const [openingCash, setOpeningCash] = useState("");
	const [closingCash, setClosingCash] = useState("");
	const closeDay = useCloseDay();

	if (!branchId) return <EmptyState icon={Wallet} title="Create a branch first" description="Day close is scoped to a branch." />;

	const handleClose = () => {
		closeDay.mutate(
			{ branchId, payload: { date, openingCash: Number(openingCash), closingCash: Number(closingCash) } },
			{ onSuccess: () => { setOpeningCash(""); setClosingCash(""); } },
		);
	};

	const result = closeDay.data;

	return (
		<div className="max-w-lg space-y-4">
			<h2 className="text-sm font-semibold text-slate-700">Close a day</h2>
			<TextField id="close-date" label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
			<TextField
				id="close-opening"
				label="Opening cash"
				type="number"
				step="0.01"
				value={openingCash}
				onChange={e => setOpeningCash(e.target.value)}
			/>
			<TextField
				id="close-closing"
				label="Closing cash"
				type="number"
				step="0.01"
				value={closingCash}
				onChange={e => setClosingCash(e.target.value)}
			/>
			<Button onClick={handleClose} isLoading={closeDay.isPending} disabled={!openingCash || !closingCash}>
				Close day
			</Button>

			{result && (
				<div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 p-4 text-sm">
					<div>
						<p className="text-xs text-slate-500">Total sales</p>
						<p className="font-medium">{formatMoney(result.totalSales)}</p>
					</div>
					<div>
						<p className="text-xs text-slate-500">Total expense</p>
						<p className="font-medium">{formatMoney(result.totalExpense)}</p>
					</div>
					<div>
						<p className="text-xs text-slate-500">Opening cash</p>
						<p className="font-medium">{formatMoney(result.openingCash)}</p>
					</div>
					<div>
						<p className="text-xs text-slate-500">Closing cash</p>
						<p className="font-medium">{formatMoney(result.closingCash)}</p>
					</div>
				</div>
			)}
		</div>
	);
}
