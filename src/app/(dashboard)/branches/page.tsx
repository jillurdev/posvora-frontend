"use client";

import { useState } from "react";
import { Plus, Trash2, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useShops } from "@/features/shop/hooks/useShops";
import { useBranches, useCreateBranch, useDeleteBranch } from "@/features/branch/hooks/useBranches";
import type { Branch, BranchPayload } from "@/features/branch/types";

export default function BranchesPage() {
	const { data: shops = [] } = useShops();
	const { data: branches = [], isLoading } = useBranches();
	const createBranch = useCreateBranch();
	const deleteBranch = useDeleteBranch();
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, reset } = useForm<BranchPayload>();

	if (shops.length === 0) {
		return <EmptyState icon={Building2} title="Create a shop first" description="Branches belong to a shop." />;
	}

	const shopName = (id: string) => shops.find(s => s.id === id)?.name ?? "—";

	const onSubmit = (values: BranchPayload) => {
		createBranch.mutate(values, { onSuccess: () => { reset(); setModalOpen(false); } });
	};

	const columns: Column<Branch>[] = [
		{ header: "Name", accessor: b => <span className="font-medium text-slate-900">{b.name}</span> },
		{ header: "Shop", accessor: b => shopName(b.shopId) },
		{ header: "Code", accessor: b => b.code ?? "—" },
		{ header: "Address", accessor: b => b.address ?? "—" },
		{ header: "Phone", accessor: b => b.phone ?? "—" },
		{
			header: "",
			accessor: b => (
				<button onClick={() => deleteBranch.mutate(b.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Branches"
				description="Physical outlets or counters under each shop."
				action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add branch</Button>}
			/>

			<DataTable columns={columns} data={branches} isLoading={isLoading} rowKey={b => b.id} emptyTitle="No branches yet" />

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add branch">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormField label="Shop" required>
						<Select {...register("shopId", { required: true })} defaultValue="">
							<option value="" disabled>Select shop</option>
							{shops.map(s => (
								<option key={s.id} value={s.id}>{s.name}</option>
							))}
						</Select>
					</FormField>
					<FormField label="Branch name" required>
						<Input {...register("name", { required: true })} />
					</FormField>
					<FormField label="Code">
						<Input {...register("code")} />
					</FormField>
					<FormField label="Address">
						<Input {...register("address")} />
					</FormField>
					<FormField label="Phone">
						<Input {...register("phone")} />
					</FormField>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button type="submit" isLoading={createBranch.isPending}>Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
