"use client";

import { useState } from "react";
import { Plus, Trash2, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveShop } from "@/context/ActiveShopContext";
import { usePagination } from "@/hooks/usePagination";
import { useSuppliers, useCreateSupplier, useDeleteSupplier } from "@/features/supplier/hooks/useSuppliers";
import type { Supplier, SupplierPayload } from "@/features/supplier/types";

export default function SuppliersPage() {
	const { activeShopId, shops } = useActiveShop();
	const { page, limit, setPage } = usePagination(10);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	const { data, isLoading } = useSuppliers(activeShopId ?? "", { search: search || undefined, page, limit });
	const createSupplier = useCreateSupplier();
	const deleteSupplier = useDeleteSupplier();
	const { register, handleSubmit, reset } = useForm<SupplierPayload>();

	if (shops.length === 0) {
		return <EmptyState icon={Truck} title="Create a shop first" description="Add a shop before managing suppliers." />;
	}

	const onSubmit = (values: SupplierPayload) => {
		createSupplier.mutate(
			{ ...values, shopId: activeShopId! },
			{ onSuccess: () => { reset(); setModalOpen(false); } },
		);
	};

	const columns: Column<Supplier>[] = [
		{ header: "Name", accessor: s => <span className="font-medium text-slate-900">{s.name}</span> },
		{ header: "Phone", accessor: s => s.phone ?? "—" },
		{ header: "Email", accessor: s => s.email ?? "—" },
		{ header: "Address", accessor: s => s.address ?? "—" },
		{
			header: "Due balance",
			accessor: s => {
				const balances = Object.entries(s.balancesByCurrency ?? {}).filter(([, amount]) => Math.abs(amount) > 0.005);
				if (balances.length === 0) return <span className="text-slate-400">—</span>;
				return (
					<div className="flex flex-col gap-0.5">
						{balances.map(([currency, amount]) => (
							<span key={currency} className={amount > 0 ? "font-medium text-amber-600" : "font-medium text-emerald-600"}>
								{amount > 0 ? "+" : ""}{amount.toFixed(2)} {currency}
							</span>
						))}
					</div>
				);
			},
		},
		{
			header: "",
			accessor: s => (
				<button onClick={() => deleteSupplier.mutate(s.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Suppliers"
				description="Manage vendors you purchase stock from."
				action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add supplier</Button>}
			/>

			<div className="mb-4">
				<SearchInput value={search} onChange={setSearch} placeholder="Search suppliers..." />
			</div>

			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No suppliers yet" />
			{data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add supplier">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<TextField id="supplier-name" label="Name" required {...register("name", { required: true })} />
					<TextField id="supplier-phone" label="Phone" {...register("phone")} />
					<TextField id="supplier-email" label="Email" type="email" {...register("email")} />
					<TextField id="supplier-address" label="Address" {...register("address")} />
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button type="submit" isLoading={createSupplier.isPending}>Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
