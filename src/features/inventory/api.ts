import { httpClient } from "@/services/httpClient";
import type { StockInPayload, StockItem, StockMovement, StockOutPayload, StockTransferPayload } from "./types";

export const inventoryApi = {
	stock: (params: { warehouseId?: string; branchId?: string; productId?: string }) =>
		httpClient.get<StockItem[]>("/inventory/stock", params),
	movements: (params: { warehouseId?: string; branchId?: string; productId?: string }) =>
		httpClient.get<StockMovement[]>("/inventory/movements", params),
	lowStock: (params: { warehouseId?: string; branchId?: string }) =>
		httpClient.get<StockItem[]>("/inventory/low-stock", params),
	stockIn: (payload: StockInPayload) => httpClient.post("/inventory/stock-in", payload),
	stockOut: (payload: StockOutPayload) => httpClient.post("/inventory/stock-out", payload),
	transfer: (payload: StockTransferPayload) => httpClient.post("/inventory/transfer", payload),
};
