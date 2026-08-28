"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Download, PlayCircle, Plus, ShoppingCart } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { usePagination } from "@/hooks/usePagination";
import { useSales, useOpenReceipt } from "@/features/sales/hooks/useSales";
import type { Sale } from "@/features/sales/types";
import { formatDateTime } from "@/lib/utils";
import { useFormatMoney } from "@/hooks/useCurrency";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "default"> = {
	COMPLETED: "success",
	PAID: "success",
	PARTIALLY_PAID: "warning",
	HELD: "warning",
	DUE: "warning",
	RETURNED: "danger",
	CANCELLED: "danger",
};

export default function SalesPage() {
	const formatMoney = useFormatMoney();
	const router = useRouter();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const { activeShopId, shops } = useActiveShop();
	const { data: allBranches = [] } = useBranches();
	const branches = useMemo(() => allBranches.filter(b => b.shopId === activeShopId), [allBranches, activeShopId]);

	const [branchId, setBranchId] = useState("");
	const effectiveBranchId = branchId || branches[0]?.id || "";

	const { page, limit, setPage } = usePagination(15);
	const { data, isLoading } = useSales(effectiveBranchId, { page, limit });
	const openReceipt = useOpenReceipt();

	if (shops.length === 0) {
		return <EmptyState icon={ShoppingCart} title="Create a shop first" description="Add a shop to start recording sales." />;
	}
	if (branches.length === 0) {
		return <EmptyState icon={ShoppingCart} title="Create a branch first" description="You need a branch to record sales." />;
	}

	const columns: Column<Sale>[] = [
		{ header: "Invoice", accessor: s => <span className="font-medium text-slate-900">{s.invoiceNo}</span> },
		{ header: "Date", accessor: s => formatDateTime(s.createdAt) },
		{ header: "Customer", accessor: s => s.customer?.name ?? "Walk-in" },
		{ header: "Total", accessor: s => formatMoney(s.totalAmount) },
		{
			header: "Due",
			accessor: s => (Number(s.dueAmount ?? 0) > 0 ? <span className="text-amber-600">{formatMoney(s.dueAmount ?? 0)}</span> : "—"),
		},
		{
			header: "Status",
			accessor: s => (
				<Badge tone={STATUS_TONE[s.isHeld ? "HELD" : s.status] ?? "default"}>{s.isHeld ? "HELD" : s.status}</Badge>
			),
		},
		{
			header: "",
			accessor: s => (
				<div className="flex items-center gap-1">
					{s.isHeld ? (
						<button
							onClick={e => {
								e.stopPropagation();
								router.push(`/${orgHandle}/sales/pos?resume=${s.id}`);
							}}
							className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
							title="Resume held sale"
						>
							<PlayCircle className="h-4 w-4" /> Resume
						</button>
					) : (
						<button
							onClick={e => {
								e.stopPropagation();
								openReceipt.mutate(s.id);
							}}
							className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
							title="Download receipt"
						>
							<Download className="h-4 w-4" /> Receipt
						</button>
					)}
				</div>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Sales"
				description="Every sale recorded at this branch, with downloadable receipts."
				action={
					<Button onClick={() => router.push(`/${orgHandle}/sales/pos`)}>
						<Plus className="h-4 w-4" /> New sale
					</Button>
				}
			/>

			<div className="mb-4 max-w-xs">
				<Select value={effectiveBranchId} onChange={e => setBranchId(e.target.value)}>
					{branches.map(b => (
						<option key={b.id} value={b.id}>
							{b.name}
						</option>
					))}
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={data?.data ?? []}
				isLoading={isLoading}
				rowKey={s => s.id}
				emptyTitle="No sales yet"
				onRowClick={s => router.push(`/${orgHandle}/sales/${s.id}`)}
			/>
			{data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
		</div>
	);
}
