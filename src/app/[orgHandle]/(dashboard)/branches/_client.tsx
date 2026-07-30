"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/Field";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useConfirm } from "@/context/ConfirmDialogContext";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useShops } from "@/features/shop/hooks/useShops";
import {
	useBranches,
	useCreateBranch,
	useUpdateBranch,
	useDeleteBranch,
} from "@/features/branch/hooks/useBranches";
import type { Branch, BranchPayload } from "@/features/branch/types";

const ALL_SHOPS = "__all__";

export default function BranchesPage() {
	const { data: shops = [] } = useShops();
	const { activeShopId } = useActiveShop();
	const { data: allBranches = [], isLoading } = useBranches();
	const createBranch = useCreateBranch();
	const updateBranch = useUpdateBranch();
	const deleteBranch = useDeleteBranch();
	const confirm = useConfirm();

	// Defaults to whichever shop is currently active (same as Sales,
	// Inventory, and the POS screen) so this list isn't a surprising
	// cross-shop jumble — but "All shops" is still one click away for
	// owners who genuinely want the full picture.
	const [shopFilter, setShopFilter] = useState<string>(activeShopId ?? ALL_SHOPS);
	useEffect(() => {
		if (activeShopId) setShopFilter(activeShopId);
	}, [activeShopId]);

	const branches = shopFilter === ALL_SHOPS ? allBranches : allBranches.filter(b => b.shopId === shopFilter);

	const [modalOpen, setModalOpen] = useState(false);
	const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
	const { register, handleSubmit, reset } = useForm<BranchPayload>();

	if (shops.length === 0) {
		return (
			<EmptyState
				icon={Building2}
				title="Create a shop first"
				description="Branches belong to a shop."
			/>
		);
	}

	const shopName = (id: string) => shops.find(s => s.id === id)?.name ?? "—";

	function openCreate() {
		setEditingBranch(null);
		reset({ shopId: activeShopId || "", name: "", code: "", address: "", phone: "" });
		setModalOpen(true);
	}

	function openEdit(branch: Branch) {
		setEditingBranch(branch);
		reset({
			shopId: branch.shopId,
			name: branch.name,
			code: branch.code ?? "",
			address: branch.address ?? "",
			phone: branch.phone ?? "",
		});
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
		setEditingBranch(null);
	}

	const onSubmit = (values: BranchPayload) => {
		if (editingBranch) {
			// UpdateBranchDto intentionally omits shopId (a branch can't move
			// shops), and the ValidationPipe has forbidNonWhitelisted:true —
			// sending it back would 400. The field is shown (disabled) for
			// context only, so drop it before submitting.
			const { shopId, ...payload } = values;
			updateBranch.mutate(
				{ id: editingBranch.id, payload },
				{ onSuccess: closeModal },
			);
			return;
		}
		createBranch.mutate(values, { onSuccess: closeModal });
	};

	async function handleDelete(branch: Branch) {
		const ok = await confirm({
			title: "Delete this branch?",
			description: `This will permanently delete "${branch.name}". Any warehouses, employees, sales, or purchases tied to it may be affected. This can't be undone.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (ok) deleteBranch.mutate(branch.id);
	}

	const columns: Column<Branch>[] = [
		{
			header: "Name",
			accessor: b => (
				<span className="font-medium text-slate-900">{b.name}</span>
			),
		},
		{ header: "Shop", accessor: b => shopName(b.shopId) },
		{ header: "Code", accessor: b => b.code ?? "—" },
		{ header: "Address", accessor: b => b.address ?? "—" },
		{ header: "Phone", accessor: b => b.phone ?? "—" },
		{
			header: "",
			accessor: b => (
				<div className="flex items-center gap-1">
					<button
						onClick={() => openEdit(b)}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
						<Pencil className="h-4 w-4" />
					</button>
					<button
						onClick={() => handleDelete(b)}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Branches"
				description="Physical outlets or counters under each shop."
				action={
					<div className="flex items-center gap-2">
						<Select value={shopFilter} onChange={e => setShopFilter(e.target.value)} className="w-44">
							<option value={ALL_SHOPS}>All shops</option>
							{shops.map(s => (
								<option key={s.id} value={s.id}>{s.name}</option>
							))}
						</Select>
						<Button onClick={openCreate}>
							<Plus className="h-4 w-4" /> Add branch
						</Button>
					</div>
				}
			/>

			<DataTable
				columns={columns}
				data={branches}
				isLoading={isLoading}
				rowKey={b => b.id}
				emptyTitle="No branches yet"
			/>

			<Modal
				open={modalOpen}
				onClose={closeModal}
				title={editingBranch ? "Edit branch" : "Add branch"}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<SelectField
						id="branch-shop"
						label="Shop"
						required
						disabled={!!editingBranch}
						{...register("shopId", { required: true })}
						defaultValue="">
						<option value="" disabled>
							Select shop
						</option>
						{shops.map(s => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</SelectField>
					<TextField
						id="branch-name"
						label="Branch name"
						required
						{...register("name", { required: true })}
					/>
					<TextField id="branch-code" label="Code" {...register("code")} />
					<TextField
						id="branch-address"
						label="Address"
						{...register("address")}
					/>
					<TextField id="branch-phone" label="Phone" {...register("phone")} />
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={closeModal}>
							Cancel
						</Button>
						<Button
							type="submit"
							isLoading={createBranch.isPending || updateBranch.isPending}>
							{editingBranch ? "Save changes" : "Save"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
