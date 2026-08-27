"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useConfirm } from "@/context/ConfirmDialogContext";
import { usePagination } from "@/hooks/usePagination";
import { useCustomers, useCreateCustomer, useDeleteCustomer } from "@/features/customer/hooks/useCustomers";
import type { Customer, CustomerPayload } from "@/features/customer/types";

export default function CustomersPage() {
	const router = useRouter();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const { activeShopId, shops } = useActiveShop();
	const { page, limit, setPage } = usePagination(10);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	const { data, isLoading } = useCustomers(activeShopId ?? "", { search: search || undefined, page, limit });
	const createCustomer = useCreateCustomer();
	const deleteCustomer = useDeleteCustomer();
	const confirm = useConfirm();
	const { register, handleSubmit, reset } = useForm<CustomerPayload>();

	async function handleDelete(customer: Customer) {
		const result = await confirm({
			title: "Delete this customer?",
			description: `This will permanently delete "${customer.name}". Their sales history stays intact, but the customer record itself can't be recovered.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (result) deleteCustomer.mutate(customer.id);
	}

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
			header: "Due balance",
			accessor: c => {
				const balances = Object.entries(c.balancesByCurrency ?? {}).filter(([, amount]) => Math.abs(amount) > 0.005);
				if (balances.length === 0) return <span className="text-slate-400">—</span>;
				return (
					<div className="flex flex-col gap-0.5">
						{balances.map(([currency, amount]) => (
							<span key={currency} className={amount > 0 ? "font-medium text-red-600" : "font-medium text-emerald-600"}>
								{amount > 0 ? "+" : ""}{amount.toFixed(2)} {currency}
							</span>
						))}
					</div>
				);
			},
		},
		{
			header: "",
			accessor: c => (
				<button
					onClick={e => { e.stopPropagation(); handleDelete(c); }}
					className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
				>
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

			<DataTable
				columns={columns}
				data={data?.data ?? []}
				isLoading={isLoading}
				rowKey={c => c.id}
				emptyTitle="No customers yet"
				onRowClick={c => router.push(`/${orgHandle}/customers/${c.id}`)}
			/>
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
