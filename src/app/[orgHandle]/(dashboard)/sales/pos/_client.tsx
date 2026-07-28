"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Minus, Plus, Search, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useWarehouses } from "@/features/warehouse/hooks/useWarehouses";
import { useProducts } from "@/features/product/hooks/useProducts";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useCreateSale, useResumeSale, useSale } from "@/features/sales/hooks/useSales";
import { ReceiptModal } from "@/features/sales/components/ReceiptModal";
import type { Product } from "@/features/product/types";
import type { SalePaymentMethod, Sale } from "@/features/sales/types";
import { formatMoney } from "@/lib/utils";

interface CartLine {
	key: string;
	productId: string;
	variantId?: string;
	name: string;
	sku: string;
	unitPrice: number;
	quantity: number;
	discountAmount: number;
}

const PAYMENT_METHODS: { value: SalePaymentMethod; label: string }[] = [
	{ value: "CASH", label: "Cash" },
	{ value: "CARD", label: "Card" },
	{ value: "BKASH", label: "bKash" },
	{ value: "NAGAD", label: "Nagad" },
	{ value: "ROCKET", label: "Rocket" },
	{ value: "UPAY", label: "Upay" },
	{ value: "BANK_TRANSFER", label: "Bank Transfer" },
	{ value: "DUE", label: "Due (pay later)" },
];

