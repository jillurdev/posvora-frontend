export interface ReportFilter {
	from?: string;
	to?: string;
	shopId?: string;
	branchId?: string;
	categoryId?: string;
	brandId?: string;
	productId?: string;
	page?: number;
	limit?: number;
}

export interface SellReportSummary {
	totalSales: number;
	grossAmount: number;
	discountAmount: number;
	vatAmount: number;
	paidAmount: number;
	dueAmount: number;
}

export interface SellReportItem {
	id: string;
	invoiceNo: string;
	status: string;
	totalAmount: number;
	discountAmount: number;
	vatAmount: number;
	paidAmount: number;
	dueAmount: number;
	currency: string;
	createdAt: string;
	customer?: { id: string; name: string } | null;
	branch?: { name: string; shop?: { name: string } };
}

export interface SellReport {
	items: SellReportItem[];
	meta: { page: number; limit: number; total: number; totalPages: number };
	summary: SellReportSummary;
}

export interface VatReportRow {
	period: string;
	vatAmount: number;
	totalAmount: number;
	count: number;
}

export interface DailySellReport {
	date: string;
	totalSales: number;
	grossAmount: number;
	vatAmount: number;
	discountAmount: number;
	dueAmount: number;
	byBranch: Array<{
		branchId: string;
		branchName: string;
		sales: number;
		grossAmount: number;
		vatAmount: number;
		discountAmount: number;
		dueAmount: number;
	}>;
}

export interface CategoryWiseSellRow {
	categoryId: string | null;
	categoryName: string;
	qty: number;
	amount: number;
}

export interface BrandWiseSellRow {
	brandId: string | null;
	brandName: string;
	qty: number;
	amount: number;
}

export interface ProductWiseSellRow {
	productId: string;
	productName: string;
	qty: number;
	amount: number;
	discount: number;
	vat: number;
}

export interface MinStockRow {
	productId: string;
	name: string;
	sku: string;
	category: string | null;
	brand: string | null;
	onHand: number;
	stockAlertQty: number;
}

export interface ReceivableEntryRow {
	id: string;
	customerId: string;
	currency: string;
	debit: number;
	credit: number;
	balanceAfter: number;
	sourceType: string;
	sourceId: string;
	note?: string | null;
	createdAt: string;
}

export interface CustomerLedgerReport {
	customer: { id: string; name: string; phone?: string | null; currentDueBalance: number };
	entries: ReceivableEntryRow[];
	summary: { totalDebit: number; totalCredit: number; netBalance: number };
}
