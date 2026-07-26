"use client";

import { ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { usePurchases } from "@/features/purchase/hooks/usePurchases";
import type { Purchase } from "@/features/purchase/types";
import { formatMoney, formatDateTime } from "@/lib/utils";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "default"> = {
	RECEIVED: "success",
	PENDING: "warning",
	PARTIALLY_RECEIVED: "warning",
	CANCELLED: "danger",
};

export default function PurchasesPage() {
	const { data: branches = [] } = useBranches();
	const branchId = branches[0]?.id ?? "";
	const { data, isLoading } = usePurchases(branchId);

	if (branches.length === 0) {
		return <EmptyState icon={ShoppingBag} title="Create a branch first" description="Purchases are recorded per branch." />;
	}

	const columns: Column<Purchase>[] = [
		{ header: "Date", accessor: p => formatDateTime(p.createdAt) },
		{ header: "Total", accessor: p => formatMoney(p.totalAmount) },
		{ header: "Paid", accessor: p => (p.paidAmount != null ? formatMoney(p.paidAmount) : "—") },
		{ header: "Due", accessor: p => (p.dueAmount ? formatMoney(p.dueAmount) : "—") },
		{ header: "Status", accessor: p => <Badge tone={STATUS_TONE[p.status] ?? "default"}>{p.status}</Badge> },
	];

	return (
		<div>
			<PageHeader title="Purchases" description="Purchase orders for your default branch." />
			<div className="mb-4 rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
				This lists purchases fetched from <code>/purchases</code>. A dedicated purchase-order and goods-receiving
				screen can be built on the already-wired <code>useCreatePurchase</code> / <code>receive</code> hooks.
			</div>
			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={p => p.id} emptyTitle="No purchases yet" />
		</div>
	);
}
