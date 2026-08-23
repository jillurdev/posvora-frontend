"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { currencyService } from "@/services/currency.service";
import { useProductPrices, useUpsertProductPrice, useRemoveProductPrice } from "../hooks/useProducts";
import type { Product } from "../types";

interface ProductPricesModalProps {
	product: Product | null;
	open: boolean;
	onClose: () => void;
}

/**
 * Lets an owner/manager set an explicit override price for a product in a
 * specific currency (e.g. a deliberately-rounded $9.99 for a USD
 * storefront, instead of an automatic FX conversion of the shop-currency
 * price). Without an override here, checkout falls back to converting
 * `sellingPrice` at the live exchange rate — see
 * ProductService.getEffectivePrice() on the backend.
 */
export function ProductPricesModal({ product, open, onClose }: ProductPricesModalProps) {
	const { data: currencies } = useQuery({ queryKey: ["currencies"], queryFn: () => currencyService.list() });
	const { data: prices, isLoading } = useProductPrices(product?.id);
	const upsertPrice = useUpsertProductPrice();
	const removePrice = useRemoveProductPrice();

	const [currencyCode, setCurrencyCode] = useState("");
	const [sellingPrice, setSellingPrice] = useState("");

	useEffect(() => {
		if (open) {
			setCurrencyCode("");
			setSellingPrice("");
		}
	}, [open, product?.id]);

	if (!product) return null;

	const usedCodes = new Set((prices ?? []).map(p => p.currencyCode));
	const availableCurrencies = (currencies ?? []).filter(c => !usedCodes.has(c.code));

	const onAdd = () => {
		if (!currencyCode || !sellingPrice) return;
		upsertPrice.mutate(
			{ productId: product.id, payload: { currencyCode, sellingPrice: Number(sellingPrice) } },
			{ onSuccess: () => { setCurrencyCode(""); setSellingPrice(""); } },
		);
	};

	return (
		<Modal open={open} onClose={onClose} title={`Multi-currency prices — ${product.name}`}>
			<div className="space-y-4">
				<p className="text-sm text-slate-500">
					By default this product sells for its shop-currency price, converted at the live exchange rate.
					Add a currency below to set an explicit price instead (e.g. a rounded USD price for
					international customers).
				</p>

				{isLoading ? (
					<div className="text-sm text-slate-400">Loading…</div>
				) : (prices?.length ?? 0) > 0 ? (
					<div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
						{prices!.map(p => (
							<div key={p.id} className="flex items-center justify-between px-3 py-2">
								<div>
									<span className="font-medium text-slate-900">{p.currencyCode}</span>
									<span className="ml-2 text-slate-600">{p.sellingPrice.toFixed(2)}</span>
								</div>
								<button
									onClick={() => removePrice.mutate({ productId: product.id, currencyCode: p.currencyCode })}
									className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
									aria-label={`Remove ${p.currencyCode} price`}
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
				) : (
					<div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-400">
						No currency overrides yet — this product uses converted shop-currency pricing everywhere.
					</div>
				)}

				<div className="flex items-end gap-2 border-t border-slate-100 pt-4">
					<SelectField
						id="product-price-currency"
						label="Currency"
						value={currencyCode}
						onChange={e => setCurrencyCode(e.target.value)}
						className="flex-1"
					>
						<option value="">Select currency…</option>
						{availableCurrencies.map(c => (
							<option key={c.code} value={c.code}>{c.code} — {c.name}</option>
						))}
					</SelectField>
					<TextField
						id="product-price-amount"
						label="Selling price"
						type="number"
						min="0"
						step="0.01"
						value={sellingPrice}
						onChange={e => setSellingPrice(e.target.value)}
						className="flex-1"
					/>
					<Button onClick={onAdd} isLoading={upsertPrice.isPending} disabled={!currencyCode || !sellingPrice}>
						<Plus className="h-4 w-4" /> Add
					</Button>
				</div>
			</div>
		</Modal>
	);
}
