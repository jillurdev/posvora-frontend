"use client";

import { useState } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useRoles, usePermissions, useCreateRole, useDeleteRole } from "@/features/role/hooks/useRoles";
import type { Role } from "@/features/role/types";

export default function RolesPage() {
	const { data: roles = [], isLoading } = useRoles();
	const { data: permissions = [] } = usePermissions();
	const createRole = useCreateRole();
	const deleteRole = useDeleteRole();
	const [modalOpen, setModalOpen] = useState(false);
	const [name, setName] = useState("");
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

	const togglePermission = (id: string) => {
		setSelectedPermissions(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));
	};

	const handleSubmit = () => {
		createRole.mutate(
			{ name, permissionIds: selectedPermissions },
			{
				onSuccess: () => {
					setName("");
					setSelectedPermissions([]);
					setModalOpen(false);
				},
			},
		);
	};

	const columns: Column<Role>[] = [
		{ header: "Role", accessor: r => <span className="font-medium text-slate-900">{r.name}</span> },
		{ header: "System role", accessor: r => (r.systemRole ? <Badge tone="info">{r.systemRole}</Badge> : <Badge>Custom</Badge>) },
		{ header: "Permissions", accessor: r => `${r.permissions?.length ?? 0} granted` },
		{
			header: "",
			accessor: r => (
				<button onClick={() => deleteRole.mutate(r.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Roles & Access"
				description="Create custom roles and control what each role can do."
				action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add role</Button>}
			/>

			<DataTable columns={columns} data={roles} isLoading={isLoading} rowKey={r => r.id} emptyTitle="No custom roles yet" />

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add role" size="lg">
				<div className="space-y-4">
					<FormField label="Role name" required>
						<Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Floor Supervisor" />
					</FormField>
					<FormField label="Permissions">
						<div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
							{permissions.map(p => (
								<label key={p.id} className="flex items-center gap-2 text-sm text-slate-600">
									<input
										type="checkbox"
										checked={selectedPermissions.includes(p.id)}
										onChange={() => togglePermission(p.id)}
										className="h-4 w-4 rounded border-slate-300"
									/>
									{p.module} · {p.action}
								</label>
							))}
							{permissions.length === 0 && <p className="text-sm text-slate-400">No permissions available.</p>}
						</div>
					</FormField>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button onClick={handleSubmit} isLoading={createRole.isPending} disabled={!name}>Save</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
