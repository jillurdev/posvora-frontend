import { httpClient } from "@/services/httpClient";
import type { CreateSalePayload, Sale, SalePaymentPayload } from "./types";

export const salesApi = {
	list: (branchId: string, params?: { customerId?: string; status?: string; page?: number; limit?: number }) =>
		httpClient.getPaginated<Sale[]>("/sales", { branchId, ...params }),
	get: (id: string) => httpClient.get<Sale>(`/sales/${id}`),
	create: (payload: CreateSalePayload) => httpClient.post<Sale>("/sales", payload),
	resume: (id: string) => httpClient.post<Sale>(`/sales/${id}/resume`),
	addPayment: (id: string, payload: SalePaymentPayload) => httpClient.post(`/sales/${id}/payments`, payload),
	returnSale: (id: string, payload: { items: { saleItemId: string; quantity: number }[]; reason?: string }) =>
		httpClient.post(`/sales/${id}/return`, payload),
};
