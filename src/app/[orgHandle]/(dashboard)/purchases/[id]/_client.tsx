"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, Wallet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useWarehouses } from "@/features/warehouse/hooks/useWarehouses";
import { usePurchase, useReceivePurchase, useAddPurchasePayment } from "@/features/purchase/hooks/usePurchases";
import type { PurchasePaymentMethod, PurchaseStatus } from "@/features/purchase/types";
import { formatDateTime } from "@/lib/utils";
import { useFormatMoney, useCountry } from "@/hooks/useCurrency";
import { getPaymentMethods } from "@/lib/paymentMethods";

const STATUS_TONE: Record<PurchaseStatus, "success" | "warning" | "danger" | "default"> = {
	REQUESTED: "default",
	ORDERED: "warning",
	PARTIALLY_RECEIVED: "warning",
	RECEIVED: "success",
	BILLED: "success",
	RETURNED: "danger",
	CANCELLED: "danger",
};

const PAYMENT_METHODS_EXTRA: { value: PurchasePaymentMethod; label: string }[] = [{ value: "OTHER", label: "Other" }];

export default function PurchaseDetailPage() {
	const formatMoney = useFormatMoney();
	const country = useCountry();
	const PAYMENT_METHODS = getPaymentMethods(country, PAYMENT_METHODS_EXTRA) as { value: PurchasePaymentMethod; label: string }[];
	const router = useRouter();
	const { orgHandle, id } = useParams<{ orgHandle: string; id: string }>();
	const { data: purchase, isLoading, isError } = usePurchase(id);

	const { data: allWarehouses = [] } = useWarehouses();
	const warehouses = useMemo(
		() => allWarehouses.filter(w => w.branchId === purchase?.branchId),
		[allWarehouses, purchase?.branchId],
	);

	const receivePurchase = useReceivePurchase(id);
	const addPayment = useAddPurchasePayment(id);

	// ── Receive modal ────────────────────────────────────────
	const [receiveOpen, setReceiveOpen] = useState(false);
	const [warehouseId, setWarehouseId] = useState("");
	const [receiveQty, setReceiveQty] = useState<Record<string, number>>({});

	const openReceiveModal = () => {
		const defaults: Record<string, number> = {};
		(purchase?.items ?? []).forEach(item => {
			const remaining = Number(item.quantity) - Number(item.receivedQty);
			if (remaining > 0) defaults[item.id] = remaining;
		});
		setReceiveQty(defaults);
		setWarehouseId(warehouses.find(w => w.isDefault)?.id ?? warehouses[0]?.id ?? "");
		setReceiveOpen(true);
	};

	const submitReceive = () => {
		if (!warehouseId) {
			toast.error("Select which warehouse this stock is going into.");
			return;
		}
		const items = Object.entries(receiveQty)
			.filter(([, qty]) => qty > 0)
			.map(([purchaseItemId, quantity]) => ({ purchaseItemId, quantity }));

		if (items.length === 0) {
			toast.error("Enter a quantity for at least one item.");
			return;
		}

		receivePurchase.mutate(
			{ warehouseId, items },
			{ onSuccess: () => setReceiveOpen(false) },
		);
	};

	// ── Payment modal ────────────────────────────────────────
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<PurchasePaymentMethod>("CASH");
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [paymentRef, setPaymentRef] = useState("");

	const openPaymentModal = () => {
		setPaymentMethod("CASH");
		setPaymentAmount(Number(purchase?.dueAmount ?? 0));
		setPaymentRef("");
		setPaymentOpen(true);
	};

	const submitPayment = () => {
		if (paymentAmount <= 0) {
			toast.error("Enter a payment amount greater than 0.");
			return;
		}
		if (purchase?.dueAmount != null && paymentAmount > Number(purchase.dueAmount)) {
			toast.error(`Amount can't exceed the due balance of ${formatMoney(purchase.dueAmount)}.`);
			return;
		}
		addPayment.mutate(
			{ method: paymentMethod, amount: paymentAmount, transactionRef: paymentRef || undefined },
			{ onSuccess: () => setPaymentOpen(false) },
		);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (isError || !purchase) {
		return (
			<EmptyState
				title="Couldn't load this purchase order"
				description="It may have been deleted, or you may not have access to it."
				action={
					<Button variant="outline" onClick={() => router.push(`/${orgHandle}/purchases`)}>
						Back to purchases
					</Button>
				}
			/>
		);
	}

	const items = purchase.items ?? [];
	const payments = purchase.payments ?? [];
	const fullyReceived = items.every(i => Number(i.receivedQty) >= Number(i.quantity));
	const due = Number(purchase.dueAmount ?? 0);

	return (
		<div className="mx-auto max-w-4xl">
			<button
				onClick={() => router.push(`/${orgHandle}/purchases`)}
				className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
			>
				<ArrowLeft className="h-4 w-4" /> All purchases
			</button>

			<PageHeader
				title={purchase.refNo ?? `Purchase #${purchase.id.slice(0, 8)}`}
				description={`${purchase.supplier?.name ?? "Unknown supplier"} · ${formatDateTime(purchase.createdAt)}`}
				action={
					<div className="flex gap-2">
						{!fullyReceived && (
							<Button variant="outline" onClick={openReceiveModal} disabled={warehouses.length === 0}>
								<PackageCheck className="h-4 w-4" />
								Receive items
							</Button>
						)}
						{due > 0 && (
							<Button onClick={openPaymentModal}>
								<Wallet className="h-4 w-4" />
								Add payment
							</Button>
						)}
					</div>
				}
			/>

			<div className="mb-4">
				<Badge tone={STATUS_TONE[purchase.status] ?? "default"}>{purchase.status.replace(/_/g, " ")}</Badge>
			</div>

			{!fullyReceived && warehouses.length === 0 && (
				<div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
					This branch has no warehouse set up yet — add one before you can receive stock against this order.
				</div>
			)}

			<div className="overflow-hidden rounded-xl border border-slate-200">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
						<tr>
							<th className="px-4 py-3 font-medium">Item</th>
							<th className="px-4 py-3 font-medium">Ordered</th>
							<th className="px-4 py-3 font-medium">Received</th>
							<th className="px-4 py-3 font-medium">Unit cost</th>
							<th className="px-4 py-3 font-medium">Total</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{items.map(item => {
							const variantBits = item.variant
								? [item.variant.color, item.variant.size, item.variant.storage, item.variant.ram].filter(Boolean).join(" / ")
								: "";
							const received = Number(item.receivedQty);
							const ordered = Number(item.quantity);
							return (
								<tr key={item.id}>
									<td className="px-4 py-3">
										<p className="font-medium text-slate-900">
											{item.product?.name ?? "Item"}
											{variantBits && <span className="text-slate-400"> ({variantBits})</span>}
										</p>
										<p className="text-xs text-slate-400">{item.variant?.sku ?? item.product?.sku}</p>
									</td>
									<td className="px-4 py-3 text-slate-700">{ordered}</td>
									<td className="px-4 py-3">
										<span className={received >= ordered ? "text-emerald-600" : "text-amber-600"}>{received}</span>
										<span className="text-slate-400"> / {ordered}</span>
									</td>
									<td className="px-4 py-3 text-slate-700">{formatMoney(item.unitCost)}</td>
									<td className="px-4 py-3 font-medium text-slate-900">{formatMoney(item.totalCost)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-slate-500">Subtotal</span>
						<span className="font-medium text-slate-900">{formatMoney(purchase.subtotal ?? 0)}</span>
					</div>
					{!!purchase.discountAmount && (
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Discount</span>
							<span className="text-slate-700">− {formatMoney(purchase.discountAmount)}</span>
						</div>
					)}
					{!!purchase.vatAmount && (
						<div className="flex items-center justify-between">
							<span className="text-slate-500">VAT</span>
							<span className="text-slate-700">{formatMoney(purchase.vatAmount)}</span>
						</div>
					)}
					<div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base">
						<span className="font-semibold text-slate-900">Total</span>
						<span className="font-semibold text-slate-900">{formatMoney(purchase.totalAmount)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-slate-500">Paid</span>
						<span className="text-slate-700">{formatMoney(purchase.paidAmount ?? 0)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-slate-500">Due</span>
						<span className={due > 0 ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
							{formatMoney(due)}
						</span>
					</div>
					{purchase.note && (
						<div className="border-t border-slate-100 pt-2">
							<p className="text-xs text-slate-400">Note</p>
							<p className="text-slate-700">{purchase.note}</p>
						</div>
					)}
				</div>

				<div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Payments</p>
					{payments.length === 0 && <p className="text-slate-400">No payments recorded yet.</p>}
					<div className="space-y-2">
						{payments.map(p => (
							<div key={p.id} className="flex items-center justify-between">
								<div>
									<p className="text-slate-700">{p.method.replace(/_/g, " ")}</p>
									<p className="text-xs text-slate-400">{formatDateTime(p.createdAt)}</p>
								</div>
								<span className="font-medium text-slate-900">{formatMoney(p.amount)}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Receive items modal */}
			<Modal open={receiveOpen} onClose={() => setReceiveOpen(false)} title="Receive items" size="lg">
				<div className="space-y-4">
					<div>
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Receiving into warehouse</label>
						<Select value={warehouseId} onChange={e => setWarehouseId(e.target.value)}>
							{warehouses.length === 0 && <option value="">No warehouses on this branch</option>}
							{warehouses.map(w => (
								<option key={w.id} value={w.id}>
									{w.name}
								</option>
							))}
						</Select>
					</div>

					<div className="space-y-3">
						{items
							.filter(item => Number(item.quantity) - Number(item.receivedQty) > 0)
							.map(item => {
								const remaining = Number(item.quantity) - Number(item.receivedQty);
								return (
									<div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3">
										<div>
											<p className="text-sm font-medium text-slate-900">{item.product?.name ?? "Item"}</p>
											<p className="text-xs text-slate-400">Remaining to receive: {remaining}</p>
										</div>
										<Input
											type="number"
											min={0}
											max={remaining}
											value={receiveQty[item.id] ?? ""}
											onChange={e =>
												setReceiveQty(prev => ({
													...prev,
													[item.id]: Math.min(Number(e.target.value) || 0, remaining),
												}))
											}
											className="w-24"
										/>
									</div>
								);
							})}
					</div>

					<Button className="w-full" isLoading={receivePurchase.isPending} onClick={submitReceive}>
						Confirm receipt & update inventory
					</Button>
				</div>
			</Modal>

			{/* Add payment modal */}
			<Modal open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Add payment" size="sm">
				<div className="space-y-4">
					<div>
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Method</label>
						<Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PurchasePaymentMethod)}>
							{PAYMENT_METHODS.map(m => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</Select>
					</div>
					<div>
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Amount</label>
						<Input
							type="number"
							min={0}
							max={due}
							value={paymentAmount || ""}
							onChange={e => setPaymentAmount(Number(e.target.value) || 0)}
						/>
						<p className="mt-1 text-xs text-slate-400">Due balance: {formatMoney(due)}</p>
					</div>
					<div>
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Reference (optional)</label>
						<Input value={paymentRef} onChange={e => setPaymentRef(e.target.value)} placeholder="Transaction ID, cheque no..." />
					</div>
					<Button className="w-full" isLoading={addPayment.isPending} onClick={submitPayment}>
						Record payment
					</Button>
				</div>
			</Modal>
		</div>
	);
}
