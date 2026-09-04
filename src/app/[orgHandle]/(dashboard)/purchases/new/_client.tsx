"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Minus, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useProducts } from "@/features/product/hooks/useProducts";
import { useSuppliers, useCreateSupplier } from "@/features/supplier/hooks/useSuppliers";
import { useCreatePurchase } from "@/features/purchase/hooks/usePurchases";
import type { Product } from "@/features/product/types";
import { useFormatMoney } from "@/hooks/useCurrency";

interface PurchaseLine {
	key: string;
	productId: string;
	variantId?: string;
	name: string;
	sku: string;
	unitCost: number;
	quantity: number;
}

export default function NewPurchasePage() {
	const formatMoney = useFormatMoney();
	const router = useRouter();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const { activeShopId } = useActiveShop();

	const { data: allBranches = [] } = useBranches();
	const branches = useMemo(() => allBranches.filter(b => b.shopId === activeShopId), [allBranches, activeShopId]);
	const [branchId, setBranchId] = useState<string>("");
	const effectiveBranchId = branchId || branches[0]?.id || "";

	// ── Supplier ──────────────────────────────────────────────
	const [supplierId, setSupplierId] = useState<string>("");
	const [supplierSearch, setSupplierSearch] = useState("");
	const { data: suppliersPage } = useSuppliers(activeShopId ?? "", { search: supplierSearch || undefined, limit: 8 });
	const createSupplier = useCreateSupplier();
	const [showQuickAddSupplier, setShowQuickAddSupplier] = useState(false);
	const [quickSupplierName, setQuickSupplierName] = useState("");

	const handleQuickAddSupplier = () => {
		if (!activeShopId || !quickSupplierName.trim()) return;
		createSupplier.mutate(
			{ shopId: activeShopId, name: quickSupplierName.trim() },
			{
				onSuccess: supplier => {
					setSupplierId(supplier.id);
					setSupplierSearch(supplier.name);
					setShowQuickAddSupplier(false);
					setQuickSupplierName("");
				},
			},
		);
	};

	// ── Product search / line items ──────────────────────────
	const [search, setSearch] = useState("");
	const { data: productsPage, isLoading: productsLoading } = useProducts({
		shopId: activeShopId ?? "",
		search: search || undefined,
		limit: 10,
	});

	const [lines, setLines] = useState<PurchaseLine[]>([]);
	const [discountAmount, setDiscountAmount] = useState(0);
	const [vatAmount, setVatAmount] = useState(0);
	const [note, setNote] = useState("");

	const createPurchase = useCreatePurchase();

	const addLine = (product: Product) => {
		const variant = product.variants?.[0];
		const key = variant?.id ?? product.id;
		const unitCost = variant?.costPrice ?? product.costPrice ?? 0;
		const sku = variant?.sku ?? product.sku;

		setLines(prev => {
			const existing = prev.find(l => l.key === key);
			if (existing) {
				return prev.map(l => (l.key === key ? { ...l, quantity: l.quantity + 1 } : l));
			}
			return [
				...prev,
				{ key, productId: product.id, variantId: variant?.id, name: product.name, sku, unitCost, quantity: 1 },
			];
		});
		setSearch("");
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return;
		const matches = productsPage?.data ?? [];
		if (matches.length === 1) {
			e.preventDefault();
			addLine(matches[0]);
		}
	};

	const updateQuantity = (key: string, quantity: number) => {
		if (quantity <= 0) return removeLine(key);
		setLines(prev => prev.map(l => (l.key === key ? { ...l, quantity } : l)));
	};

	const updateUnitCost = (key: string, unitCost: number) => {
		setLines(prev => prev.map(l => (l.key === key ? { ...l, unitCost } : l)));
	};

	const removeLine = (key: string) => setLines(prev => prev.filter(l => l.key !== key));

	const subtotal = lines.reduce((sum, l) => sum + l.unitCost * l.quantity, 0);
	const total = Math.max(subtotal + vatAmount - discountAmount, 0);

	const submit = () => {
		if (!effectiveBranchId) {
			toast.error("Select a branch first.");
			return;
		}
		if (!supplierId) {
			toast.error("Select or add a supplier first.");
			return;
		}
		if (lines.length === 0) {
			toast.error("Add at least one item to the purchase order.");
			return;
		}
		if (lines.some(l => l.unitCost <= 0)) {
			toast.error("Every item needs a unit cost greater than 0.");
			return;
		}

		createPurchase.mutate(
			{
				branchId: effectiveBranchId,
				supplierId,
				items: lines.map(l => ({
					productId: l.productId,
					variantId: l.variantId,
					quantity: l.quantity,
					unitCost: l.unitCost,
				})),
				discountAmount: discountAmount || undefined,
				vatAmount: vatAmount || undefined,
				note: note || undefined,
			},
			{
				onSuccess: () => router.push(`/${orgHandle}/purchases`),
			},
		);
	};

	return (
		<div className="mx-auto max-w-5xl">
			<PageHeader
				title="New Purchase Order"
				description="Record stock you're buying in from a supplier. You'll mark items as received (and update inventory) separately once they arrive."
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left: branch, supplier, product search, line items */}
				<div className="space-y-4 lg:col-span-2">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1.5 block text-xs font-medium text-slate-500">Branch</label>
							<Select value={effectiveBranchId} onChange={e => setBranchId(e.target.value)}>
								{branches.length === 0 && <option value="">No branches</option>}
								{branches.map(b => (
									<option key={b.id} value={b.id}>
										{b.name}
									</option>
								))}
							</Select>
						</div>

						<div className="relative">
							<label className="mb-1.5 block text-xs font-medium text-slate-500">Supplier</label>
							<Input
								value={supplierSearch}
								onChange={e => {
									setSupplierSearch(e.target.value);
									setSupplierId("");
								}}
								placeholder="Search supplier by name or phone..."
							/>
							{supplierSearch && !supplierId && (
								<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
									{(suppliersPage?.data ?? []).map(s => (
										<button
											key={s.id}
											onClick={() => {
												setSupplierId(s.id);
												setSupplierSearch(s.name);
											}}
											className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50"
										>
											<span className="font-medium text-slate-900">{s.name}</span>
											{s.phone && <span className="text-xs text-slate-400">{s.phone}</span>}
										</button>
									))}
									{(suppliersPage?.data ?? []).length === 0 && !showQuickAddSupplier && (
										<button
											onClick={() => {
												setQuickSupplierName(supplierSearch);
												setShowQuickAddSupplier(true);
											}}
											className="w-full px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-slate-50"
										>
											+ Add "{supplierSearch}" as a new supplier
										</button>
									)}
								</div>
							)}
						</div>
					</div>

					{showQuickAddSupplier && (
						<div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
							<Input
								autoFocus
								value={quickSupplierName}
								onChange={e => setQuickSupplierName(e.target.value)}
								placeholder="Supplier name"
								className="flex-1 bg-white"
							/>
							<Button size="sm" isLoading={createSupplier.isPending} onClick={handleQuickAddSupplier}>
								Add supplier
							</Button>
							<button onClick={() => setShowQuickAddSupplier(false)} className="text-slate-400 hover:text-slate-600">
								<X className="h-4 w-4" />
							</button>
						</div>
					)}

					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={search}
							onChange={e => setSearch(e.target.value)}
							onKeyDown={handleSearchKeyDown}
							placeholder="Search products to add to this purchase order..."
							className="pl-9"
						/>
						{search && (
							<div className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
								{productsLoading && (
									<div className="p-3">
										<Spinner />
									</div>
								)}
								{!productsLoading && (productsPage?.data ?? []).length === 0 && (
									<p className="p-3 text-sm text-slate-400">No products found.</p>
								)}
								{(productsPage?.data ?? []).map(product => (
									<button
										key={product.id}
										onClick={() => addLine(product)}
										className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
									>
										<span>
											<span className="font-medium text-slate-900">{product.name}</span>{" "}
											<span className="text-slate-400">({product.sku})</span>
										</span>
										<span className="text-slate-600">{formatMoney(product.costPrice ?? 0)}</span>
									</button>
								))}
							</div>
						)}
					</div>

					<div className="overflow-x-auto rounded-xl border border-slate-200">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3 font-medium">Item</th>
									<th className="px-4 py-3 font-medium">Unit cost</th>
									<th className="px-4 py-3 font-medium">Qty</th>
									<th className="px-4 py-3 font-medium">Total</th>
									<th className="px-4 py-3" />
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{lines.map(line => (
									<tr key={line.key}>
										<td className="px-4 py-3">
											<p className="font-medium text-slate-900">{line.name}</p>
											<p className="text-xs text-slate-400">{line.sku}</p>
										</td>
										<td className="px-4 py-3">
											<Input
												type="number"
												min={0}
												value={line.unitCost || ""}
												onChange={e => updateUnitCost(line.key, Number(e.target.value) || 0)}
												className="h-8 w-24"
											/>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<button
													onClick={() => updateQuantity(line.key, line.quantity - 1)}
													className="rounded p-1 text-slate-400 hover:bg-slate-100"
												>
													<Minus className="h-3.5 w-3.5" />
												</button>
												<span className="w-8 text-center">{line.quantity}</span>
												<button
													onClick={() => updateQuantity(line.key, line.quantity + 1)}
													className="rounded p-1 text-slate-400 hover:bg-slate-100"
												>
													<Plus className="h-3.5 w-3.5" />
												</button>
											</div>
										</td>
										<td className="px-4 py-3 font-medium text-slate-900">{formatMoney(line.unitCost * line.quantity)}</td>
										<td className="px-4 py-3">
											<button
												onClick={() => removeLine(line.key)}
												className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))}
								{lines.length === 0 && (
									<tr>
										<td colSpan={5} className="px-4 py-10 text-center text-slate-400">
											No items yet — search a product above to add it to this purchase order.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div>
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Note (optional)</label>
						<textarea
							value={note}
							onChange={e => setNote(e.target.value)}
							rows={2}
							placeholder="Reference number, delivery notes, etc."
							className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
						/>
					</div>
				</div>

				{/* Right: totals + submit */}
				<div className="space-y-4">
					<div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Subtotal</span>
							<span className="font-medium text-slate-900">{formatMoney(subtotal)}</span>
						</div>
						<div className="flex items-center justify-between gap-2">
							<span className="text-slate-500">Discount</span>
							<Input
								type="number"
								min={0}
								value={discountAmount || ""}
								onChange={e => setDiscountAmount(Number(e.target.value) || 0)}
								className="h-8 w-28 text-right"
							/>
						</div>
						<div className="flex items-center justify-between gap-2">
							<span className="text-slate-500">VAT</span>
							<Input
								type="number"
								min={0}
								value={vatAmount || ""}
								onChange={e => setVatAmount(Number(e.target.value) || 0)}
								className="h-8 w-28 text-right"
							/>
						</div>
						<div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base">
							<span className="font-semibold text-slate-900">Total</span>
							<span className="font-semibold text-slate-900">{formatMoney(total)}</span>
						</div>
					</div>

					<Button className="w-full" isLoading={createPurchase.isPending} onClick={submit}>
						Create purchase order
					</Button>
					<p className="text-center text-xs text-slate-400">
						This creates the order as pending. Receiving stock and payments happen from the purchase's detail page.
					</p>
				</div>
			</div>
		</div>
	);
}
