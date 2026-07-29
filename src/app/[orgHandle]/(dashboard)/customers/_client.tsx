"use client";

import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
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
import { useCustomers, useCreateCustomer, useDeleteCustomer } from "@/features/customer/hooks/useCustomers";
import type { Customer, CustomerPayload } from "@/features/customer/types";

export default function CustomersPage() {
	const { activeShopId, shops } = useActiveShop();
	const { page, limit, setPage } = usePagination(10);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	const { data, isLoading } = useCustomers(activeShopId ?? "", { search: search || undefined, page, limit });
	const createCustomer = useCreateCustomer();
	const deleteCustomer = useDeleteCustomer();
	const { register, handleSubmit, reset } = useForm<CustomerPayload>();

	if (shops.length === 0) {
		return <EmptyState icon={Users} title="Create a shop first" description="Add a shop before managing customers." />;
	}

	const onSubmit = (values: CustomerPayload) => {
		createCustomer.mutate(
			{ ...values, shopId: activeShopId! },
			{
				onSuccess: () => {
					reset();
					setModalOpen(false);
				},
			},
		);
	};

	const columns: Column<Customer>[] = [
		{ header: "Name", accessor: c => <span className="font-medium text-slate-900">{c.name}</span> },
		{ header: "Phone", accessor: c => c.phone ?? "—" },
		{ header: "Email", accessor: c => c.email ?? "—" },
		{ header: "Address", accessor: c => c.address ?? "—" },
		{
			header: "",
			accessor: c => (
				<button onClick={() => deleteCustomer.mutate(c.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Customers"
				description="Manage your customer directory and follow-ups."
				action={
					<Button onClick={() => setModalOpen(true)}>
						<Plus className="h-4 w-4" /> Add customer
					</Button>
				}
			/>

			<div className="mb-4">
				<SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
			</div>

			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={c => c.id} emptyTitle="No customers yet" />
			{data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add customer">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<TextField id="customer-name" label="Name" required {...register("name", { required: true })} />
					<TextField id="customer-phone" label="Phone" {...register("phone")} />
					<TextField id="customer-email" label="Email" type="email" {...register("email")} />
					<TextField id="customer-address" label="Address" {...register("address")} />
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" isLoading={createCustomer.isPending}>
							Save
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
	