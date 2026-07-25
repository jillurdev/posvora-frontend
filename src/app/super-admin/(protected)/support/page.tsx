"use client";

import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useAdminSupportTickets } from "@/features/super-admin/hooks/useSuperAdmin";
import { STATUS_LABEL, STATUS_TONE, PRIORITY_TONE } from "@/features/support/utils";
import type { SupportTicket } from "@/features/support/types";
import { formatDateTime } from "@/lib/utils";

export default function AdminSupportTicketsPage() {
	const { data: tickets = [], isLoading } = useAdminSupportTickets();

	const columns: Column<SupportTicket>[] = [
		{
			header: "Subject",
			accessor: t => (
				<Link href={`/super-admin/support/${t.id}`} className="font-medium text-slate-900 hover:underline">
					{t.subject}
				</Link>
			),
		},
		{
			header: "From",
			accessor: t => t.organizationId ? (t.createdById ? "Org user" : "Org") : `${t.guestName ?? "Guest"} (guest)`,
		},
		{ header: "Priority", accessor: t => <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge> },
		{ header: "Status", accessor: t => <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge> },
		{ header: "Opened", accessor: t => formatDateTime(t.createdAt) },
	];

	return (
		<div>
			<PageHeader title="Support Tickets" description="All tickets raised by organizations and guests." />
			<DataTable columns={columns} data={tickets} isLoading={isLoading} rowKey={t => t.id} emptyTitle="No support tickets" />
		</div>
	);
}
