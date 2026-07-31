"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { FileUploadPreview } from "@/components/common/FileUploadPreview";
import { useKycDocuments, useSubmitKycDocument } from "../hooks/useKyc";
import type { KycDocumentType } from "../types";
import { formatDateTime } from "@/lib/utils";

const STATUS_META: Record<string, { label: string; tone: "warning" | "success" | "danger" | "default"; icon: typeof ShieldCheck }> = {
	UNVERIFIED: { label: "Not verified", tone: "default", icon: ShieldQuestion },
	PENDING: { label: "Under review", tone: "warning", icon: ShieldAlert },
	VERIFIED: { label: "Verified", tone: "success", icon: ShieldCheck },
	REJECTED: { label: "Rejected — resubmit", tone: "danger", icon: ShieldAlert },
};

export function KycVerificationSection() {
	const { data, isLoading } = useKycDocuments();
	const { mutateAsync: submit } = useSubmitKycDocument();
	const [type, setType] = useState<KycDocumentType>("NID");

	const status = data?.verificationStatus ?? "UNVERIFIED";
	const meta = STATUS_META[status];
	const Icon = meta.icon;

	if (isLoading) return null;

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-sm font-semibold text-slate-700">Business verification (KYC)</h2>
				<Badge tone={meta.tone} className="flex items-center gap-1">
					<Icon className="h-3 w-3" /> {meta.label}
				</Badge>
			</div>

			<p className="mb-4 -mt-2 text-sm text-slate-500">
				Upload your NID, passport, or trade license so we can verify your business. Verified
				organizations get a trust badge and higher transaction limits — this also helps us keep
				the platform free of fraudulent shops.
			</p>

			{status !== "VERIFIED" && (
				<div className="mb-6 space-y-3">
					<FormField label="Document type" className="max-w-[220px]">
						<Select value={type} onChange={e => setType(e.target.value as KycDocumentType)}>
							<option value="NID">National ID</option>
							<option value="PASSPORT">Passport</option>
							<option value="TRADE_LICENSE">Trade License</option>
						</Select>
					</FormField>

					<FileUploadPreview
						label="Document file"
						hint="JPEG, PNG, WEBP or PDF, up to 10MB. We review this manually."
						onConfirm={file => submit({ type, file })}
					/>
				</div>
			)}

			{!!data?.documents.length && (
				<div className="space-y-2">
					<h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Submission history</h3>
					{data.documents.map(doc => (
						<div
							key={doc.id}
							className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
						>
							<div>
								<span className="font-medium text-slate-700">{doc.type.replace("_", " ")}</span>
								<span className="ml-2 text-slate-400">{formatDateTime(doc.createdAt)}</span>
								{doc.status === "REJECTED" && doc.rejectionReason && (
									<p className="mt-0.5 text-xs text-red-600">Reason: {doc.rejectionReason}</p>
								)}
							</div>
							<Badge tone={STATUS_META[doc.status]?.tone ?? "default"}>{doc.status}</Badge>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
