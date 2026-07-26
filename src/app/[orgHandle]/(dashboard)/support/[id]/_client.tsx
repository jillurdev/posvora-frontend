"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Input";
import { useSupportTicket, useReplySupportTicket } from "@/features/support/hooks/useSupportTickets";
import { STATUS_LABEL, STATUS_TONE, PRIORITY_TONE } from "@/features/support/utils";
import { formatDateTime, cn } from "@/lib/utils";
import { useOrgPath } from "@/hooks/useOrgHandle";

export default function SupportTicketDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const orgPath = useOrgPath();
	const { data: ticket, isLoading } = useSupportTicket(id);
	const reply = useReplySupportTicket(id);
	const [message, setMessage] = useState("");

	if (isLoading) return <Spinner />;
	if (!ticket) return null;

	const isClosed = ticket.status === "CLOSED";

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;
		reply.mutate(message, { onSuccess: () => setMessage("") });
	};

	return (
		<div className="mx-auto max-w-3xl">
			<button
				onClick={() => router.push(orgPath("support"))}
				className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
			>
				<ArrowLeft className="h-4 w-4" /> Back to tickets
			</button>

			<div className="rounded-xl border border-slate-200 bg-white p-5">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="text-lg font-semibold text-slate-900">{ticket.subject}</h1>
						<p className="mt-1 text-xs text-slate-400">Opened {formatDateTime(ticket.createdAt)}</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge tone={PRIORITY_TONE[ticket.priority]}>{ticket.priority}</Badge>
						<Badge tone={STATUS_TONE[ticket.status]}>{STATUS_LABEL[ticket.status]}</Badge>
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
							r.isStaff
								? "border-slate-200 bg-slate-50"
								: "ml-auto border-slate-900 bg-slate-900 text-white",
						)}
					>
						<div className="flex items-center justify-between gap-4">
							<span className={cn("text-xs font-medium", r.isStaff ? "text-slate-500" : "text-slate-300")}>
								{r.isStaff ? "Support Team" : r.authorName || "You"}
							</span>
							<span className={cn("text-xs", r.isStaff ? "text-slate-400" : "text-slate-400")}>
								{formatDateTime(r.createdAt)}
							</span>
						</div>
						<p className={cn("mt-1 whitespace-pre-wrap text-sm", r.isStaff ? "text-slate-700" : "text-white")}>
							{r.message}
						</p>
					</div>
				))}
			</div>

			{isClosed ? (
				<p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-center text-sm text-slate-400">
					This ticket is closed. Open a new ticket if you need further help.
				</p>
			) : (
				<form onSubmit={handleSend} className="mt-6 flex items-end gap-2">
					<Textarea
						rows={2}
						value={message}
						onChange={e => setMessage(e.target.value)}
						placeholder="Write a reply..."
						className="flex-1"
					/>
					<Button type="submit" isLoading={reply.isPending} disabled={!message.trim()}>
						<Send className="h-4 w-4" /> Send
					</Button>
				</form>
			)}
		</div>
	);
}
