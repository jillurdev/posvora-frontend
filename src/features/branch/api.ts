import { httpClient } from "@/services/httpClient";
import type { Branch, BranchPayload } from "./types";

export const branchApi = {
	list: () => httpClient.get<Branch[]>("/branches"),
	get: (id: string) => httpClient.get<Branch>(`/branches/${id}`),
	create: (payload: BranchPayload) => httpClient.post<Branch>("/branches", payload),
	update: (id: string, payload: Partial<BranchPayload>) => httpClient.patch<Branch>(`/branches/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/branches/${id}`),
};
