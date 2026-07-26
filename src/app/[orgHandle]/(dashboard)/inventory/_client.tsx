"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useWarehouses } from "@/features/warehouse/hooks/useWarehouses";
import { useStock, useLowStock } from "@/features/inventory/hooks/useInventory";
import type { StockItem } from "@/features/inventory/types";

export default function InventoryPage() {
	const { data: branches = [] } = useBranches();
	const { data: warehouses = [] } = useWarehouses();
	const [branchId, setBranchId] = useState<string>("");

	const effectiveBranchId = branchId || branches[0]?.id || "";
	const branchWarehouses = warehouses.filter(w => w.branchId === effectiveBranchId);

	const { data: stock = [], isLoading } = useStock({ branchId: effectiveBranchId || undefined });
	const { data: lowStock = [] } = useLowStock({ branchId: effectiveBranchId || undefined });

	if (branches.length === 0) {
		return <EmptyState icon={AlertTriangle} title="Create a branch first" description="Inventory is tracked per branch and warehouse." />;
	}

	const columns: Column<StockItem>[] = [
		{ header: "Product", accessor: s => s.product?.name ?? s.productId },
		{ header: "SKU", accessor: s => s.product?.sku ?? "—" },
		{ header: "Warehouse", accessor: s => s.warehouse?.name ?? branchWarehouses.find(w => w.id === s.warehouseId)?.name ?? "—" },
		{ header: "Quantity", accessor: s => <span className="font-medium">{s.quantity}</span> },
	];

	return (
		<div>
			<PageHeader
				title="Inventory"
				description="Live stock levels across your warehouses."
				action={
					<Select value={branchId} onChange={e => setBranchId(e.target.value)} className="w-48">
						{branches.map(b => (
							<option key={b.id} value={b.id}>{b.name}</option>
						))}
					</Select>
				}
			/>

			{lowStock.length > 0 && (
				<div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
					<AlertTriangle className="h-4 w-4" />
					{lowStock.length} product{lowStock.length > 1 ? "s are" : " is"} below its stock alert threshold.
				</div>
			)}

			<DataTable columns={columns} data={stock} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No stock recorded yet" />
		</div>
	);
}
