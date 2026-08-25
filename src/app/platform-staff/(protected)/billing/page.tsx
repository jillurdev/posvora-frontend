"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import {
	useAdminBillingSummary,
	useAdminInvoices,
	useMarkInvoicePaid,
} from "@/features/platform-staff/hooks/useSuperAdmin";
import type { AdminInvoice } from "@/features/platform-staff/types";
import { formatDate, formatMoney } from "@/lib/utils";

// Platform-wide summary cards (MRR, collected, outstanding) are normalized
// to BDT on the backend (see SuperAdminService.toBdt) — safe to prefix
// with ৳ unconditionally. Individual invoice rows below are NOT
// normalized (they show exactly what was charged), so each one must use
// its own `currency`, not this fixed-BDT helper — an org paying via
// Stripe/Razorpay has USD/INR invoices, and showing "৳29" for a $29
// charge would misrepresent what was actually collected.
function money(n: string | number | undefined | null) {
	const value = typeof n === "string" ? Number(n) : n ?? 0;
	return `৳${value.toLocaleString()}`;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5">
			<p className="text-sm text-slate-500">{label}</p>
			<p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
		</div>
	);
}

const STATUS_TONE: Record<string, "warning" | "success" | "danger" | "default"> = {
	UNPAID: "warning",
	PAID: "success",
	FAILED: "danger",
	CANCELLED: "default",
};

export default function AdminBillingPage() {
	const { data: summary } = useAdminBillingSummary();
	const [status, setStatus] = useState("");
	const [page, setPage] = useState(1);
	const { data, isLoading } = useAdminInvoices({ page, limit: 20, status: status || undefined });
	const { mutate: markPaid, isPending } = useMarkInvoicePaid();

	const onMarkPaid = (id: string) => {
		const note = window.prompt("Optional note (e.g. bKash TrxID, bank reference):") ?? undefined;
		markPaid({ id, note });
	};

	const columns: Column<AdminInvoice>[] = [
		{ header: "Organization", accessor: i => i.subscription.organization.name },
		{ header: "Plan", accessor: i => i.plan?.name ?? "—" },
		{ header: "Amount", accessor: i => formatMoney(i.amount, i.currency || "BDT") },
		{ header: "Status", accessor: i => <Badge tone={STATUS_TONE[i.status] ?? "default"}>{i.status}</Badge> },
		{ header: "Method", accessor: i => i.paymentMethod ?? "—" },
		{ header: "Period", accessor: i => `${formatDate(i.periodStart)} → ${formatDate(i.periodEnd)}` },
		{ header: "Created", accessor: i => formatDate(i.createdAt) },
		{
			header: "Actions",
			accessor: i =>
				i.status === "UNPAID" ? (
					<Button size="sm" onClick={() => onMarkPaid(i.id)} disabled={isPending}>
						Mark as paid
					</Button>
				) : (
					<span className="text-xs text-slate-400">{i.paidAt ? formatDate(i.paidAt) : "—"}</span>
				),
		},
	];

	return (
		<div>
			<PageHeader title="Billing" description="Platform-wide revenue and subscription invoices." />

			<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<StatCard label="MRR" value={money(summary?.mrr)} />
				<StatCard label="Active subscriptions" value={summary?.activeSubscriptions ?? "—"} />
				<StatCard label="Collected this month" value={money(summary?.collectedThisMonth)} />
				<StatCard label="Outstanding unpaid" value={money(summary?.outstandingUnpaid)} />
				<StatCard label="Total collected (lifetime)" value={money(summary?.totalCollected)} />
			</div>

			<div className="mb-4 max-w-xs">
				<Select
					value={status}
					onChange={e => {
						setStatus(e.target.value);
						setPage(1);
					}}
				>
					<option value="">All statuses</option>
					<option value="UNPAID">Unpaid</option>
					<option value="PAID">Paid</option>
					<option value="FAILED">Failed</option>
					<option value="CANCELLED">Cancelled</option>
				</Select>
			</div>

			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={i => i.id} emptyTitle="No invoices found" />

			{data?.meta && data.meta.totalPages > 1 && (
				<div className="mt-4 flex items-center justify-between text-sm text-slate-500">
					<span>
						Page {data.meta.page} of {data.meta.totalPages}
					</span>
					<div className="flex gap-2">
						<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
							Previous
						</Button>
						<Button
							size="sm"
							variant="outline"
							disabled={page >= data.meta.totalPages}
							onClick={() => setPage(p => p + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
