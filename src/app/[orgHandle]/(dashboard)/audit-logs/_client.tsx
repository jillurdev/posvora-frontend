"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/common/Pagination";
import { useAuditLogs } from "@/features/audit-log/hooks/useAuditLogs";
import type { AuditLog } from "@/features/audit-log/types";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogsPage() {
	const { page, limit, setPage } = usePagination(20);
	const { data, isLoading } = useAuditLogs({ page, limit });

	const columns: Column<AuditLog>[] = [
		{ header: "Time", accessor: l => formatDateTime(l.createdAt) },
		{ header: "Action", accessor: l => l.action },
		{ header: "Entity", accessor: l => `${l.entity}${l.entityId ? ` #${l.entityId.slice(0, 8)}` : ""}` },
		{ header: "User", accessor: l => l.userId?.slice(0, 8) ?? "System" },
	];

	return (
		<div>
			<PageHeader title="Audit Logs" description="Track every important action taken in your organization." />
			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={l => l.id} emptyTitle="No activity recorded yet" />
			{data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
		</div>
	);
}
