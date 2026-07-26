import { httpClient } from "@/services/httpClient";
import type { Organization, UpdateOrganizationPayload, DashboardSummary } from "./types";

export const organizationApi = {
	me: () => httpClient.get<Organization>("/organization/me"),
	update: (payload: UpdateOrganizationPayload) => httpClient.patch<Organization>("/organization/me", payload),
	summary: () => httpClient.get<DashboardSummary>("/organization/me/summary"),
};
