import { httpClient } from "@/services/httpClient";
import type { Organization, UpdateOrganizationPayload, DashboardSummary } from "./types";

export const organizationApi = {
	me: () => httpClient.get<Organization>("/organization/me"),
	update: (payload: UpdateOrganizationPayload) => httpClient.patch<Organization>("/organization/me", payload),
	summary: () => httpClient.get<DashboardSummary>("/organization/me/summary"),
	// Debounced-caller's responsibility — this just hits the endpoint.
	// `handle` is sent exactly as typed; the backend normalizes it the same
	// way update() would and reports back the normalized form.
	checkHandleAvailability: (handle: string) =>
		httpClient.get<{ available: boolean; handle: string; reason?: string }>(
			`/organization/handle-availability?handle=${encodeURIComponent(handle)}`,
		),
	uploadLogo: (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return httpClient.upload<Organization>("/organization/me/logo", formData);
	},
};
