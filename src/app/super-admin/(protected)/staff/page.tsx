"use client";

import { useState } from "react";
import { Plus, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminStaff, useToggleStaff } from "@/features/super-admin/hooks/useSuperAdmin";
import { CreateStaffModal } from "@/features/super-admin/components/CreateStaffModal";
import { ResetStaffPasswordModal } from "@/features/super-admin/components/ResetStaffPasswordModal";
import type { SuperAdminStaff } from "@/features/super-admin/staff-types";
import { formatDateTime } from "@/lib/utils";

export default function AdminStaffPage() {
	const { admin } = useAdminAuth();
	const { data: staff = [], isLoading } = useAdminStaff();
	const toggle = useToggleStaff();
	const [createOpen, setCreateOpen] = useState(false);
	const [resetTarget, setResetTarget] = useState<SuperAdminStaff | null>(null);

	const columns: Column<SuperAdminStaff>[] = [
		{
			header: "Name",
			accessor: s => (
				<div>
					<p className="font-medium text-slate-900">
						{s.name} {s.id === admin?.id && <span className="text-xs font-normal text-slate-400">(you)</span>}
					</p>
					<p className="text-xs text-slate-400">{s.email}</p>
				</div>
			),
		},
		{ header: "Phone", accessor: s => s.phone || "—" },
		{ header: "Status", accessor: s => (s.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Deactivated</Badge>) },
		{ header: "Last login", accessor: s => (s.lastLoginAt ? formatDateTime(s.lastLoginAt) : "Never") },
		{
			header: "",
			accessor: s => (
				<div className="flex justify-end gap-2">
					<Button size="sm" variant="outline" onClick={() => setResetTarget(s)}>
						<KeyRound className="h-3.5 w-3.5" /> Reset password
					</Button>
					<Button
						size="sm"
						variant={s.isActive ? "outline" : "secondary"}
						isLoading={toggle.isPending}
						disabled={s.id === admin?.id && s.isActive}
						onClick={() => toggle.mutate({ id: s.id, isActive: !s.isActive })}
					>
						{s.isActive ? "Deactivate" : "Reactivate"}
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Platform Staff"
				description="People who can access this admin panel."
				action={
					<Button size="sm" onClick={() => setCreateOpen(true)}>
						<Plus className="h-4 w-4" /> Add staff
					</Button>
				}
			/>

			<DataTable columns={columns} data={staff} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No staff accounts yet" />

			<CreateStaffModal open={createOpen} onClose={() => setCreateOpen(false)} />
			<ResetStaffPasswordModal
				staffId={resetTarget?.id ?? null}
				staffName={resetTarget?.name}
				onClose={() => setResetTarget(null)}
			/>
		</div>
	);
}
