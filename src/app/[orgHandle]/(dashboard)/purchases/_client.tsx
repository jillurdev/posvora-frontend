"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { usePurchases } from "@/features/purchase/hooks/usePurchases";
import type { Purchase, PurchaseStatus } from "@/features/purchase/types";
import { formatMoney, formatDateTime } from "@/lib/utils";

const STATUS_TONE: Record<PurchaseStatus, "success" | "warning" | "danger" | "default"> = {
	REQUESTED: "default",
	ORDERED: "warning",
	PARTIALLY_RECEIVED: "warning",
	RECEIVED: "success",
	BILLED: "success",
	RETURNED: "danger",
	CANCELLED: "danger",
};

export default function PurchasesPage() {
	const router = useRouter();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const { data: branches = [] } = useBranches();
	const branchId = branches[0]?.id ?? "";
	const { data, isLoading } = usePurchases(branchId);

	if (branches.length === 0) {
		return <EmptyState icon={ShoppingBag} title="Create a branch first" description="Purchases are recorded per branch." />;
	}

	const columns: Column<Purchase>[] = [
		{ header: "Ref", accessor: p => p.refNo ?? `#${p.id.slice(0, 8)}` },
		{ header: "Date", accessor: p => formatDateTime(p.createdAt) },
		{ header: "Total", accessor: p => formatMoney(p.totalAmount) },
		{ header: "Paid", accessor: p => (p.paidAmount != null ? formatMoney(p.paidAmount) : "—") },
		{ header: "Due", accessor: p => (p.dueAmount ? formatMoney(p.dueAmount) : "—") },
		{ header: "Status", accessor: p => <Badge tone={STATUS_TONE[p.status] ?? "default"}>{p.status.replace(/_/g, " ")}</Badge> },
	];

	return (
		<div>
			<PageHeader
				title="Purchases"
				description="Purchase orders for your default branch."
				action={
					<Button onClick={() => router.push(`/${orgHandle}/purchases/new`)}>
						<Plus className="h-4 w-4" />
						New purchase order
					</Button>
				}
			/>
			<DataTable
				columns={columns}
				data={data?.data ?? []}
				isLoading={isLoading}
				rowKey={p => p.id}
				emptyTitle="No purchases yet"
				onRowClick={p => router.push(`/${orgHandle}/purchases/${p.id}`)}
			/>
		</div>
	);
}

