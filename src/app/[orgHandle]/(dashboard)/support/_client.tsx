"use client";

import { useState } from "react";
import Link from "next/link";
import { LifeBuoy, Plus, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useSupportTickets } from "@/features/support/hooks/useSupportTickets";
import { CreateTicketModal } from "@/features/support/components/CreateTicketModal";
import { STATUS_LABEL, STATUS_TONE, PRIORITY_TONE } from "@/features/support/utils";
import { formatDateTime } from "@/lib/utils";

export default function SupportPage() {
	const [createOpen, setCreateOpen] = useState(false);
	const { data: tickets = [], isLoading } = useSupportTickets();

	return (
		<div>
			<PageHeader
				title="Support"
				description="Raise an issue or follow up with our team."
				action={
					<Button size="sm" onClick={() => setCreateOpen(true)}>
						<Plus className="h-4 w-4" /> New ticket
					</Button>
				}
			/>

			{isLoading ? (
				<Spinner />
			) : tickets.length === 0 ? (
				<EmptyState
					icon={LifeBuoy}
					title="No support tickets yet"
					description="Raised an issue with us? It'll show up here."
					action={
						<Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
							<Plus className="h-4 w-4" /> New ticket
						</Button>
					}
				/>
			) : (
				<div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
					{tickets.map(t => (
						<Link
							key={t.id}
							href={`/support/${t.id}`}
							className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-slate-50"
						>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-slate-900">{t.subject}</p>
								<div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
									<span>{formatDateTime(t.createdAt)}</span>
									{!!t._count?.replies && (
										<span className="flex items-center gap-1">
											<MessageSquare className="h-3 w-3" /> {t._count.replies}
										</span>
									)}
								</div>
							</div>
							<div className="flex shrink-0 items-center gap-2">
								<Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>
								<Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
							</div>
						</Link>
					))}
				</div>
			)}

			<CreateTicketModal open={createOpen} onClose={() => setCreateOpen(false)} />
		</div>
	);
}
