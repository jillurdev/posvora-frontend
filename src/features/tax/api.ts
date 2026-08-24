import { httpClient } from "@/services/httpClient";
import type { CreateTaxRulePayload, TaxRule, UpdateTaxRulePayload } from "./types";

export const taxApi = {
	list: (shopId: string) => httpClient.get<TaxRule[]>("/tax-rules", { shopId }),
	create: (payload: CreateTaxRulePayload) => httpClient.post<TaxRule>("/tax-rules", payload),
	update: (id: string, payload: UpdateTaxRulePayload) => httpClient.patch<TaxRule>(`/tax-rules/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/tax-rules/${id}`),
};
