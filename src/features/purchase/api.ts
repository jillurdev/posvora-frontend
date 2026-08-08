import { httpClient } from "@/services/httpClient";
import type { CreatePurchasePayload, Purchase } from "./types";

export const purchaseApi = {
	list: (branchId: string, params?: { supplierId?: string; page?: number; limit?: number }) =>
		httpClient.getPaginated<Purchase[]>("/purchases", { branchId, ...params }),
	get: (id: string) => httpClient.get<Purchase>(`/purchases/${id}`),
	create: (payload: CreatePurchasePayload) => httpClient.post<Purchase>("/purchases", payload),
	receive: (id: string, payload: { warehouseId: string; items: { purchaseItemId: string; quantity: number }[] }) =>
		httpClient.post(`/purchases/${id}/receive`, payload),
	addPayment: (id: string, payload: { method: string; amount: number; transactionRef?: string }) =>
		httpClient.post(`/purchases/${id}/payments`, payload),
};
