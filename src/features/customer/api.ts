import { httpClient } from "@/services/httpClient";
import type { PaginatedResult } from "@/types/api-response";
import type { Customer, CustomerGroup, CustomerNote, CustomerPayload, CustomerStatement, FollowUp } from "./types";

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
	addNote: (id: string, note: string) => httpClient.post<CustomerNote>(`/customers/${id}/notes`, { note }),
	addFollowUp: (id: string, payload: { dueDate: string; note?: string }) =>
		httpClient.post<FollowUp>(`/customers/${id}/follow-ups`, payload),
	dueFollowUps: () => httpClient.get<FollowUp[]>("/customers/follow-ups/due"),
	statement: (id: string, currency?: string) =>
		httpClient.get<CustomerStatement>(`/customers/${id}/statement`, currency ? { currency } : undefined),
};
