"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Wallet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useSale, useAddSalePayment, useOpenReceipt } from "@/features/sales/hooks/useSales";
import type { SalePaymentMethod } from "@/features/sales/types";
import { formatDateTime } from "@/lib/utils";
import { useFormatMoney, useCountry } from "@/hooks/useCurrency";
import { getPaymentMethods } from "@/lib/paymentMethods";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "default"> = {
	COMPLETED: "success",
	PAID: "success",
	PARTIALLY_PAID: "warning",
	HELD: "warning",
	DUE: "warning",
	RETURNED: "danger",
	CANCELLED: "danger",
};

export default function SaleDetailPage() {
	const formatMoney = useFormatMoney();
	const country = useCountry();
	const PAYMENT_METHODS = getPaymentMethods(country) as { value: SalePaymentMethod; label: string }[];
	const router = useRouter();
	const { orgHandle, id } = useParams<{ orgHandle: string; id: string }>();
	const { data: sale, isLoading, isError } = useSale(id);
	const addPayment = useAddSalePayment();
	const openReceipt = useOpenReceipt();

	// ── Payment modal ────────────────────────────────────────
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("CASH");
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [paymentRef, setPaymentRef] = useState("");

	const openPaymentModal = () => {
		setPaymentMethod("CASH");
		setPaymentAmount(Number(sale?.dueAmount ?? 0));
		setPaymentRef("");
		setPaymentOpen(true);
	};

	const submitPayment = () => {
		if (!sale) return;
		if (paymentAmount <= 0) {
			toast.error("Enter a payment amount greater than 0.");
			return;
		}
		if (paymentAmount > Number(sale.dueAmount ?? 0)) {
			toast.error(`Amount can't exceed the due balance of ${formatMoney(sale.dueAmount ?? 0)}.`);
			return;
		}
		addPayment.mutate(
			{ id: sale.id, payload: { method: paymentMethod, amount: paymentAmount, transactionRef: paymentRef || undefined } },
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

	if (isError || !sale) {
		return (
			<EmptyState
				title="Couldn't load this sale"
				description="It may have been deleted, or you may not have access to it."
				action={
					<Button variant="outline" onClick={() => router.push(`/${orgHandle}/sales`)}>
						Back to sales
					</Button>
				}
			/>
		);
	}

	const items = sale.items ?? [];
	const payments = sale.payments ?? [];
	const due = Number(sale.dueAmount ?? 0);

	return (
		<div className="mx-auto max-w-4xl">
			<button
				onClick={() => router.push(`/${orgHandle}/sales`)}
				className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
			>
				<ArrowLeft className="h-4 w-4" /> All sales
			</button>

			<PageHeader
				title={sale.invoiceNo}
				description={`${sale.customer?.name ?? "Walk-in customer"} · ${formatDateTime(sale.createdAt)}`}
				action={
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => openReceipt.mutate(sale.id)}>
							<Download className="h-4 w-4" />
							Receipt
						</Button>
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
				<Badge tone={STATUS_TONE[sale.isHeld ? "HELD" : sale.status] ?? "default"}>
					{sale.isHeld ? "HELD" : sale.status.replace(/_/g, " ")}
				</Badge>
			</div>

			<div className="overflow-x-auto rounded-xl border border-slate-200">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
						<tr>
							<th className="px-4 py-3 font-medium">Item</th>
							<th className="px-4 py-3 font-medium">Qty</th>
							<th className="px-4 py-3 font-medium">Unit price</th>
							<th className="px-4 py-3 font-medium">Total</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{items.map(item => (
							<tr key={item.id}>
								<td className="px-4 py-3">
									<p className="font-medium text-slate-900">{item.product?.name ?? "Item"}</p>
									<p className="text-xs text-slate-400">{item.variant?.sku ?? item.product?.sku}</p>
								</td>
								<td className="px-4 py-3 text-slate-700">{item.quantity}</td>
								<td className="px-4 py-3 text-slate-700">{formatMoney(item.unitPrice)}</td>
								<td className="px-4 py-3 font-medium text-slate-900">
									{formatMoney(Number(item.unitPrice) * Number(item.quantity) - Number(item.discountAmount ?? 0))}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-slate-500">Subtotal</span>
						<span className="font-medium text-slate-900">{formatMoney(sale.subtotal ?? 0)}</span>
					</div>
					{!!sale.discountAmount && (
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Discount</span>
							<span className="text-slate-700">− {formatMoney(sale.discountAmount)}</span>
						</div>
					)}
					{!!sale.vatAmount && (
						<div className="flex items-center justify-between">
							<span className="text-slate-500">VAT</span>
							<span className="text-slate-700">{formatMoney(sale.vatAmount)}</span>
						</div>
					)}
					<div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base">
						<span className="font-semibold text-slate-900">Total</span>
						<span className="font-semibold text-slate-900">{formatMoney(sale.totalAmount)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-slate-500">Paid</span>
						<span className="text-slate-700">{formatMoney(sale.paidAmount ?? 0)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-slate-500">Due</span>
						<span className={due > 0 ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
							{formatMoney(due)}
						</span>
					</div>
					{sale.note && (
						<div className="border-t border-slate-100 pt-2">
							<p className="text-xs text-slate-400">Note</p>
							<p className="text-slate-700">{sale.note}</p>
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

			{/* Add payment modal */}
			<Modal open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Add payment" size="sm">
				<div className="space-y-4">
					<div>
						<label className="mb-1.5 block text-xs font-medium text-slate-500">Method</label>
						<Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as SalePaymentMethod)}>
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
