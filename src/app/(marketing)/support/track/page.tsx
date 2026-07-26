"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, LifeBuoy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TextField } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { supportApi } from "@/features/support/api";
import { STATUS_LABEL, STATUS_TONE, PRIORITY_TONE } from "@/features/support/utils";
import { formatDateTime, cn } from "@/lib/utils";
import { toast } from "sonner";

function LookupForm({ onLookup }: { onLookup: (id: string, token: string) => void }) {
	const [id, setId] = useState("");
	const [token, setToken] = useState("");

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				if (id.trim() && token.trim()) onLookup(id.trim(), token.trim());
			}}
			className="mx-auto max-w-md space-y-4"
		>
			<TextField
				id="ticket-id"
				label="Ticket ID"
				required
				value={id}
				onChange={e => setId(e.target.value)}
				placeholder="e.g. 3f9a1c2b-..."
			/>
			<TextField
				id="ticket-token"
				label="Access token"
				required
				hint="From the link we gave you when you submitted the ticket."
				value={token}
				onChange={e => setToken(e.target.value)}
				placeholder="Paste your access token"
			/>
			<Button type="submit" className="w-full">
				View ticket
			</Button>
		</form>
	);
}

function TicketThread({ id, token }: { id: string; token: string }) {
	const qc = useQueryClient();
	const [message, setMessage] = useState("");

	const { data: ticket, isLoading, isError } = useQuery({
		queryKey: ["guest-ticket", id, token],
		queryFn: () => supportApi.getGuestOne(id, token),
		retry: false,
	});

	const reply = useMutation({
		mutationFn: (msg: string) => supportApi.replyGuest(id, token, msg),
		onSuccess: () => {
			setMessage("");
			qc.invalidateQueries({ queryKey: ["guest-ticket", id, token] });
		},
		onError: (err: Error) => toast.error(err.message || "Could not send message"),
	});

	if (isLoading) return <Spinner />;

	if (isError || !ticket) {
		return (
			<EmptyState
				icon={LifeBuoy}
				title="Ticket not found"
				description="Double-check the ticket ID and access token from your confirmation link."
			/>
		);
	}

	const isClosed = ticket.status === "CLOSED";

	return (
		<div className="mx-auto max-w-2xl">
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
							r.isStaff ? "border-slate-200 bg-slate-50" : "ml-auto border-slate-900 bg-slate-900 text-white",
						)}
					>
						<div className="flex items-center justify-between gap-4">
							<span className={cn("text-xs font-medium", r.isStaff ? "text-slate-500" : "text-slate-300")}>
								{r.isStaff ? "Support Team" : r.authorName || "You"}
							</span>
							<span className="text-xs text-slate-400">{formatDateTime(r.createdAt)}</span>
						</div>
						<p className={cn("mt-1 whitespace-pre-wrap text-sm", r.isStaff ? "text-slate-700" : "text-white")}>
							{r.message}
						</p>
					</div>
				))}
			</div>

			{isClosed ? (
				<p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-center text-sm text-slate-400">
					This ticket is closed. Send us a new message from the Contact page if you need further help.
				</p>
			) : (
				<form
					onSubmit={e => {
						e.preventDefault();
						if (message.trim()) reply.mutate(message);
					}}
					className="mt-6 flex items-end gap-2"
				>
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

function TrackSupportContent() {
	const params = useSearchParams();
	const [manual, setManual] = useState<{ id: string; token: string } | null>(null);

	const id = params.get("id") ?? manual?.id;
	const token = params.get("token") ?? manual?.token;

	return (
		<div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
			<span className="text-sm font-medium text-slate-400">Support</span>
			<h1 className="mt-2 text-3xl font-semibold text-slate-900">Track your ticket</h1>
			<p className="mt-3 max-w-lg text-slate-500">
				Enter the ticket ID and access token from your confirmation link to view replies and respond.
			</p>

			<div className="mt-10">
				{id && token ? <TicketThread id={id} token={token} /> : <LookupForm onLookup={(i, t) => setManual({ id: i, token: t })} />}
			</div>
		</div>
	);
}

export default function TrackSupportPage() {
	return (
		<Suspense fallback={<Spinner />}>
			<TrackSupportContent />
		</Suspense>
	);
}
