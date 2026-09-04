import { httpClient } from "@/services/httpClient";
import type {
	BrandWiseSellRow,
	CategoryWiseSellRow,
	CustomerLedgerReport,
	DailySellReport,
	MinStockRow,
	ProductWiseSellRow,
	ReportFilter,
	SellReport,
	VatReportRow,
} from "./types";

export const reportsApi = {
	sellReport: (params: ReportFilter) => httpClient.get<SellReport>("/reports/sell", params),
	sellVatReport: (params: ReportFilter & { groupBy?: "day" | "month" }) =>
		httpClient.get<VatReportRow[]>("/reports/sell-vat", params),
	yearlySellVatReport: (params: ReportFilter) => httpClient.get<VatReportRow[]>("/reports/sell-vat/yearly", params),
	dailySellReport: (params: { date?: string; shopId?: string }) =>
		httpClient.get<DailySellReport>("/reports/daily-sell", params),
	categoryWiseSellReport: (params: ReportFilter) =>
		httpClient.get<CategoryWiseSellRow[]>("/reports/category-wise-sell", params),
	brandWiseSellReport: (params: ReportFilter) => httpClient.get<BrandWiseSellRow[]>("/reports/brand-wise-sell", params),
	productWiseSellReport: (params: ReportFilter) =>
		httpClient.get<ProductWiseSellRow[]>("/reports/product-wise-sell", params),
	minStockReport: (params: { shopId?: string }) => httpClient.get<MinStockRow[]>("/reports/min-stock", params),
	customerLedger: (customerId: string, params: ReportFilter) =>
		httpClient.get<CustomerLedgerReport>(`/reports/customer-ledger/${customerId}`, params),
};
