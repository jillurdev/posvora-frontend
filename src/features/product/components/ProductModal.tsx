"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { productSchema, ProductFormValues } from "../schema";
import { useCreateProduct } from "../hooks/useProducts";
import { useCategories, useBrands, useUnits } from "../hooks/useCatalog";

export function ProductModal({ open, onClose, shopId }: { open: boolean; onClose: () => void; shopId: string }) {
	const { data: categories = [] } = useCategories(shopId);
	const { data: brands = [] } = useBrands(shopId);
	const { data: units = [] } = useUnits(shopId);
	const { mutate, isPending } = useCreateProduct();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: { shopId },
	});

	const onSubmit = (values: ProductFormValues) => {
		mutate(values, {
			onSuccess: () => {
				reset({ shopId });
				onClose();
			},
		});
	};

	return (
		<Modal open={open} onClose={onClose} title="Add Product" size="lg">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<input type="hidden" {...register("shopId")} />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormField label="Product name" error={errors.name?.message} required>
						<Input placeholder="e.g. Samsung Galaxy A15" {...register("name")} />
					</FormField>
					<FormField label="SKU" error={errors.sku?.message} required>
						<Input placeholder="SKU-0001" {...register("sku")} />
					</FormField>
					<FormField label="Barcode" error={errors.barcode?.message}>
						<Input placeholder="Optional" {...register("barcode")} />
					</FormField>
					<FormField label="Category" error={errors.categoryId?.message}>
						<Select {...register("categoryId")} defaultValue="">
							<option value="">None</option>
							{categories.map(c => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</Select>
					</FormField>
					<FormField label="Brand" error={errors.brandId?.message}>
						<Select {...register("brandId")} defaultValue="">
							<option value="">None</option>
							{brands.map(b => (
								<option key={b.id} value={b.id}>
									{b.name}
								</option>
							))}
						</Select>
					</FormField>
					<FormField label="Unit" error={errors.unitId?.message}>
						<Select {...register("unitId")} defaultValue="">
							<option value="">None</option>
							{units.map(u => (
								<option key={u.id} value={u.id}>
									{u.name} ({u.shortName})
								</option>
							))}
						</Select>
					</FormField>
					<FormField label="Cost price" error={errors.costPrice?.message}>
						<Input type="number" step="0.01" {...register("costPrice")} />
					</FormField>
					<FormField label="Selling price" error={errors.sellingPrice?.message}>
						<Input type="number" step="0.01" {...register("sellingPrice")} />
					</FormField>
					<FormField label="Stock alert qty" error={errors.stockAlertQty?.message}>
						<Input type="number" {...register("stockAlertQty")} />
					</FormField>
					<FormField label="Opening quantity" error={errors.openingQuantity?.message}>
						<Input type="number" {...register("openingQuantity")} />
					</FormField>
				</div>
				<FormField label="Description" error={errors.description?.message}>
					<Textarea rows={3} {...register("description")} />
				</FormField>
				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" isLoading={isPending}>
						Save product
					</Button>
				</div>
			</form>
		</Modal>
	);
}
