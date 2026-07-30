import { z } from "zod";

export const productSchema = z.object({
	shopId: z.string().min(1, "Shop is required"),
	name: z.string().min(2, "Name is required"),
	sku: z.string().min(1, "SKU is required"),
	barcode: z.string().optional(),
	categoryId: z.string().optional(),
	brandId: z.string().optional(),
	unitId: z.string().optional(),
	description: z.string().optional(),
	costPrice: z.coerce.number().min(0).optional(),
	sellingPrice: z.coerce.number().min(0).optional(),
	stockAlertQty: z.coerce.number().min(0).optional(),
	openingQuantity: z.coerce.number().min(0).optional(),
	openingWarehouseId: z.string().optional(),
}).refine(
	(data) => !data.openingQuantity || data.openingQuantity <= 0 || !!data.openingWarehouseId,
	{ message: "Choose a warehouse to receive the opening stock into", path: ["openingWarehouseId"] },
);
export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
	shopId: z.string().min(1),
	name: z.string().min(2, "Name is required"),
	parentId: z.string().optional(),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
	shopId: z.string().min(1),
	name: z.string().min(2, "Name is required"),
});
export type BrandFormValues = z.infer<typeof brandSchema>;

export const unitSchema = z.object({
	shopId: z.string().min(1),
	name: z.string().min(1, "Name is required"),
	shortName: z.string().min(1, "Short name is required"),
});
export type UnitFormValues = z.infer<typeof unitSchema>;
