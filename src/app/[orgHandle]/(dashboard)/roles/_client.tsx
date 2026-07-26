"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Lock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { TextField } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import {
	useRoles,
	usePermissions,
	useCreateRole,
	useUpdateRole,
	useDeleteRole,
} from "@/features/role/hooks/useRoles";
import type { Role } from "@/features/role/types";

export default function RolesPage() {
	const { data: roles = [], isLoading } = useRoles();
	const { data: permissions = [] } = usePermissions();
	const createRole = useCreateRole();
	const updateRole = useUpdateRole();
	const deleteRole = useDeleteRole();

	const [modalOpen, setModalOpen] = useState(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [name, setName] = useState("");
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

	const togglePermission = (id: string) => {
		setSelectedPermissions(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));
	};

	const openCreateModal = () => {
		setEditingRole(null);
		setName("");
		setSelectedPermissions([]);
		setModalOpen(true);
	};

	const openEditModal = (role: Role) => {
		setEditingRole(role);
		setName(role.name);
		setSelectedPermissions((role.permissions ?? []).map(p => p.permission.id));
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setEditingRole(null);
	};

	const handleSubmit = () => {
		if (editingRole) {
			updateRole.mutate(
				{ id: editingRole.id, payload: { name, permissionIds: selectedPermissions } },
				{ onSuccess: closeModal },
			);
			return;
		}

		createRole.mutate(
			{ name, permissionIds: selectedPermissions },
			{ onSuccess: closeModal },
		);
	};

	const isSaving = createRole.isPending || updateRole.isPending;

	const columns: Column<Role>[] = [
		{ header: "Role", accessor: r => <span className="font-medium text-slate-900">{r.name}</span> },
		{ header: "System role", accessor: r => (r.systemRole ? <Badge tone="info">{r.systemRole}</Badge> : <Badge>Custom</Badge>) },
		{ header: "Permissions", accessor: r => `${r.permissions?.length ?? 0} granted` },
		{
			header: "",
			accessor: r => (
				<div className="flex items-center gap-1">
					<button
						onClick={() => openEditModal(r)}
						title="Edit permissions"
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
						<Pencil className="h-4 w-4" />
					</button>
					{r.isSystem ? (
						<span title="System roles can't be deleted" className="rounded-lg p-1.5 text-slate-300">
							<Lock className="h-4 w-4" />
						</span>
					) : (
						<button
							onClick={() => deleteRole.mutate(r.id)}
							title="Delete role"
							className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
							<Trash2 className="h-4 w-4" />
						</button>
					)}
				</div>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Roles & Access"
				description="Create custom roles and control what each role can do."
				action={<Button onClick={openCreateModal}><Plus className="h-4 w-4" /> Add role</Button>}
			/>

			<DataTable columns={columns} data={roles} isLoading={isLoading} rowKey={r => r.id} emptyTitle="No custom roles yet" />

			<Modal open={modalOpen} onClose={closeModal} title={editingRole ? `Edit ${editingRole.name}` : "Add role"} size="lg">
				<div className="space-y-4">
					<TextField
						id="role-name"
						label="Role name"
						required
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="e.g. Floor Supervisor"
						disabled={!!editingRole?.systemRole && editingRole.systemRole !== "CUSTOM"}
					/>
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
						<Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
						<Button onClick={handleSubmit} isLoading={isSaving} disabled={!name}>Save</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
