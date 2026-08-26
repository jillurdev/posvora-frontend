"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, StickyNote, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { TextField, TextareaField } from "@/components/ui/Field";
import {
	useCustomer,
	useCustomerStatement,
	useAddCustomerNote,
	useAddCustomerFollowUp,
} from "@/features/customer/hooks/useCustomers";
import type { ReceivableEntry } from "@/features/customer/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useFormatMoney } from "@/hooks/useCurrency";

export default function CustomerDetailPage() {
	const router = useRouter();
	const { orgHandle, id } = useParams<{ orgHandle: string; id: string }>();
	const formatMoney = useFormatMoney();

	const { data: customer, isLoading, isError } = useCustomer(id);
	const { data: statement, isLoading: statementLoading } = useCustomerStatement(id);
	const addNote = useAddCustomerNote();
	const addFollowUp = useAddCustomerFollowUp();

	const [noteModalOpen, setNoteModalOpen] = useState(false);
	const [note, setNote] = useState("");
	const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
	const [dueDate, setDueDate] = useState("");
	const [followUpNote, setFollowUpNote] = useState("");

	if (isLoading) return <Spinner />;
	if (isError || !customer) return <EmptyState title="Customer not found" description="It may have been removed." />;

	const entryColumns: Column<ReceivableEntry>[] = [
		{ header: "Date", accessor: e => formatDate(e.createdAt) },
		{ header: "Source", accessor: e => e.sourceType },
		{ header: "Debit", accessor: e => (e.debit ? formatMoney(e.debit) : "—") },
		{ header: "Credit", accessor: e => (e.credit ? formatMoney(e.credit) : "—") },
		{ header: "Balance after", accessor: e => `${formatMoney(e.balanceAfter)} ${e.currency}` },
		{ header: "Note", accessor: e => e.note ?? "—" },
	];

	const balances = Object.entries(statement?.balances ?? customer.balancesByCurrency ?? {}).filter(
		([, amount]) => Math.abs(amount) > 0.005,
	);

	return (
		<div>
			<button
				onClick={() => router.push(`/${orgHandle}/customers`)}
				className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
			>
				<ArrowLeft className="h-4 w-4" /> Back to customers
			</button>

			<PageHeader
				title={customer.name}
				description={[customer.phone, customer.email, customer.address].filter(Boolean).join(" · ") || "No contact details"}
				action={
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setNoteModalOpen(true)}>
							<StickyNote className="h-4 w-4" /> Add note
						</Button>
						<Button variant="outline" onClick={() => setFollowUpModalOpen(true)}>
							<CalendarClock className="h-4 w-4" /> Schedule follow-up
						</Button>
					</div>
				}
			/>

			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-xl border border-slate-200 p-4">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Outstanding balance</p>
					{balances.length === 0 ? (
						<p className="mt-1 text-lg font-semibold text-slate-900">Settled</p>
					) : (
						<div className="mt-1 space-y-0.5">
							{balances.map(([currency, amount]) => (
								<p key={currency} className={`text-lg font-semibold ${amount > 0 ? "text-red-600" : "text-emerald-600"}`}>
									{amount > 0 ? "+" : ""}
									{amount.toFixed(2)} {currency}
								</p>
							))}
						</div>
					)}
				</div>
				<div className="rounded-xl border border-slate-200 p-4">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Group</p>
					<p className="mt-1 text-lg font-semibold text-slate-900">{customer.groupId ? "Assigned" : "—"}</p>
				</div>
				<div className="rounded-xl border border-slate-200 p-4">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Customer since</p>
					<p className="mt-1 text-lg font-semibold text-slate-900">{formatDate(customer.createdAt)}</p>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Statement (ledger entries)</h2>
				<DataTable
					columns={entryColumns}
					data={statement?.entries ?? []}
					isLoading={statementLoading}
					rowKey={e => e.id}
					emptyTitle="No ledger entries yet"
					emptyDescription="Entries appear here as sales and payments are recorded."
				/>
			</div>

			<div className="mb-8">
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Follow-ups</h2>
				{customer.followUps && customer.followUps.length > 0 ? (
					<ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
						{customer.followUps.map(f => (
							<li key={f.id} className="flex items-center justify-between px-4 py-3 text-sm">
								<div>
									<p className="font-medium text-slate-800">{formatDate(f.dueDate)}</p>
									{f.note && <p className="text-slate-500">{f.note}</p>}
								</div>
								<Badge tone={f.isDone ? "success" : "warning"}>{f.isDone ? "Done" : "Pending"}</Badge>
							</li>
						))}
					</ul>
				) : (
					<EmptyState icon={CalendarClock} title="No follow-ups scheduled" />
				)}
			</div>

			<div>
				<h2 className="mb-3 text-sm font-semibold text-slate-700">Notes</h2>
				{customer.notes && customer.notes.length > 0 ? (
					<ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
						{customer.notes.map(n => (
							<li key={n.id} className="px-4 py-3 text-sm">
								<p className="text-slate-700">{n.note}</p>
								<p className="mt-1 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
							</li>
						))}
					</ul>
				) : (
					<EmptyState icon={StickyNote} title="No notes yet" />
				)}
			</div>

			<Modal open={noteModalOpen} onClose={() => setNoteModalOpen(false)} title="Add note">
				<div className="space-y-4">
					<TextareaField id="note-text" label="Note" required value={note} onChange={e => setNote(e.target.value)} rows={4} />
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setNoteModalOpen(false)}>Cancel</Button>
						<Button
							isLoading={addNote.isPending}
							disabled={!note.trim()}
							onClick={() =>
								addNote.mutate({ id, note }, { onSuccess: () => { setNote(""); setNoteModalOpen(false); } })
							}
						>
							Save
						</Button>
					</div>
				</div>
			</Modal>

			<Modal open={followUpModalOpen} onClose={() => setFollowUpModalOpen(false)} title="Schedule follow-up">
				<div className="space-y-4">
					<TextField id="followup-date" label="Due date" type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} />
					<TextareaField id="followup-note" label="Note" value={followUpNote} onChange={e => setFollowUpNote(e.target.value)} rows={3} />
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setFollowUpModalOpen(false)}>Cancel</Button>
						<Button
							isLoading={addFollowUp.isPending}
							disabled={!dueDate}
							onClick={() =>
								addFollowUp.mutate(
									{ id, payload: { dueDate, note: followUpNote || undefined } },
									{ onSuccess: () => { setDueDate(""); setFollowUpNote(""); setFollowUpModalOpen(false); } },
								)
							}
						>
							Save
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