export default function PosPage() {
	const router = useRouter();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const searchParams = useSearchParams();
	const resumeId = searchParams.get("resume") || undefined;
	const { data: resumingSale } = useSale(resumeId);
	const [prefilled, setPrefilled] = useState(false);

	const { activeShopId, shops } = useActiveShop();

	const { data: allBranches = [] } = useBranches();
	const branches = useMemo(() => allBranches.filter(b => b.shopId === activeShopId), [allBranches, activeShopId]);
	const [branchId, setBranchId] = useState<string>("");
	const effectiveBranchId = branchId || branches[0]?.id || "";

	const { data: allWarehouses = [] } = useWarehouses();
	const warehouses = useMemo(
		() => allWarehouses.filter(w => w.branchId === effectiveBranchId),
		[allWarehouses, effectiveBranchId],
	);
	const [warehouseId, setWarehouseId] = useState<string>("");
	const effectiveWarehouseId = warehouseId || warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || "";

	const [customerId, setCustomerId] = useState<string>("");
	const [customerSearch, setCustomerSearch] = useState("");
	const { data: customersPage } = useCustomers(activeShopId ?? "", { search: customerSearch || undefined, limit: 8 });

	const [search, setSearch] = useState("");
	const { data: productsPage, isLoading: productsLoading } = useProducts({
		shopId: activeShopId ?? "",
		search: search || undefined,
		limit: 10,
	});

	const [cart, setCart] = useState<CartLine[]>([]);
	const [orderDiscount, setOrderDiscount] = useState(0);
	const [vatPercent, setVatPercent] = useState(0);
	const [note, setNote] = useState("");
	const [payments, setPayments] = useState<{ method: SalePaymentMethod; amount: number }[]>([
		{ method: "CASH", amount: 0 },
	]);
	const [completedSale, setCompletedSale] = useState<Sale | null>(null);

	const createSale = useCreateSale();
	const resumeSale = useResumeSale();

	useEffect(() => {
		if (!resumingSale || prefilled) return;
		setBranchId(resumingSale.branchId);
		if (resumingSale.customerId) setCustomerId(resumingSale.customerId);
		setOrderDiscount(Number(resumingSale.discountAmount ?? 0));
		setNote(resumingSale.note ?? "");
		setCart(
			(resumingSale.items ?? []).map(item => ({
				key: item.variantId ?? item.productId,
				productId: item.productId,
				variantId: item.variantId ?? undefined,
				name: item.product?.name ?? "Item",
				sku: item.variant?.sku ?? item.product?.sku ?? "",
				unitPrice: Number(item.unitPrice),
				quantity: Number(item.quantity),
				discountAmount: Number(item.discountAmount ?? 0),
			})),
		);
		setPrefilled(true);
	}, [resumingSale, prefilled]);

	const addToCart = (product: Product) => {
		const variant = product.variants?.[0];
		const key = variant?.id ?? product.id;
		const unitPrice = variant?.sellingPrice ?? product.sellingPrice ?? 0;
		const sku = variant?.sku ?? product.sku;

		setCart(prev => {
			const existing = prev.find(l => l.key === key);
			if (existing) {
				return prev.map(l => (l.key === key ? { ...l, quantity: l.quantity + 1 } : l));
			}
			return [
				...prev,
				{
					key,
					productId: product.id,
					variantId: variant?.id,
					name: product.name,
					sku,
					unitPrice,
					quantity: 1,
					discountAmount: 0,
				},
			];
		});
		setSearch("");
	};

	// Barcode scanners act like a very fast keyboard, typing the code then
	// Enter. When there's exactly one match at that point, add it straight
	// to the cart instead of forcing the cashier to click a search result.
	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return;
		const matches = productsPage?.data ?? [];
		if (matches.length === 1) {
			e.preventDefault();
			addToCart(matches[0]);
		}
	};

	const updateQuantity = (key: string, quantity: number) => {
		if (quantity <= 0) return removeLine(key);
		setCart(prev => prev.map(l => (l.key === key ? { ...l, quantity } : l)));
	};

	const removeLine = (key: string) => setCart(prev => prev.filter(l => l.key !== key));

	const subtotal = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity - l.discountAmount, 0);
	const vatAmount = (subtotal * vatPercent) / 100;
	const total = Math.max(subtotal + vatAmount - orderDiscount, 0);
	const paidTotal = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
	const due = Math.max(total - paidTotal, 0);

	const updatePayment = (idx: number, patch: Partial<{ method: SalePaymentMethod; amount: number }>) => {
		setPayments(prev => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
	};
	const addPaymentRow = () => setPayments(prev => [...prev, { method: "CASH", amount: 0 }]);
	const removePaymentRow = (idx: number) => setPayments(prev => prev.filter((_, i) => i !== idx));

	const resetSale = () => {
		setCart([]);
		setOrderDiscount(0);
		setVatPercent(0);
		setNote("");
		setCustomerId("");
		setPayments([{ method: "CASH", amount: 0 }]);
	};

	const submit = (holdSale: boolean) => {
		if (!effectiveBranchId || !effectiveWarehouseId) {
			toast.error("Select a branch and warehouse first.");
			return;
		}
		if (cart.length === 0) {
			toast.error("Add at least one item to the cart.");
			return;
		}

		const payload = {
			branchId: effectiveBranchId,
			warehouseId: effectiveWarehouseId,
			customerId: customerId || undefined,
			items: cart.map(l => ({
				productId: l.productId,
				variantId: l.variantId,
				quantity: l.quantity,
				unitPrice: l.unitPrice,
				discountAmount: l.discountAmount || undefined,
			})),
			discountAmount: orderDiscount || undefined,
			vatPercent: vatPercent || undefined,
			payments: holdSale ? undefined : payments.filter(p => p.amount > 0),
			note: note || undefined,
			holdSale,
		};

		const onSuccess = (sale: Sale) => {
			if (holdSale) {
				toast.success("Sale held. Resume it later from Sales history.");
				resetSale();
			} else {
				setCompletedSale(sale);
				resetSale();
				if (resumeId) router.replace(`/${orgHandle}/sales/pos`);
			}
		};

		if (resumeId) {
			resumeSale.mutate({ id: resumeId, payload }, { onSuccess });
		} else {
			createSale.mutate(payload, { onSuccess });
		}
	};

	if (shops.length === 0) {
		return <EmptyState icon={ShoppingCart} title="Create a shop first" description="Add a shop before making sales." />;
	}
	if (branches.length === 0) {
		return (
			<EmptyState
				icon={ShoppingCart}
				title="Create a branch first"
				description="You need at least one branch to sell from."
			/>
		);
	}

	return (
		<div>
			<PageHeader
				title="New Sale"
				description="Search or scan a product to add it to the cart."
				action={
					<Button variant="outline" onClick={() => router.push(`/${orgHandle}/sales`)}>
						Sales history
					</Button>
				}
			/>

			<div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Select value={effectiveBranchId} onChange={e => setBranchId(e.target.value)}>
					{branches.map(b => (
						<option key={b.id} value={b.id}>
							{b.name}
						</option>
					))}
				</Select>
				<Select value={effectiveWarehouseId} onChange={e => setWarehouseId(e.target.value)}>
					{warehouses.length === 0 && <option value="">No warehouse in this branch</option>}
					{warehouses.map(w => (
						<option key={w.id} value={w.id}>
							{w.name}
						</option>
					))}
				</Select>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Product search + cart */}
				<div className="lg:col-span-2">
					<div className="relative mb-3">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							autoFocus
							value={search}
							onChange={e => setSearch(e.target.value)}
							onKeyDown={handleSearchKeyDown}
							placeholder="Search by name, SKU, or scan barcode..."
							className="pl-9"
						/>
						{search && (
							<div className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
								{productsLoading && <div className="p-3"><Spinner /></div>}
								{!productsLoading && (productsPage?.data ?? []).length === 0 && (
									<p className="p-3 text-sm text-slate-400">No products found.</p>
								)}
								{(productsPage?.data ?? []).map(product => (
									<button
										key={product.id}
										onClick={() => addToCart(product)}
										className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
									>
										<span>
											<span className="font-medium text-slate-900">{product.name}</span>{" "}
											<span className="text-slate-400">({product.sku})</span>
										</span>
										<span className="text-slate-600">{formatMoney(product.sellingPrice ?? 0)}</span>
									</button>
								))}
							</div>
						)}
					</div>

					<div className="overflow-hidden rounded-xl border border-slate-200">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3 font-medium">Item</th>
									<th className="px-4 py-3 font-medium">Price</th>
									<th className="px-4 py-3 font-medium">Qty</th>
									<th className="px-4 py-3 font-medium">Total</th>
									<th className="px-4 py-3" />
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{cart.map(line => (
									<tr key={line.key}>
										<td className="px-4 py-3">
											<p className="font-medium text-slate-900">{line.name}</p>
											<p className="text-xs text-slate-400">{line.sku}</p>
										</td>
										<td className="px-4 py-3 text-slate-700">{formatMoney(line.unitPrice)}</td>
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
										<td className="px-4 py-3 font-medium text-slate-900">
											{formatMoney(line.unitPrice * line.quantity - line.discountAmount)}
										</td>
										<td className="px-4 py-3">
											<button onClick={() => removeLine(line.key)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
												<Trash2 className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))}
								{cart.length === 0 && (
									<tr>
										<td colSpan={5} className="px-4 py-10 text-center text-slate-400">
											Cart is empty — search a product above to get started.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Customer, totals, payment */}
				<div className="space-y-4">
					<div className="rounded-xl border border-slate-200 bg-white p-4">
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Customer</label>
						<div className="relative">
							<Input
								value={customerSearch}
								onChange={e => {
									setCustomerSearch(e.target.value);
									setCustomerId("");
								}}
								placeholder="Walk-in customer (search to attach one)"
							/>
							{customerSearch && !customerId && (
								<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
									{(customersPage?.data ?? []).map(c => (
										<button
											key={c.id}
											onClick={() => {
												setCustomerId(c.id);
												setCustomerSearch(c.name);
											}}
											className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50"
										>
											<span className="font-medium text-slate-900">{c.name}</span>
											{c.phone && <span className="text-xs text-slate-400">{c.phone}</span>}
										</button>
									))}
									{(customersPage?.data ?? []).length === 0 && (
										<p className="p-2 text-xs text-slate-400">No matching customers.</p>
									)}
								</div>
							)}
						</div>
					</div>

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
								value={orderDiscount || ""}
								onChange={e => setOrderDiscount(Number(e.target.value) || 0)}
								className="h-8 w-28 text-right"
							/>
						</div>
						<div className="flex items-center justify-between gap-2">
							<span className="text-slate-500">VAT %</span>
							<Input
								type="number"
								min={0}
								value={vatPercent || ""}
								onChange={e => setVatPercent(Number(e.target.value) || 0)}
								className="h-8 w-28 text-right"
							/>
						</div>
						<div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base">
							<span className="font-semibold text-slate-900">Total</span>
							<span className="font-semibold text-slate-900">{formatMoney(total)}</span>
						</div>
					</div>

					<div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
						<p className="text-xs font-medium text-slate-500">Payment</p>
						{payments.map((p, idx) => (
							<div key={idx} className="flex items-center gap-2">
								<Select
									value={p.method}
									onChange={e => updatePayment(idx, { method: e.target.value as SalePaymentMethod })}
									className="flex-1"
								>
									{PAYMENT_METHODS.map(m => (
										<option key={m.value} value={m.value}>
											{m.label}
										</option>
									))}
								</Select>
								<Input
									type="number"
									min={0}
									value={p.amount || ""}
									onChange={e => updatePayment(idx, { amount: Number(e.target.value) || 0 })}
									className="w-28"
									placeholder="Amount"
								/>
								{payments.length > 1 && (
									<button onClick={() => removePaymentRow(idx)} className="text-slate-400 hover:text-red-500">
										<X className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
						<button onClick={addPaymentRow} className="text-xs font-medium text-slate-500 hover:text-slate-700">
							+ Split payment
						</button>

						<div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm">
							<span className="text-slate-500">Due</span>
							<span className={due > 0 ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
								{formatMoney(due)}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<Button variant="outline" isLoading={createSale.isPending || resumeSale.isPending} onClick={() => submit(true)}>
							Hold sale
						</Button>
						<Button isLoading={createSale.isPending || resumeSale.isPending} onClick={() => submit(false)}>
							Complete sale
						</Button>
					</div>
				</div>
			</div>

			<ReceiptModal sale={completedSale} onClose={() => setCompletedSale(null)} />
		</div>
	);
}
