import { httpClient } from "@/services/httpClient";
import type { Warehouse, WarehousePayload } from "./types";

export const warehouseApi = {
	list: () => httpClient.get<Warehouse[]>("/warehouses"),
	get: (id: string) => httpClient.get<Warehouse>(`/warehouses/${id}`),
	create: (payload: WarehousePayload) => httpClient.post<Warehouse>("/warehouses", payload),
	update: (id: string, payload: Partial<WarehousePayload>) => httpClient.patch<Warehouse>(`/warehouses/${id}`, payload),
	remove: (id: string) => httpClient.delete(`/warehouses/${id}`),
};
