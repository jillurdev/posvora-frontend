"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextField, TextareaField, SelectField } from "@/components/ui/Field";
import {
	useAdminAnnouncements,
	useAdminOrganizations,
	useCreateAnnouncement,
	useToggleAnnouncement,
} from "@/features/super-admin/hooks/useSuperAdmin";
import type { Announcement } from "@/features/super-admin/types";
import { formatDateTime } from "@/lib/utils";

export default function AdminMessagesPage() {
	const { data: announcements = [], isLoading } = useAdminAnnouncements();
	const { data: orgsData } = useAdminOrganizations({ limit: 100 });
	const { mutate: send, isPending } = useCreateAnnouncement();
	const { mutate: toggle } = useToggleAnnouncement();

	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [organizationId, setOrganizationId] = useState("");

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !message) return;
		send(
			{ title, message, organizationId: organizationId || undefined },
			{
				onSuccess: () => {
					setTitle("");
					setMessage("");
					setOrganizationId("");
				},
			},
		);
	};

	const columns: Column<Announcement>[] = [
		{ header: "Title", accessor: a => <span className="font-medium text-slate-900">{a.title}</span> },
		{ header: "Message", accessor: a => <span className="line-clamp-2 max-w-sm text-slate-600">{a.message}</span> },
		{
			header: "Audience",
			accessor: a =>
				a.organization ? (
					<Badge tone="info">{a.organization.name}</Badge>
				) : (
					<Badge tone="default">Everyone</Badge>
				),
		},
		{ header: "Sent", accessor: a => formatDateTime(a.createdAt) },
		{
			header: "Status",
			accessor: a => (
				<button
					type="button"
					onClick={() => toggle({ id: a.id, isActive: !a.isActive })}
					className="cursor-pointer"
				>
					<Badge tone={a.isActive ? "success" : "default"}>{a.isActive ? "Active" : "Hidden"}</Badge>
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader title="Messages" description="Send a broadcast to everyone, or target a single organization." />

			<form onSubmit={onSubmit} className="mb-8 max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
				<SelectField
					id="announcement-target"
					label="Send to"
					value={organizationId}
					onChange={e => setOrganizationId(e.target.value)}
				>
					<option value="">Everyone (broadcast)</option>
					{orgsData?.data.map(org => (
						<option key={org.id} value={org.id}>
							{org.name}
						</option>
					))}
				</SelectField>
				<TextField id="announcement-title" label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
				<TextareaField
					id="announcement-message"
					label="Message"
					value={message}
					onChange={e => setMessage(e.target.value)}
					rows={4}
					required
				/>
				<Button type="submit" isLoading={isPending}>
					Send message
				</Button>
			</form>

			<h2 className="mb-3 text-sm font-semibold text-slate-900">Sent messages</h2>
			<DataTable columns={columns} data={announcements} isLoading={isLoading} rowKey={a => a.id} emptyTitle="No messages sent yet" />
		</div>
	);
}
