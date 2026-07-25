import { httpClient } from "@/services/httpClient";
import type { Permission, Role, RolePayload } from "./types";

export const roleApi = {
	permissions: () => httpClient.get<Permission[]>("/roles/permissions"),
	list: () => httpClient.get<Role[]>("/roles"),
	create: (payload: RolePayload) => httpClient.post<Role>("/roles", payload),
	update: (id: string, payload: Partial<RolePayload>) => httpClient.patch<Role>(`/roles/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/roles/${id}`),
	assign: (payload: { userId: string; roleId: string; branchId?: string }) => httpClient.post("/roles/assign", payload),
};
