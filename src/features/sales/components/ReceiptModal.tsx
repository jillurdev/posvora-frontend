"use client";

import { Download, Printer, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";
import { useOpenReceipt } from "../hooks/useSales";
import type { Sale } from "../types";

interface ReceiptModalProps {
	sale: Sale | null;
	onClose: () => void;
}

export function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
	const openReceipt = useOpenReceipt();

	if (!sale) return null;

	return (
		<Modal open={!!sale} onClose={onClose} title="Sale completed" size="sm">
			<div className="flex flex-col items-center gap-4 text-center">
				<div>
					<p className="text-sm text-slate-500">Invoice No.</p>
					<p className="text-lg font-semibold text-slate-900">{sale.invoiceNo}</p>
				</div>

				<div className="flex w-full justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
					<span className="text-slate-500">Total</span>
					<span className="font-semibold text-slate-900">{formatMoney(sale.totalAmount)}</span>
				</div>
				{Number(sale.dueAmount ?? 0) > 0 && (
					<div className="flex w-full justify-between rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
						<span>Due</span>
						<span className="font-semibold">{formatMoney(sale.dueAmount ?? 0)}</span>
					</div>
				)}

				<div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
					<ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
					The PDF receipt carries a signed QR code customers can scan to verify it&apos;s genuine.
				</div>

				<div className="grid w-full grid-cols-2 gap-2 pt-2">
					<Button variant="outline" onClick={() => window.print()}>
						<Printer className="h-4 w-4" /> Print
					</Button>
					<Button isLoading={openReceipt.isPending} onClick={() => openReceipt.mutate(sale.id)}>
						<Download className="h-4 w-4" /> Download PDF
					</Button>
				</div>
				<Button variant="ghost" className="w-full" onClick={onClose}>
					New sale
				</Button>
			</div>
		</Modal>
	);
}
