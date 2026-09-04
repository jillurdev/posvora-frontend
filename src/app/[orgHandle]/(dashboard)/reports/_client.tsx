"use client";

import { useState } from "react";
import { BarChart3, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { TextField, SelectField } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useBranches } from "@/features/branch/hooks/useBranches";
import {
	useSellReport,
	useSellVatReport,
	useDailySellReport,
	useCategoryWiseSellReport,
	useBrandWiseSellReport,
	useProductWiseSellReport,
	useMinStockReport,
} from "@/features/reports/hooks/useReports";
import type {
	SellReportItem,
	VatReportRow,
	CategoryWiseSellRow,
	BrandWiseSellRow,
	ProductWiseSellRow,
	MinStockRow,
} from "@/features/reports/types";
import { formatDate } from "@/lib/utils";
import { useFormatMoney } from "@/hooks/useCurrency";

function firstOfMonthIso() {
	const d = new Date();
	return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function todayIso() {
	return new Date().toISOString().slice(0, 10);
}

export default function ReportsPage() {
	const formatMoney = useFormatMoney();
	const { activeShopId, shops } = useActiveShop();
	const { data: branches = [] } = useBranches();

	const [from, setFrom] = useState(firstOfMonthIso());
	const [to, setTo] = useState(todayIso());
	const [branchId, setBranchId] = useState("");

	const filter = { from, to, shopId: activeShopId ?? undefined, branchId: branchId || undefined };

	if (shops.length === 0) {
		return <EmptyState icon={BarChart3} title="Create a shop first" description="Reports are scoped to a shop." />;
	}

	const filterBar = (
		<div className="flex flex-wrap gap-3 mb-4">
			<TextField id="reports-from" label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} />
			<TextField id="reports-to" label="To" type="date" value={to} onChange={e => setTo(e.target.value)} />
			<SelectField id="reports-branch" label="Branch" value={branchId} onChange={e => setBranchId(e.target.value)}>
				<option value="">All branches</option>
				{branches.map(b => (
					<option key={b.id} value={b.id}>{b.name}</option>
				))}
			</SelectField>
		</div>
	);

	return (
		<div>
			<PageHeader title="Reports" description="Sales, VAT, category, brand, product and stock reports." />
			<Tabs defaultValue="sell">
				<TabsList>
					<TabsTrigger value="sell">Sell Report</TabsTrigger>
					<TabsTrigger value="daily">Daily Sell</TabsTrigger>
					<TabsTrigger value="vat">Sell VAT</TabsTrigger>
					<TabsTrigger value="category">Category Wise</TabsTrigger>
					<TabsTrigger value="brand">Brand Wise</TabsTrigger>
					<TabsTrigger value="product">Product Wise</TabsTrigger>
					<TabsTrigger value="minstock">Low Stock</TabsTrigger>
				</TabsList>

				<TabsContent value="sell">
					{filterBar}
					<SellReportTab filter={filter} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="daily">
					<DailySellTab shopId={activeShopId ?? undefined} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="vat">
					{filterBar}
					<VatReportTab filter={filter} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="category">
					{filterBar}
					<CategoryWiseTab filter={filter} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="brand">
					{filterBar}
					<BrandWiseTab filter={filter} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="product">
					{filterBar}
					<ProductWiseTab filter={filter} formatMoney={formatMoney} />
				</TabsContent>

				<TabsContent value="minstock">
					<MinStockTab shopId={activeShopId ?? undefined} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function SellReportTab({ filter, formatMoney }: { filter: any; formatMoney: (n: number) => string }) {
	const { data, isLoading } = useSellReport(filter);
	const columns: Column<SellReportItem>[] = [
		{ header: "Invoice", accessor: s => s.invoiceNo },
		{ header: "Date", accessor: s => formatDate(s.createdAt) },
		{ header: "Customer", accessor: s => s.customer?.name ?? "Walk-in" },
		{ header: "Total", accessor: s => formatMoney(s.totalAmount) },
		{ header: "VAT", accessor: s => formatMoney(s.vatAmount) },
		{ header: "Paid", accessor: s => formatMoney(s.paidAmount) },
		{ header: "Due", accessor: s => formatMoney(s.dueAmount) },
		{ header: "Status", accessor: s => <Badge tone={s.status === "COMPLETED" ? "success" : "default"}>{s.status}</Badge> },
	];
	return (
		<>
			{data?.summary && (
				<div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
					<SummaryCard label="Sales" value={String(data.summary.totalSales)} />
					<SummaryCard label="Gross" value={formatMoney(data.summary.grossAmount)} />
					<SummaryCard label="Discount" value={formatMoney(data.summary.discountAmount)} />
					<SummaryCard label="VAT" value={formatMoney(data.summary.vatAmount)} />
					<SummaryCard label="Due" value={formatMoney(data.summary.dueAmount)} />
				</div>
			)}
			<DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} rowKey={s => s.id} emptyTitle="No sales in this range." />
		</>
	);
}

function DailySellTab({ shopId, formatMoney }: { shopId?: string; formatMoney: (n: number) => string }) {
	const { data, isLoading } = useDailySellReport({ shopId });
	if (isLoading || !data) return <EmptyState icon={BarChart3} title="Loading…" description="" />;
	const columns: Column<(typeof data.byBranch)[number]>[] = [
		{ header: "Branch", accessor: b => b.branchName },
		{ header: "Sales", accessor: b => b.sales },
		{ header: "Gross", accessor: b => formatMoney(b.grossAmount) },
		{ header: "VAT", accessor: b => formatMoney(b.vatAmount) },
		{ header: "Discount", accessor: b => formatMoney(b.discountAmount) },
		{ header: "Due", accessor: b => formatMoney(b.dueAmount) },
	];
	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
				<SummaryCard label={`Today (${data.date})`} value={String(data.totalSales) + " sales"} />
				<SummaryCard label="Gross" value={formatMoney(data.grossAmount)} />
				<SummaryCard label="VAT" value={formatMoney(data.vatAmount)} />
				<SummaryCard label="Due" value={formatMoney(data.dueAmount)} />
			</div>
			<DataTable columns={columns} data={data.byBranch} rowKey={b => b.branchId} emptyTitle="No sales today." />
		</>
	);
}

