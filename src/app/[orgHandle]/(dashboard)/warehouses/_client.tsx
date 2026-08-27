"use client";

import { useState } from "react";
import { Plus, Trash2, Warehouse as WarehouseIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useConfirm } from "@/context/ConfirmDialogContext";
import { useWarehouses, useCreateWarehouse, useDeleteWarehouse } from "@/features/warehouse/hooks/useWarehouses";
import type { Warehouse, WarehousePayload } from "@/features/warehouse/types";

export default function WarehousesPage() {
	const { data: branches = [] } = useBranches();
	const { data: warehouses = [], isLoading } = useWarehouses();
	const createWarehouse = useCreateWarehouse();
	const deleteWarehouse = useDeleteWarehouse();
	const confirm = useConfirm();
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, reset } = useForm<WarehousePayload>();

	if (branches.length === 0) {
		return <EmptyState icon={WarehouseIcon} title="Create a branch first" description="Warehouses belong to a branch." />;
	}

	const branchName = (id: string) => branches.find(b => b.id === id)?.name ?? "—";

	const onSubmit = (values: WarehousePayload) => {
		createWarehouse.mutate(values, { onSuccess: () => { reset(); setModalOpen(false); } });
	};

	async function handleDelete(warehouse: Warehouse) {
		const result = await confirm({
			title: "Delete this warehouse?",
			description: `This will permanently delete "${warehouse.name}". Deletion is blocked if it still has stock — move or clear inventory first.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (result) deleteWarehouse.mutate(warehouse.id);
	}

	const columns: Column<Warehouse>[] = [
		{ header: "Name", accessor: w => <span className="font-medium text-slate-900">{w.name}</span> },
		{ header: "Branch", accessor: w => branchName(w.branchId) },
		{ header: "Address", accessor: w => w.address ?? "—" },
		{ header: "Default", accessor: w => (w.isDefault ? <Badge tone="success">Default</Badge> : "—") },
		{
			header: "",
			accessor: w => (
				<button onClick={() => handleDelete(w)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Warehouses"
				description="Stock locations used for inventory, purchases and sales."
				action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add warehouse</Button>}
			/>

			<DataTable columns={columns} data={warehouses} isLoading={isLoading} rowKey={w => w.id} emptyTitle="No warehouses yet" />

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add warehouse">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<SelectField id="warehouse-branch" label="Branch" required {...register("branchId", { required: true })} defaultValue="">
						<option value="" disabled>Select branch</option>
						{branches.map(b => (
							<option key={b.id} value={b.id}>{b.name}</option>
						))}
					</SelectField>
					<TextField id="warehouse-name" label="Warehouse name" required {...register("name", { required: true })} />
					<TextField id="warehouse-address" label="Address" {...register("address")} />
					<label className="flex items-center gap-2 text-sm text-slate-600">
						<input type="checkbox" {...register("isDefault")} className="h-4 w-4 rounded border-slate-300" />
						Set as default warehouse for this branch
					</label>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button type="submit" isLoading={createWarehouse.isPending}>Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
