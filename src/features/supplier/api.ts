import { httpClient } from "@/services/httpClient";
import type { Supplier, SupplierGroup, SupplierPayload, SupplierStatement } from "./types";

export const supplierApi = {
	list: (shopId: string, params?: { search?: string; page?: number; limit?: number }) =>
		httpClient.getPaginated<Supplier[]>("/suppliers", { shopId, ...params }),
	get: (id: string) => httpClient.get<Supplier>(`/suppliers/${id}`),
	create: (payload: SupplierPayload) => httpClient.post<Supplier>("/suppliers", payload),
	update: (id: string, payload: Partial<SupplierPayload>) => httpClient.patch<Supplier>(`/suppliers/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/suppliers/${id}`),
	listGroups: (shopId: string) => httpClient.get<SupplierGroup[]>("/suppliers/groups", { shopId }),
	createGroup: (payload: { shopId: string; name: string; type: string }) =>
		httpClient.post<SupplierGroup>("/suppliers/groups", payload),
	statement: (id: string, currency?: string) =>
		httpClient.get<SupplierStatement>(`/suppliers/${id}/statement`, currency ? { currency } : undefined),
};
