"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSupplier, useSupplierStatement } from "@/features/supplier/hooks/useSuppliers";
import type { PayableEntry } from "@/features/supplier/types";
import { formatDate } from "@/lib/utils";
import { useFormatMoney } from "@/hooks/useCurrency";

export default function SupplierDetailPage() {
	const router = useRouter();
	const { orgHandle, id } = useParams<{ orgHandle: string; id: string }>();
	const formatMoney = useFormatMoney();

	const { data: supplier, isLoading, isError } = useSupplier(id);
	const { data: statement, isLoading: statementLoading } = useSupplierStatement(id);

	if (isLoading) return <Spinner />;
	if (isError || !supplier) return <EmptyState title="Supplier not found" description="It may have been removed." />;

	const entryColumns: Column<PayableEntry>[] = [
		{ header: "Date", accessor: e => formatDate(e.createdAt) },
		{ header: "Source", accessor: e => e.sourceType },
		{ header: "Debit", accessor: e => (e.debit ? formatMoney(e.debit) : "—") },
		{ header: "Credit", accessor: e => (e.credit ? formatMoney(e.credit) : "—") },
		{ header: "Balance after", accessor: e => `${formatMoney(e.balanceAfter)} ${e.currency}` },
		{ header: "Note", accessor: e => e.note ?? "—" },
	];

	const purchaseColumns: Column<{ id: string; totalAmount: number; createdAt: string; status?: string }>[] = [
		{ header: "Date", accessor: p => formatDate(p.createdAt) },
		{ header: "Status", accessor: p => p.status ?? "—" },
		{ header: "Total", accessor: p => formatMoney(p.totalAmount) },
	];

	const balances = Object.entries(statement?.balances ?? supplier.balancesByCurrency ?? {}).filter(
		([, amount]) => Math.abs(amount) > 0.005,
	);

	return (
		<div>
			<button
				onClick={() => router.push(`/${orgHandle}/suppliers`)}
				className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
			>
				<ArrowLeft className="h-4 w-4" /> Back to suppliers
			</button>

			<PageHeader
				title={supplier.name}
				description={[supplier.phone, supplier.email, supplier.address].filter(Boolean).join(" · ") || "No contact details"}
			/>

			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-xl border border-slate-200 p-4">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Outstanding balance</p>
					{balances.length === 0 ? (
						<p className="mt-1 text-lg font-semibold text-slate-900">Settled</p>
					) : (
						<div className="mt-1 space-y-0.5">
							{balances.map(([currency, amount]) => (
								<p key={currency} className={`text-lg font-semibold ${amount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
									{amount > 0 ? "+" : ""}
									{amount.toFixed(2)} {currency}
								</p>
							))}
						</div>
					)}
				</div>
				<div className="rounded-xl border border-slate-200 p-4">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Group</p>
					<p className="mt-1 text-lg font-semibold text-slate-900">{supplier.groupId ? "Assigned" : "—"}</p>
				</div>
				<div className="rounded-xl border border-slate-200 p-4">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Supplier since</p>
					<p className="mt-1 text-lg font-semibold text-slate-900">{formatDate(supplier.createdAt)}</p>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Statement (ledger entries)</h2>
				<DataTable
					columns={entryColumns}
					data={statement?.entries ?? []}
					isLoading={statementLoading}
					rowKey={e => e.id}
					emptyTitle="No ledger entries yet"
					emptyDescription="Entries appear here as purchases and payments are recorded."
				/>
			</div>

			<div>
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Recent purchases</h2>
				{supplier.purchases && supplier.purchases.length > 0 ? (
					<DataTable columns={purchaseColumns} data={supplier.purchases} rowKey={p => p.id} emptyTitle="No purchases yet" />
				) : (
					<EmptyState icon={ShoppingBag} title="No purchases yet" />
				)}
			</div>
		</div>
	);
}
