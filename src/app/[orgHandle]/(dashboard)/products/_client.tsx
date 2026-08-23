"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Coins } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package } from "lucide-react";
import { useActiveShop } from "@/context/ActiveShopContext";
import { usePagination } from "@/hooks/usePagination";
import { useProducts, useDeleteProduct } from "@/features/product/hooks/useProducts";
import { ProductModal } from "@/features/product/components/ProductModal";
import { ProductPricesModal } from "@/features/product/components/ProductPricesModal";
import { CatalogQuickAdd } from "@/features/product/components/CatalogQuickAdd";
import type { Product } from "@/features/product/types";
import { useFormatMoney } from "@/hooks/useCurrency";

export default function ProductsPage() {
	const formatMoney = useFormatMoney();
	const { activeShopId, shops, isLoading: shopsLoading } = useActiveShop();
	const { page, limit, setPage } = usePagination(10);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
	const [pricingProduct, setPricingProduct] = useState<Product | null>(null);
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

	const openEdit = (p: Product) => setEditingProduct(p);
	const closeModal = () => {
		setModalOpen(false);
		setEditingProduct(null);
	};

	const columns: Column<Product>[] = [
		{ header: "Name", accessor: p => <span className="font-medium text-slate-900">{p.name}</span> },
		{ header: "SKU", accessor: p => p.sku },
		{ header: "Category", accessor: p => p.category?.name ?? <span className="text-slate-300">—</span> },
		{ header: "Brand", accessor: p => p.brand?.name ?? <span className="text-slate-300">—</span> },
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
				<div className="flex items-center gap-1">
					<button
						onClick={() => setPricingProduct(p)}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
						title="Multi-currency prices"
					>
						<Coins className="h-4 w-4" />
					</button>
					<button
						onClick={() => openEdit(p)}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
						title="Edit product"
					>
						<Pencil className="h-4 w-4" />
					</button>
					<button
						onClick={() => setDeletingProduct(p)}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
						title="Delete product"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
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

			{activeShopId && (
				<ProductModal
					open={modalOpen || !!editingProduct}
					onClose={closeModal}
					shopId={activeShopId}
					editingProduct={editingProduct}
				/>
			)}

			<ProductPricesModal product={pricingProduct} open={!!pricingProduct} onClose={() => setPricingProduct(null)} />

			<Modal open={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Remove this product?" size="sm">
				<div className="space-y-5">
					<p className="text-sm text-slate-600">
						<strong>{deletingProduct?.name}</strong> will be hidden from your catalog and stock lists. Past sales and
						receipts that already reference it are not affected — nothing gets deleted from your sales history.
					</p>
					<div className="grid grid-cols-2 gap-2">
						<Button variant="outline" onClick={() => setDeletingProduct(null)} disabled={deleteProduct.isPending}>
							Cancel
						</Button>
						<Button
							variant="danger"
							isLoading={deleteProduct.isPending}
							onClick={() => {
								if (!deletingProduct) return;
								deleteProduct.mutate(deletingProduct.id, { onSuccess: () => setDeletingProduct(null) });
							}}
						>
							Remove product
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
