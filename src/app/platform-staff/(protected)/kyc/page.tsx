"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { useConfirm } from "@/context/ConfirmDialogContext";
import {
	useAdminKycDocuments,
	useAdminReviewKycDocument,
} from "@/features/platform-staff/hooks/useSuperAdmin";
import type { KycDocument } from "@/features/platform-staff/types";
import { formatDateTime } from "@/lib/utils";

const STATUS_TONE: Record<string, "warning" | "success" | "danger"> = {
	PENDING: "warning",
	APPROVED: "success",
	REJECTED: "danger",
};

export default function AdminKycPage() {
	const [status, setStatus] = useState("PENDING");
	const { data: documents = [], isLoading } = useAdminKycDocuments(status || undefined);
	const { mutate: review, isPending } = useAdminReviewKycDocument();
	const confirm = useConfirm();

	const onApprove = async (doc: KycDocument) => {
		const result = await confirm({
			title: "Approve this document?",
			description: `This marks the ${doc.type.replace("_", " ").toLowerCase()} submitted by ${doc.organization?.name ?? "this organization"} as verified.`,
			confirmLabel: "Approve",
		});
		if (result) review({ id: doc.id, approve: true });
	};

	const onReject = async (doc: KycDocument) => {
		const result = await confirm({
			title: "Reject this document?",
			description: `This marks the ${doc.type.replace("_", " ").toLowerCase()} submitted by ${doc.organization?.name ?? "this organization"} as rejected.`,
			confirmLabel: "Reject",
			variant: "danger",
			input: { label: "Reason (shown to the organization)", placeholder: "e.g. Document is blurry / expired / mismatched name" },
		});
		if (result) review({ id: doc.id, approve: false, note: result.note || undefined });
	};

	const columns: Column<KycDocument>[] = [
		{ header: "Organization", accessor: d => d.organization?.name ?? "—" },
		{ header: "Document", accessor: d => d.type.replace("_", " ") },
		{
			header: "File",
			accessor: d => (
				<a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
					View
				</a>
			),
		},
		{ header: "Submitted by", accessor: d => d.submittedBy?.name ?? "—" },
		{ header: "Status", accessor: d => <Badge tone={STATUS_TONE[d.status]}>{d.status}</Badge> },
		{ header: "Submitted", accessor: d => formatDateTime(d.createdAt) },
		{
			header: "Actions",
			accessor: d =>
				d.status === "PENDING" ? (
					<div className="flex gap-2">
						<Button size="sm" onClick={() => onApprove(d)} disabled={isPending}>
							Approve
						</Button>
						<Button size="sm" variant="outline" onClick={() => onReject(d)} disabled={isPending}>
							Reject
						</Button>
					</div>
				) : (
					<span className="text-xs text-slate-400">Reviewed</span>
				),
		},
	];

	return (
		<div>
			<PageHeader
				title="KYC Verification"
				description="Review NID / Passport / Trade License documents submitted by organizations."
			/>

			<div className="mb-4 max-w-xs">
				<Select value={status} onChange={e => setStatus(e.target.value)}>
					<option value="PENDING">Pending review</option>
					<option value="APPROVED">Approved</option>
					<option value="REJECTED">Rejected</option>
					<option value="">All</option>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={documents}
				isLoading={isLoading}
				rowKey={d => d.id}
				emptyTitle="No documents in this status"
			/>
		</div>
	);
}
