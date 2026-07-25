"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input, Select } from "@/components/ui/Input";
import { useShops, useCreateShop, useDeleteShop } from "@/features/shop/hooks/useShops";
import type { Shop, ShopPayload } from "@/features/shop/types";
import { CURRENCIES } from "@/lib/currencies";

export default function ShopsPage() {
	const { data: shops = [], isLoading } = useShops();
	const createShop = useCreateShop();
	const deleteShop = useDeleteShop();
	const [modalOpen, setModalOpen] = useState(false);
	const { register, handleSubmit, reset } = useForm<ShopPayload>();

	const onSubmit = (values: ShopPayload) => {
		createShop.mutate(values, { onSuccess: () => { reset(); setModalOpen(false); } });
	};

	const columns: Column<Shop>[] = [
		{ header: "Name", accessor: s => <span className="font-medium text-slate-900">{s.name}</span> },
		{ header: "Address", accessor: s => s.address ?? "—" },
		{ header: "Currency", accessor: s => s.currency ?? "—" },
		{ header: "VAT / BIN", accessor: s => s.vatNumber || s.bin || "—" },
		{
			header: "",
			accessor: s => (
				<button onClick={() => deleteShop.mutate(s.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Shops"
				description="Each shop is an independent storefront under your organization."
				action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add shop</Button>}
			/>

			<DataTable columns={columns} data={shops} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No shops yet" />

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add shop">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormField label="Name" required>
						<Input {...register("name", { required: true })} />
					</FormField>
					<FormField label="Address">
						<Input {...register("address")} />
					</FormField>
					<div className="grid grid-cols-2 gap-4">
						<FormField label="BIN">
							<Input {...register("bin")} />
						</FormField>
						<FormField label="VAT number">
							<Input {...register("vatNumber")} />
						</FormField>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<FormField label="Currency">
							<Select defaultValue="BDT" {...register("currency")}>
								{CURRENCIES.map(c => (
									<option key={c.code} value={c.code}>{c.label}</option>
								))}
							</Select>
						</FormField>
						<FormField label="Timezone">
							<Input placeholder="Asia/Dhaka" {...register("timezone")} />
						</FormField>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
						<Button type="submit" isLoading={createShop.isPending}>Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
