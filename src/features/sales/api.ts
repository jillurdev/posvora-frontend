import { env } from "@/config/env";
import { httpClient } from "@/services/httpClient";
import type { CreateSalePayload, Sale, SalePaymentPayload } from "./types";

export const salesApi = {
	list: (branchId: string, params?: { customerId?: string; status?: string; page?: number; limit?: number }) =>
		httpClient.getPaginated<Sale[]>("/sales", { branchId, ...params }),
	get: (id: string) => httpClient.get<Sale>(`/sales/${id}`),
	create: (payload: CreateSalePayload) => httpClient.post<Sale>("/sales", payload),
	// NOTE: previously called with no body at all, so a resumed held sale
	// never actually received the finalized cart — fixed to send the payload.
	resume: (id: string, payload: CreateSalePayload) => httpClient.post<Sale>(`/sales/${id}/resume`, payload),
	addPayment: (id: string, payload: SalePaymentPayload) => httpClient.post(`/sales/${id}/payments`, payload),
	returnSale: (id: string, payload: { items: { saleItemId: string; quantity: number }[]; reason?: string }) =>
		httpClient.post(`/sales/${id}/return`, payload),

	// The receipt PDF is a raw binary stream, not the usual JSON envelope,
	// so it goes through a plain authenticated `fetch` rather than httpClient.
	receiptUrl: (id: string) => `${env.apiUrl}/sales/${id}/receipt`,
	async fetchReceiptBlob(id: string): Promise<Blob> {
		const res = await fetch(salesApi.receiptUrl(id), { credentials: "include" });
		if (!res.ok) throw new Error("Could not load the receipt.");
		return res.blob();
	},
};
