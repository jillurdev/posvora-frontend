"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useWarehouses } from "@/features/warehouse/hooks/useWarehouses";
import { useStock, useLowStock, useStockIn } from "@/features/inventory/hooks/useInventory";
import { useProducts } from "@/features/product/hooks/useProducts";
import type { StockItem } from "@/features/inventory/types";
import type { Product } from "@/features/product/types";

export default function InventoryPage() {
	const { activeShopId } = useActiveShop();
	const { data: allBranches = [] } = useBranches();
	const branches = allBranches.filter(b => b.shopId === activeShopId);
	const [branchId, setBranchId] = useState<string>("");

	const effectiveBranchId = branchId || branches[0]?.id || "";
	const { data: allWarehouses = [] } = useWarehouses();
	const branchWarehouses = allWarehouses.filter(w => w.branchId === effectiveBranchId);

	const { data: stock = [], isLoading } = useStock({ branchId: effectiveBranchId || undefined });
	const { data: lowStock = [] } = useLowStock({ branchId: effectiveBranchId || undefined });

	const [addStockOpen, setAddStockOpen] = useState(false);

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
					<div className="flex items-center gap-2">
						<Select value={branchId} onChange={e => setBranchId(e.target.value)} className="w-48">
							{branches.map(b => (
								<option key={b.id} value={b.id}>{b.name}</option>
							))}
						</Select>
						<Button onClick={() => setAddStockOpen(true)}>
							<Plus className="h-4 w-4" /> Add stock
						</Button>
					</div>
				}
			/>

			{lowStock.length > 0 && (
				<div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
					<AlertTriangle className="h-4 w-4" />
					{lowStock.length} product{lowStock.length > 1 ? "s are" : " is"} below its stock alert threshold.
				</div>
			)}

			<DataTable columns={columns} data={stock} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No stock recorded yet" />

			<AddStockModal
				open={addStockOpen}
				onClose={() => setAddStockOpen(false)}
				warehouses={branchWarehouses}
			/>
		</div>
	);
}

function AddStockModal({
	open,
	onClose,
	warehouses,
}: {
	open: boolean;
	onClose: () => void;
	warehouses: { id: string; name: string }[];
}) {
	const { activeShopId } = useActiveShop();
	const [search, setSearch] = useState("");
	const [product, setProduct] = useState<Product | null>(null);
	const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
	const [quantity, setQuantity] = useState<number | "">("");
	const [note, setNote] = useState("");

	const { data: productsPage, isFetching } = useProducts({ shopId: activeShopId ?? "", search: search || undefined, limit: 8 });
	const stockIn = useStockIn();

	const reset = () => {
		setSearch("");
		setProduct(null);
		setQuantity("");
		setNote("");
	};

	const submit = () => {
		if (!product || !warehouseId || !quantity || Number(quantity) <= 0) return;
		stockIn.mutate(
			{ warehouseId, productId: product.id, quantity: Number(quantity), note: note || undefined },
			{
				onSuccess: () => {
					reset();
					onClose();
				},
			},
		);
	};

	return (
		<Modal open={open} onClose={() => { reset(); onClose(); }} title="Add stock" size="sm">
			<div className="space-y-4">
				<div>
					<label className="mb-1.5 block text-xs font-medium text-slate-500">Product</label>
					{product ? (
						<div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
							<span>
								<span className="font-medium text-slate-900">{product.name}</span>{" "}
								<span className="text-slate-400">({product.sku})</span>
							</span>
							<button onClick={() => setProduct(null)} className="text-xs text-slate-400 hover:text-slate-600">
								Change
							</button>
						</div>
					) : (
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="pl-9" />
							{search && (
								<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
									{isFetching && <p className="p-2 text-xs text-slate-400">Searching...</p>}
									{!isFetching && (productsPage?.data ?? []).length === 0 && (
										<p className="p-2 text-xs text-slate-400">No products found.</p>
									)}
									{(productsPage?.data ?? []).map(p => (
										<button
											key={p.id}
											onClick={() => { setProduct(p); setSearch(""); }}
											className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
										>
											<span>{p.name}</span>
											<span className="text-xs text-slate-400">{p.sku}</span>
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				<div>
					<label className="mb-1.5 block text-xs font-medium text-slate-500">Warehouse</label>
					<Select value={warehouseId} onChange={e => setWarehouseId(e.target.value)}>
						{warehouses.length === 0 && <option value="">No warehouse in this branch</option>}
						{warehouses.map(w => (
							<option key={w.id} value={w.id}>{w.name}</option>
						))}
					</Select>
				</div>

				<div>
					<label className="mb-1.5 block text-xs font-medium text-slate-500">Quantity to add</label>
					<Input
						type="number"
						min={0.01}
						step="0.01"
						value={quantity}
						onChange={e => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
						placeholder="e.g. 50"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-xs font-medium text-slate-500">Note (optional)</label>
					<Input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Opening stock" />
				</div>

				<Button className="w-full" isLoading={stockIn.isPending} disabled={!product || !warehouseId || !quantity} onClick={submit}>
					Add stock
				</Button>
			</div>
		</Modal>
	);
}
