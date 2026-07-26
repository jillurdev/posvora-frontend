"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/common/Pagination";
import { useAuditLogs } from "@/features/audit-log/hooks/useAuditLogs";
import type { AuditLog } from "@/features/audit-log/types";
import { formatDateTime } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";

function ChangesModal({
	log,
	onClose,
}: {
	log: AuditLog;
	onClose: () => void;
}) {
	const entries = Object.entries(log.changes ?? {});

	return (
		<Modal open onClose={onClose} title={`${log.action} — changes`} size="sm">
			<div className="max-h-96 space-y-2 overflow-y-auto">
				{entries.map(([key, value]) => (
					<div
						key={key}
						className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 text-sm">
						<span className="shrink-0 font-medium text-slate-600">{key}</span>
						<span className="break-all text-right text-slate-800">
							{value === "" || value == null ? "—" : String(value)}
						</span>
					</div>
				))}
			</div>
		</Modal>
	);
}

export default function AuditLogsPage() {
	const { page, limit, setPage } = usePagination(20);
	const { data, isLoading } = useAuditLogs({ page, limit });
	const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

	const columns: Column<AuditLog>[] = [
		{ header: "Time", accessor: l => formatDateTime(l.createdAt) },
		{
			header: "User",
			accessor: l => (
				<div className="flex flex-col">
					<span className="font-medium">
						{l.user?.name ?? (l.userId ? l.userId.slice(0, 8) : "System")}
					</span>
					{l.user?.email && (
						<span className="text-xs text-slate-500">{l.user.email}</span>
					)}
				</div>
			),
		},
		{
			header: "Action",
			accessor: l => (
				<div className="flex flex-col">
					<span className="font-medium">{l.action}</span>
					<span className="text-xs text-slate-500">{l.module}</span>
				</div>
			),
		},
		{
			header: "Entity",
			accessor: l => (l.entityId ? `#${l.entityId.slice(0, 8)}` : "-"),
		},
		{
			header: "Changes",
			accessor: l => {
				const count = Object.keys(l.changes ?? {}).length;
				if (!count) return <span className="text-slate-400">-</span>;
				return (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setSelectedLog(l)}
						className="h-7 gap-1.5 px-2 text-xs">
						<Eye className="h-3.5 w-3.5" />
						{count} field{count > 1 ? "s" : ""}
					</Button>
				);
			},
		},
		{ header: "IP", accessor: l => l.ipAddress ?? "-" },
	];

	return (
		<div>
			<PageHeader
				title="Audit Logs"
				description="Track every important action taken in your organization."
			/>
			<DataTable
				columns={columns}
				data={data?.data ?? []}
				isLoading={isLoading}
				rowKey={l => l.id}
				emptyTitle="No activity recorded yet"
			/>
			{data?.meta && (
				<Pagination
					page={data.meta.page}
					totalPages={data.meta.totalPages}
					onPageChange={setPage}
				/>
			)}
			{selectedLog && (
				<ChangesModal log={selectedLog} onClose={() => setSelectedLog(null)} />
			)}
		</div>
	);
}
