import { httpClient } from "@/services/httpClient";
import type { PaginatedResult } from "@/types/api-response";
import type { Customer, CustomerGroup, CustomerPayload } from "./types";

export const customerApi = {
	list: (shopId: string, params?: { search?: string; page?: number; limit?: number }) =>
		httpClient.getPaginated<Customer[]>("/customers", { shopId, ...params }),
	get: (id: string) => httpClient.get<Customer>(`/customers/${id}`),
	create: (payload: CustomerPayload) => httpClient.post<Customer>("/customers", payload),
	update: (id: string, payload: Partial<CustomerPayload>) => httpClient.patch<Customer>(`/customers/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/customers/${id}`),
	listGroups: (shopId: string) => httpClient.get<CustomerGroup[]>("/customers/groups", { shopId }),
	createGroup: (payload: { shopId: string; name: string; type: string; discountPercent?: number }) =>
		httpClient.post<CustomerGroup>("/customers/groups", payload),
	addNote: (id: string, note: string) => httpClient.post(`/customers/${id}/notes`, { note }),
	addFollowUp: (id: string, payload: { dueAt: string; note?: string }) =>
		httpClient.post(`/customers/${id}/follow-ups`, payload),
	dueFollowUps: () => httpClient.get("/customers/follow-ups/due"),
};
