"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/Field";
import { useConfirm } from "@/context/ConfirmDialogContext";
import { useShops, useCreateShop, useUpdateShop, useDeleteShop } from "@/features/shop/hooks/useShops";
import type { Shop, ShopPayload } from "@/features/shop/types";
import { CURRENCIES } from "@/lib/currencies";
import { COUNTRIES } from "@/lib/countries";

export default function ShopsPage() {
	const { data: shops = [], isLoading } = useShops();
	const createShop = useCreateShop();
	const updateShop = useUpdateShop();
	const deleteShop = useDeleteShop();
	const confirm = useConfirm();

	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<Shop | null>(null);

	const { register, handleSubmit, reset, setValue } = useForm<ShopPayload>();

	const openCreate = () => {
		setEditing(null);
		reset({ name: "", address: "", bin: "", vatNumber: "", country: "BD", currency: "BDT", timezone: "" });
		setModalOpen(true);
	};

	const openEdit = (shop: Shop) => {
		setEditing(shop);
		reset({
			name: shop.name,
			address: shop.address ?? "",
			bin: shop.bin ?? "",
			vatNumber: shop.vatNumber ?? "",
			country: shop.country ?? "BD",
			currency: shop.currency ?? "BDT",
			timezone: shop.timezone ?? "",
			slug: shop.slug ?? "",
		});
		setModalOpen(true);
	};

	async function handleDelete(shop: Shop) {
		const result = await confirm({
			title: "Delete this shop?",
			description: `This will permanently delete "${shop.name}" along with its branches, warehouses, and staff assignments. This can't be undone.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (result) deleteShop.mutate(shop.id);
	}

	// Only on NEW shops: picking a country pre-fills a sensible default
	// currency, saving a step — but never overrides an existing shop's
	// already-configured currency when editing.
	const handleCountryChange = (code: string) => {
		setValue("country", code);
		if (!editing) {
			const match = COUNTRIES.find(c => c.code === code);
			if (match) setValue("currency", match.defaultCurrency);
		}
	};

	const onSubmit = (values: ShopPayload) => {
		if (editing) {
			updateShop.mutate(
				{ id: editing.id, payload: values },
				{ onSuccess: () => { reset(); setModalOpen(false); setEditing(null); } },
			);
		} else {
			// slug is server-generated on create; only editable afterwards.
			const { slug, ...payload } = values;
			createShop.mutate(payload, { onSuccess: () => { reset(); setModalOpen(false); } });
		}
	};

	const columns: Column<Shop>[] = [
		{ header: "Name", accessor: s => <span className="font-medium text-slate-900">{s.name}</span> },
		{
			header: "Public handle",
			accessor: s =>
				s.slug ? (
					<Link
						href={`/shop/${s.slug}`}
						target="_blank"
						className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:underline"
					>
						/shop/{s.slug} <ExternalLink className="h-3 w-3" />
					</Link>
				) : (
					"—"
				),
		},
		{ header: "Country", accessor: s => COUNTRIES.find(c => c.code === s.country)?.label ?? s.country ?? "—" },
		{ header: "Currency", accessor: s => s.currency ?? "—" },
		{ header: "VAT / Reg. No.", accessor: s => s.vatNumber || s.bin || "—" },
		{
			header: "",
			accessor: s => (
				<div className="flex items-center justify-end gap-1">
					<button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
						<Pencil className="h-4 w-4" />
					</button>
					<button onClick={() => handleDelete(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Shops"
				description="Each shop is an independent storefront under your organization."
				action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add shop</Button>}
			/>

			<DataTable columns={columns} data={shops} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No shops yet" />

			<Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit shop" : "Add shop"}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<TextField id="shop-name" label="Name" required {...register("name", { required: true })} />
					{editing && (
						<TextField
							id="shop-slug"
							label="Public handle"
							hint="Letters, numbers and hyphens only — this is the shop's public link."
							placeholder="my-shop"
							{...register("slug")}
						/>
					)}
					<TextField id="shop-address" label="Address" {...register("address")} />
					<div className="grid grid-cols-2 gap-4">
						<TextField id="shop-bin" label="Business Reg. No. (optional)" {...register("bin")} />
						<TextField id="shop-vat" label="VAT / Tax ID (optional)" {...register("vatNumber")} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<SelectField
							id="shop-country"
							label="Country"
							defaultValue="BD"
							{...register("country")}
							onChange={e => handleCountryChange(e.target.value)}
						>
							{COUNTRIES.map(c => (
								<option key={c.code} value={c.code}>{c.label}</option>
							))}
						</SelectField>
						<SelectField id="shop-currency" label="Currency" defaultValue="BDT" {...register("currency")}>
							{CURRENCIES.map(c => (
								<option key={c.code} value={c.code}>{c.label}</option>
							))}
						</SelectField>
					</div>
					<TextField id="shop-timezone" label="Timezone" placeholder="Asia/Dhaka" {...register("timezone")} />
					<p className="text-xs text-slate-400">
						Country determines which local payment methods (e.g. mobile wallets) show up at checkout for this shop.
					</p>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={() => { setModalOpen(false); setEditing(null); }}>Cancel</Button>
						<Button type="submit" isLoading={createShop.isPending || updateShop.isPending}>Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
