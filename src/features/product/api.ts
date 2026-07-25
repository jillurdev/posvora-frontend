import { httpClient } from "@/services/httpClient";
import type { PaginatedResult } from "@/types/api-response";
import type {
	Brand,
	Category,
	CreateProductPayload,
	ListProductsQuery,
	Product,
	Unit,
} from "./types";

export const productApi = {
	// Categories
	listCategories: (shopId: string) => httpClient.get<Category[]>("/categories", { shopId }),
	createCategory: (payload: { shopId: string; name: string; parentId?: string }) =>
		httpClient.post<Category>("/categories", payload),

	// Brands
	listBrands: (shopId: string) => httpClient.get<Brand[]>("/brands", { shopId }),
	createBrand: (payload: { shopId: string; name: string }) => httpClient.post<Brand>("/brands", payload),

	// Units
	listUnits: (shopId: string) => httpClient.get<Unit[]>("/units", { shopId }),
	createUnit: (payload: { shopId: string; name: string; shortName: string }) =>
		httpClient.post<Unit>("/units", payload),

	// Products
	list: (query: ListProductsQuery) =>
		httpClient.getPaginated<Product[]>("/products", query as unknown as Record<string, string | number>),
	get: (id: string) => httpClient.get<Product>(`/products/${id}`),
	create: (payload: CreateProductPayload) => httpClient.post<Product>("/products", payload),
	update: (id: string, payload: Partial<CreateProductPayload>) =>
		httpClient.patch<Product>(`/products/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/products/${id}`),
};
