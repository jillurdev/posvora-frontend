"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package } from "lucide-react";
import { useActiveShop } from "@/context/ActiveShopContext";
import { usePagination } from "@/hooks/usePagination";
import { useProducts, useDeleteProduct } from "@/features/product/hooks/useProducts";
import { ProductModal } from "@/features/product/components/ProductModal";
import { CatalogQuickAdd } from "@/features/product/components/CatalogQuickAdd";
import type { Product } from "@/features/product/types";
import { formatMoney } from "@/lib/utils";

export default function ProductsPage() {
	const { activeShopId, shops, isLoading: shopsLoading } = useActiveShop();
	const { page, limit, setPage } = usePagination(10);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const deleteProduct = useDeleteProduct();

	const { data, isLoading } = useProducts({
		shopId: activeShopId ?? "",
		search: search || undefined,
		page,
		limit,
	});

	if (!shopsLoading && shops.length === 0) {
		return (
			<EmptyState
				icon={Package}
				title="Create a shop first"
				description="You need at least one shop before you can add products."
			/>
		);
	}

	const columns: Column<Product>[] = [
		{ header: "Name", accessor: p => <span className="font-medium text-slate-900">{p.name}</span> },
		{ header: "SKU", accessor: p => p.sku },
		{ header: "Cost", accessor: p => (p.costPrice != null ? formatMoney(p.costPrice) : "—") },
		{ header: "Selling", accessor: p => (p.sellingPrice != null ? formatMoney(p.sellingPrice) : "—") },
		{
			header: "Tracking",
			accessor: p => (
				<div className="flex flex-wrap gap-1">
					{p.trackSerial && <Badge tone="info">Serial</Badge>}
					{p.trackImei && <Badge tone="info">IMEI</Badge>}
					{p.trackBatch && <Badge tone="info">Batch</Badge>}
					{p.trackExpiry && <Badge tone="warning">Expiry</Badge>}
					{!p.trackSerial && !p.trackImei && !p.trackBatch && !p.trackExpiry && <span className="text-slate-300">—</span>}
				</div>
			),
		},
		{
			header: "",
			accessor: p => (
				<button
					onClick={() => deleteProduct.mutate(p.id)}
					className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
				>
					<Trash2 className="h-4 w-4" />
				</button>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Products"
				description="Manage your catalog: products, categories, brands and units."
				action={
					<Button onClick={() => setModalOpen(true)} disabled={!activeShopId}>
						<Plus className="h-4 w-4" /> Add product
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap items-center gap-2">
				{activeShopId && (
					<>
						<CatalogQuickAdd shopId={activeShopId} kind="category" label="Category" />
						<CatalogQuickAdd shopId={activeShopId} kind="brand" label="Brand" />
						<CatalogQuickAdd shopId={activeShopId} kind="unit" label="Unit" />
					</>
				)}
				<div className="ml-auto">
					<SearchInput value={search} onChange={setSearch} placeholder="Search products..." />
				</div>
			</div>

			<DataTable
				columns={columns}
				data={data?.data ?? []}
				isLoading={isLoading}
				rowKey={p => p.id}
				emptyTitle="No products yet"
				emptyDescription="Add your first product to start selling."
			/>

			{data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}

			{activeShopId && <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} shopId={activeShopId} />}
		</div>
	);
}
