"use client";

import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useSales } from "@/features/sales/hooks/useSales";
import type { Sale } from "@/features/sales/types";
import { formatMoney, formatDateTime } from "@/lib/utils";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "default"> = {
	COMPLETED: "success",
	HELD: "warning",
	RETURNED: "danger",
	PARTIALLY_RETURNED: "warning",
};

export default function SalesPage() {
	const { data: branches = [] } = useBranches();
	const branchId = branches[0]?.id ?? "";
	const { data, isLoading } = useSales(branchId);

	if (branches.length === 0) {
		return <EmptyState icon={ShoppingCart} title="Create a branch first" description="Sales are recorded per branch." />;
	}

	const columns: Column<Sale>[] = [
		{ header: "Date", accessor: s => formatDateTime(s.createdAt) },
		{ header: "Total", accessor: s => formatMoney(s.totalAmount) },
		{ header: "Paid", accessor: s => (s.paidAmount != null ? formatMoney(s.paidAmount) : "—") },
		{ header: "Due", accessor: s => (s.dueAmount ? formatMoney(s.dueAmount) : "—") },
		{ header: "Status", accessor: s => <Badge tone={STATUS_TONE[s.status] ?? "default"}>{s.status}</Badge> },
	];

	return (
		<div>
			<PageHeader title="Sales" description="Transaction history for your default branch." />
			<div className="mb-4 rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
				This lists sales fetched from <code>/sales</code>. A full POS checkout screen (cart, barcode scan, split
				payments) can be built on top of the <code>useCreateSale</code> hook already wired to <code>POST /sales</code>.
			</div>
			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No sales yet" />
		</div>
	);
}
