"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Textarea, Select } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import {
	useAdminSupportTicket,
	useAdminReplySupportTicket,
	useAdminUpdateTicketStatus,
} from "@/features/super-admin/hooks/useSuperAdmin";
import { STATUS_LABEL, STATUS_TONE, PRIORITY_TONE } from "@/features/support/utils";
import type { SupportTicketStatus } from "@/features/support/types";
import { formatDateTime, cn } from "@/lib/utils";

export default function AdminSupportTicketDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { user } = useAuth();
	const { data: ticket, isLoading } = useAdminSupportTicket(id);
	const reply = useAdminReplySupportTicket(id);
	const updateStatus = useAdminUpdateTicketStatus(id);
	const [message, setMessage] = useState("");

	if (!user?.roles?.includes("SUPER_ADMIN")) {
		return <EmptyState icon={ShieldCheck} title="Restricted" description="This area is for platform super admins only." />;
	}

	if (isLoading) return <Spinner />;
	if (!ticket) return null;

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;
		reply.mutate(message, { onSuccess: () => setMessage("") });
	};

	return (
		<div className="mx-auto max-w-3xl">
			<button
				onClick={() => router.push("/super-admin/support")}
				className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
			>
				<ArrowLeft className="h-4 w-4" /> Back to tickets
			</button>

			<div className="rounded-xl border border-slate-200 bg-white p-5">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="text-lg font-semibold text-slate-900">{ticket.subject}</h1>
						<p className="mt-1 text-xs text-slate-400">
							{ticket.organizationId
								? `Org ticket — opened ${formatDateTime(ticket.createdAt)}`
								: `${ticket.guestName} (${ticket.guestEmail}) — guest, opened ${formatDateTime(ticket.createdAt)}`}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge tone={PRIORITY_TONE[ticket.priority]}>{ticket.priority}</Badge>
						<Select
							value={ticket.status}
							onChange={e => updateStatus.mutate(e.target.value as SupportTicketStatus)}
							className="h-8 w-auto text-xs"
						>
							<option value="OPEN">Open</option>
							<option value="IN_PROGRESS">In progress</option>
							<option value="RESOLVED">Resolved</option>
							<option value="CLOSED">Closed</option>
						</Select>
					</div>
				</div>
				<p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">{ticket.description}</p>
			</div>

			<div className="mt-6 space-y-4">
				{ticket.replies?.map(r => (
					<div
						key={r.id}
						className={cn(
							"max-w-[85%] rounded-xl border px-4 py-3",
							r.isStaff ? "ml-auto border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50",
						)}
					>
						<div className="flex items-center justify-between gap-4">
							<span className={cn("text-xs font-medium", r.isStaff ? "text-slate-300" : "text-slate-500")}>
								{r.isStaff ? "Support Team (you)" : r.authorName || "Requester"}
							</span>
							<span className="text-xs text-slate-400">{formatDateTime(r.createdAt)}</span>
						</div>
						<p className={cn("mt-1 whitespace-pre-wrap text-sm", r.isStaff ? "text-white" : "text-slate-700")}>
							{r.message}
						</p>
					</div>
				))}
			</div>

			<form onSubmit={handleSend} className="mt-6 flex items-end gap-2">
				<Textarea
					rows={2}
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder="Reply as Support Team..."
					className="flex-1"
				/>
				<Button type="submit" isLoading={reply.isPending} disabled={!message.trim()}>
					<Send className="h-4 w-4" /> Send
				</Button>
			</form>
		</div>
	);
}
