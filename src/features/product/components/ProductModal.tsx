"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useBranches } from "@/features/branch/hooks/useBranches";
import { useWarehouses } from "@/features/warehouse/hooks/useWarehouses";
import { productSchema, ProductFormValues } from "../schema";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import { useCategories, useBrands, useUnits } from "../hooks/useCatalog";
import type { Product } from "../types";

interface ProductModalProps {
	open: boolean;
	onClose: () => void;
	shopId: string;
	/** Present -> edit that product. Absent -> create a new one. */
	editingProduct?: Product | null;
}

export function ProductModal({ open, onClose, shopId, editingProduct }: ProductModalProps) {
	const isEditing = !!editingProduct;
	const { data: categories = [] } = useCategories(shopId);
	const { data: brands = [] } = useBrands(shopId);
	const { data: units = [] } = useUnits(shopId);

	// Opening stock only makes sense when a product is first created — the
	// backend's update DTO doesn't even accept these fields afterwards.
	const { data: allBranches = [] } = useBranches();
	const shopBranchIds = new Set(allBranches.filter(b => b.shopId === shopId).map(b => b.id));
	const { data: allWarehouses = [] } = useWarehouses();
	const shopWarehouses = allWarehouses.filter(w => shopBranchIds.has(w.branchId));

	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();
	const isPending = createProduct.isPending || updateProduct.isPending;

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: { shopId },
	});

	// Re-sync the form whenever we switch between "add" and "edit an
	// existing product" (or the target product changes).
	useEffect(() => {
		if (!open) return;
		if (editingProduct) {
			reset({
				shopId,
				name: editingProduct.name,
				sku: editingProduct.sku,
				barcode: editingProduct.barcode ?? "",
				categoryId: editingProduct.categoryId ?? "",
				brandId: editingProduct.brandId ?? "",
				unitId: editingProduct.unitId ?? "",
				description: editingProduct.description ?? "",
				costPrice: editingProduct.costPrice ?? undefined,
				sellingPrice: editingProduct.sellingPrice ?? undefined,
				stockAlertQty: editingProduct.stockAlertQty ?? undefined,
			});
		} else {
			reset({ shopId });
		}
	}, [open, editingProduct, shopId, reset]);

	const openingQuantity = watch("openingQuantity");

	const onSubmit = (values: ProductFormValues) => {
		if (isEditing && editingProduct) {
			// openingQuantity/openingWarehouseId are create-only — strip them so
			// we don't send fields the update endpoint doesn't accept.
			const { openingQuantity: _oq, openingWarehouseId: _ow, ...payload } = values;
			updateProduct.mutate(
				{ id: editingProduct.id, payload },
				{ onSuccess: onClose },
			);
			return;
		}

		createProduct.mutate(values, {
			onSuccess: () => {
				reset({ shopId });
				onClose();
			},
		});
	};

	return (
		<Modal open={open} onClose={onClose} title={isEditing ? "Edit Product" : "Add Product"} size="lg">
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

					{!isEditing && (
						<>
							<FormField label="Opening quantity" error={errors.openingQuantity?.message}>
								<Input type="number" placeholder="0" {...register("openingQuantity")} />
							</FormField>
							{Number(openingQuantity) > 0 && (
								<FormField
									label="Opening stock warehouse"
									error={errors.openingWarehouseId?.message}
									required
								>
									<Select {...register("openingWarehouseId")} defaultValue="">
										<option value="">Select a warehouse...</option>
										{shopWarehouses.map(w => (
											<option key={w.id} value={w.id}>
												{w.name}
											</option>
										))}
									</Select>
								</FormField>
							)}
						</>
					)}
				</div>
				<FormField label="Description" error={errors.description?.message}>
					<Textarea rows={3} {...register("description")} />
				</FormField>
				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" isLoading={isPending}>
						{isEditing ? "Save changes" : "Save product"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
