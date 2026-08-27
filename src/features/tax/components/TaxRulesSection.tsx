"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SelectField, TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useConfirm } from "@/context/ConfirmDialogContext";
import { useCategories } from "@/features/product/hooks/useCatalog";
import { useCreateTaxRule, useDeleteTaxRule, useTaxRules, useUpdateTaxRule } from "@/features/tax/hooks/useTaxRules";

interface TaxRulesSectionProps {
	shopId?: string;
}

/**
 * Tax-jurisdiction/rate/rule engine settings UI (hardening item: "Add a
 * proper tax-jurisdiction/rate/rule engine" — backend built previously;
 * this is the previously-missing management screen). A rule left with no
 * country and no category, marked "shop default", is what applies when
 * nothing more specific matches — see resolveRate() on the backend for
 * the exact specificity order.
 */
export function TaxRulesSection({ shopId }: TaxRulesSectionProps) {
	const { data: rules, isLoading } = useTaxRules(shopId);
	const { data: categories } = useCategories(shopId);
	const createRule = useCreateTaxRule();
	const updateRule = useUpdateTaxRule(shopId);
	const deleteRule = useDeleteTaxRule(shopId);
	const confirm = useConfirm();

	const [name, setName] = useState("");
	const [ratePercent, setRatePercent] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [isDefault, setIsDefault] = useState(false);

	if (!shopId) {
		return <p className="text-sm text-slate-400">Select a shop to manage its tax rules.</p>;
	}

	const resetForm = () => {
		setName(""); setRatePercent(""); setCountryCode(""); setCategoryId(""); setIsDefault(false);
	};

	const onAdd = () => {
		if (!name || !ratePercent) return;
		createRule.mutate(
			{
				shopId,
				name,
				ratePercent: Number(ratePercent),
				countryCode: countryCode || undefined,
				categoryId: categoryId || undefined,
				isDefault,
			},
			{ onSuccess: resetForm },
		);
	};

	const scopeLabel = (rule: { countryCode?: string | null; category?: { name: string } | null; isDefault: boolean }) => {
		const parts: string[] = [];
		if (rule.category?.name) parts.push(rule.category.name);
		if (rule.countryCode) parts.push(rule.countryCode);
		if (parts.length) return parts.join(" / ");
		return rule.isDefault ? "Shop-wide default" : "No scope (inactive until scoped or set as default)";
	};

	const onDelete = async (rule: { id: string; name: string }) => {
		const result = await confirm({
			title: "Delete this tax rule?",
			description: `This will permanently delete "${rule.name}". Sales that already used it keep their recorded VAT — only future calculations are affected.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (result) deleteRule.mutate(rule.id);
	};

	return (
		<div className="space-y-4">
			<p className="text-sm text-slate-500">
				Sales without an explicit VAT amount auto-calculate tax from these rules — the most
				specific match wins: category + country, then category, then country, then the
				shop-wide default below. A manually-entered VAT on a sale always overrides this.
			</p>

			{isLoading ? (
				<div className="text-sm text-slate-400">Loading…</div>
			) : (rules?.length ?? 0) > 0 ? (
				<div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
					{rules!.map(rule => (
						<div key={rule.id} className="flex items-center justify-between px-3 py-2.5">
							<div>
								<div className="flex items-center gap-2">
									<span className="font-medium text-slate-900">{rule.name}</span>
									<span className="text-slate-600">{Number(rule.ratePercent).toFixed(2)}%</span>
									{rule.isDefault && (
										<span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">Default</span>
									)}
									{!rule.isActive && (
										<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Inactive</span>
									)}
								</div>
								<div className="text-xs text-slate-400">{scopeLabel(rule)}</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => updateRule.mutate({ id: rule.id, payload: { isActive: !rule.isActive } })}
									className="text-xs font-medium text-slate-500 hover:text-slate-800"
								>
									{rule.isActive ? "Disable" : "Enable"}
								</button>
								<button
									onClick={() => onDelete(rule)}
									className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
									aria-label={`Remove ${rule.name}`}
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-400">
					No tax rules yet — sales default to 0% VAT unless one is manually entered per sale.
				</div>
			)}

			<div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
				<TextField id="tax-rule-name" label="Rule name" placeholder="e.g. Standard VAT" value={name} onChange={e => setName(e.target.value)} />
				<TextField id="tax-rule-rate" label="Rate %" type="number" min="0" max="100" step="0.01" value={ratePercent} onChange={e => setRatePercent(e.target.value)} />
				<SelectField id="tax-rule-category" label="Category (optional)" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
					<option value="">All categories</option>
					{(categories ?? []).map(c => (
						<option key={c.id} value={c.id}>{c.name}</option>
					))}
				</SelectField>
				<TextField
					id="tax-rule-country"
					label="Country code (optional)"
					placeholder="e.g. BD"
					value={countryCode}
					onChange={e => setCountryCode(e.target.value.toUpperCase())}
					maxLength={2}
				/>
				<label className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
					<input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} className="rounded border-slate-300" />
					Use as the shop-wide default (applies when nothing more specific matches)
				</label>
				<Button onClick={onAdd} isLoading={createRule.isPending} disabled={!name || !ratePercent} className="sm:col-span-2">
					<Plus className="h-4 w-4" /> Add tax rule
				</Button>
			</div>
		</div>
	);
}
