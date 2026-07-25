import { httpClient } from "@/services/httpClient";
import type { Organization, UpdateOrganizationPayload } from "./types";

export const organizationApi = {
	me: () => httpClient.get<Organization>("/organization/me"),
	update: (payload: UpdateOrganizationPayload) => httpClient.patch<Organization>("/organization/me", payload),
};