function VatReportTab({ filter, formatMoney }: { filter: any; formatMoney: (n: number) => string }) {
	const { data = [], isLoading } = useSellVatReport(filter);
	const columns: Column<VatReportRow>[] = [
		{ header: "Period", accessor: r => r.period },
		{ header: "Sales", accessor: r => r.count },
		{ header: "Total", accessor: r => formatMoney(r.totalAmount) },
		{ header: "VAT", accessor: r => formatMoney(r.vatAmount) },
	];
	return <DataTable columns={columns} data={data} isLoading={isLoading} rowKey={r => r.period} emptyTitle="No VAT data in this range." />;
}

function CategoryWiseTab({ filter, formatMoney }: { filter: any; formatMoney: (n: number) => string }) {
	const { data = [], isLoading } = useCategoryWiseSellReport(filter);
	const columns: Column<CategoryWiseSellRow>[] = [
		{ header: "Category", accessor: r => r.categoryName },
		{ header: "Qty Sold", accessor: r => r.qty },
		{ header: "Amount", accessor: r => formatMoney(r.amount) },
	];
	return (
		<DataTable
			columns={columns}
			data={data}
			isLoading={isLoading}
			rowKey={r => r.categoryId ?? "uncategorized"}
			emptyTitle="No sales in this range."
		/>
	);
}

function BrandWiseTab({ filter, formatMoney }: { filter: any; formatMoney: (n: number) => string }) {
	const { data = [], isLoading } = useBrandWiseSellReport(filter);
	const columns: Column<BrandWiseSellRow>[] = [
		{ header: "Brand", accessor: r => r.brandName },
		{ header: "Qty Sold", accessor: r => r.qty },
		{ header: "Amount", accessor: r => formatMoney(r.amount) },
	];
	return (
		<DataTable
			columns={columns}
			data={data}
			isLoading={isLoading}
			rowKey={r => r.brandId ?? "unbranded"}
			emptyTitle="No sales in this range."
		/>
	);
}

function ProductWiseTab({ filter, formatMoney }: { filter: any; formatMoney: (n: number) => string }) {
	const { data = [], isLoading } = useProductWiseSellReport(filter);
	const columns: Column<ProductWiseSellRow>[] = [
		{ header: "Product", accessor: r => r.productName },
		{ header: "Qty Sold", accessor: r => r.qty },
		{ header: "Discount", accessor: r => formatMoney(r.discount) },
		{ header: "VAT", accessor: r => formatMoney(r.vat) },
		{ header: "Amount", accessor: r => formatMoney(r.amount) },
	];
	return (
		<DataTable columns={columns} data={data} isLoading={isLoading} rowKey={r => r.productId} emptyTitle="No sales in this range." />
	);
}

function MinStockTab({ shopId }: { shopId?: string }) {
	const { data = [], isLoading } = useMinStockReport({ shopId });
	const columns: Column<MinStockRow>[] = [
		{ header: "Product", accessor: r => r.name },
		{ header: "SKU", accessor: r => r.sku },
		{ header: "Category", accessor: r => r.category ?? "—" },
		{ header: "Brand", accessor: r => r.brand ?? "—" },
		{ header: "On Hand", accessor: r => r.onHand },
		{ header: "Alert Qty", accessor: r => r.stockAlertQty },
		{
			header: "",
			accessor: r =>
				r.onHand <= 0 ? (
					<Badge tone="danger"><AlertTriangle className="w-3 h-3 mr-1 inline" />Out of stock</Badge>
				) : (
					<Badge tone="warning">Low stock</Badge>
				),
		},
	];
	return (
		<DataTable
			columns={columns}
			data={data}
			isLoading={isLoading}
			rowKey={r => r.productId}
			emptyTitle="Nothing below the alert threshold — stock levels look healthy."
		/>
	);
}

function SummaryCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-card p-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="text-lg font-semibold">{value}</p>
		</div>
	);
}
