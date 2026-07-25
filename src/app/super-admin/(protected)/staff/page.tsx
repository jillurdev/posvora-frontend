"use client";

import { useState } from "react";
import { Plus, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminCreateStaff, useAdminStaff, useAdminToggleStaff } from "@/features/super-admin/hooks/useSuperAdmin";
import type { CreatePlatformAdminPayload, PlatformAdmin } from "@/features/super-admin/types";
import { formatDateTime } from "@/lib/utils";

const emptyForm: CreatePlatformAdminPayload = { name: "", email: "", phone: "", password: "", role: "SUPPORT" };

const roleTone: Record<PlatformAdmin["role"], "info" | "default" | "success"> = {
	OWNER: "success",
	ADMIN: "info",
	SUPPORT: "default",
};

export default function PlatformStaffPage() {
	const { admin: currentAdmin } = useAdminAuth();
	const isOwner = currentAdmin?.role === "OWNER";

	const { data: staff, isLoading, error } = useAdminStaff();
	const createStaff = useAdminCreateStaff();
	const toggleStaff = useAdminToggleStaff();

	const [modalOpen, setModalOpen] = useState(false);
	const [form, setForm] = useState<CreatePlatformAdminPayload>(emptyForm);

	// Non-owners are blocked by the backend (@AdminRoles(OWNER)) — this page
	// still renders for them so they get a clear explanation instead of a
	// raw 403, but no data is fetched/shown.
	if (!isOwner) {
		return (
			<div>
				<PageHeader title="Platform Staff" description="People with administrative access to the Posvora platform." />
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
					<ShieldAlert className="h-8 w-8 text-slate-300" />
					<p className="mt-3 text-sm font-medium text-slate-700">Only the platform owner can manage staff</p>
					<p className="mt-1 max-w-sm text-sm text-slate-500">
						Your account doesn&apos;t have permission to view or manage other platform staff members. Contact the
						platform owner if you need access changed.
					</p>
				</div>
			</div>
		);
	}

	const handleSubmit = () => {
		createStaff.mutate(form, {
			onSuccess: () => {
				setModalOpen(false);
				setForm(emptyForm);
			},
		});
	};

	const columns: Column<PlatformAdmin>[] = [
		{ header: "Name", accessor: a => <span className="font-medium text-slate-900">{a.name}</span> },
		{ header: "Email", accessor: a => a.email },
		{ header: "Phone", accessor: a => a.phone ?? "—" },
		{ header: "Role", accessor: a => <Badge tone={roleTone[a.role]}>{a.role}</Badge> },
		{ header: "Last login", accessor: a => (a.lastLoginAt ? formatDateTime(a.lastLoginAt) : "Never") },
		{ header: "Status", accessor: a => (a.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Deactivated</Badge>) },
		{
			header: "",
			accessor: a => {
				if (a.role === "OWNER") {
					return <span className="text-xs text-slate-400">Platform owner — protected</span>;
				}
				return (
					<Button
						variant="outline"
						size="sm"
						isLoading={toggleStaff.isPending}
						onClick={() => toggleStaff.mutate({ id: a.id, isActive: !a.isActive })}>
						{a.isActive ? "Deactivate" : "Reactivate"}
					</Button>
				);
			},
		},
	];

	return (
		<div>
			<PageHeader
				title="Platform Staff"
				description="People with administrative access to the Posvora platform."
				action={
					<Button onClick={() => setModalOpen(true)}>
						<Plus className="mr-1.5 h-4 w-4" /> Add staff member
					</Button>
				}
			/>

			{error ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
					<ShieldAlert className="h-8 w-8 text-slate-300" />
					<p className="mt-3 text-sm font-medium text-slate-700">Couldn&apos;t load staff</p>
					<p className="mt-1 text-sm text-slate-500">{(error as Error).message}</p>
				</div>
			) : (
				<DataTable columns={columns} data={staff ?? []} isLoading={isLoading} rowKey={a => a.id} emptyTitle="No platform staff found" />
			)}

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add platform staff member">
				<div className="space-y-4">
					<FormField label="Full name" required>
						<Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
					</FormField>
					<FormField label="Email" required>
						<Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
					</FormField>
					<FormField label="Phone">
						<Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
					</FormField>
					<FormField
						label="Role"
						required
						hint="Admin can manage organizations, plans and subscriptions. Support can only handle support tickets.">
						<Select
							value={form.role}
							onChange={e => setForm(f => ({ ...f, role: e.target.value as CreatePlatformAdminPayload["role"] }))}>
							<option value="SUPPORT">Support</option>
							<option value="ADMIN">Admin</option>
						</Select>
					</FormField>
					<FormField label="Temporary password" required hint="At least 8 characters. They can change it after logging in.">
						<Input
							type="password"
							value={form.password}
							onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
						/>
					</FormField>
					<Button className="w-full" isLoading={createStaff.isPending} onClick={handleSubmit}>
						Create account
					</Button>
				</div>
			</Modal>
		</div>
	);
}
