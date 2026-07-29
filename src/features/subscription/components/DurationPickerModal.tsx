"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { usePlanQuote } from "../hooks/useSubscription";
import { formatMoney } from "@/lib/utils";
import type { Plan } from "../types";

const PRESETS = [
	{ months: 1, label: "1 month" },
	{ months: 3, label: "3 months" },
	{ months: 6, label: "6 months" },
	{ months: 12, label: "1 year" },
	{ months: 24, label: "2 years" },
];

// Matches the backend's CheckoutDto hard cap (@Max(60)) — kept in sync so
// the picker can never even offer something the API would reject.
const MAX_MONTHS = 60;
const MAX_YEARS = 5;

interface DurationPickerModalProps {
	plan: Plan | null;
	onClose: () => void;
	onConfirm: (durationMonths: number) => void;
	isSubmitting?: boolean;
}

export function DurationPickerModal({ plan, onClose, onConfirm, isSubmitting }: DurationPickerModalProps) {
	const [months, setMonths] = useState(1);
	const [customMode, setCustomMode] = useState(false);
	const [customUnit, setCustomUnit] = useState<"months" | "years">("months");
	const [customAmount, setCustomAmount] = useState(1);

	const { data: quote, isFetching } = usePlanQuote(plan?.id, months);

	if (!plan) return null;

	const selectPreset = (m: number) => {
		setCustomMode(false);
		setMonths(m);
	};

	const applyCustom = (unit: "months" | "years", amount: number) => {
		setCustomUnit(unit);
		setCustomAmount(amount);
		setMonths(unit === "years" ? amount * 12 : amount);
	};

	const customUnitOptions = customUnit === "months"
		? Array.from({ length: 11 }, (_, i) => i + 1) // 1–11 months (12 = "1 year" preset already covers that)
		: Array.from({ length: MAX_YEARS }, (_, i) => i + 1); // 1–5 years

	return (
		<Modal open={!!plan} onClose={onClose} title={`Subscribe to ${plan.name}`} size="sm">
			<div className="space-y-4">
				<p className="text-sm text-slate-500">Choose how long you&apos;d like to prepay for. Longer terms get a discount.</p>

				<div className="flex flex-wrap gap-2">
					{PRESETS.map(p => (
						<button
							key={p.months}
							onClick={() => selectPreset(p.months)}
							className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
								!customMode && months === p.months
									? "border-slate-900 bg-slate-900 text-white"
									: "border-slate-200 text-slate-600 hover:border-slate-300"
							}`}
						>
							{p.label}
						</button>
					))}
					<button
						onClick={() => {
							setCustomMode(true);
							applyCustom(customUnit, customAmount);
						}}
						className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
							customMode ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
						}`}
					>
						Custom
					</button>
				</div>

				{customMode && (
					<div className="flex gap-2">
						<Select
							className="flex-1"
							value={customAmount}
							onChange={e => applyCustom(customUnit, Number(e.target.value))}
						>
							{customUnitOptions.map(n => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</Select>
						<Select
							className="flex-1"
							value={customUnit}
							onChange={e => {
								const unit = e.target.value as "months" | "years";
								// Reset to 1 when switching units so we never briefly hold an
								// out-of-range amount (e.g. "11 years").
								applyCustom(unit, 1);
							}}
						>
							<option value="months">Month(s)</option>
							<option value="years">Year(s)</option>
						</Select>
					</div>
				)}

				<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
					{isFetching || !quote ? (
						<div className="flex justify-center py-2">
							<Spinner />
						</div>
					) : (
						<>
							<div className="flex items-baseline justify-between">
								<span className="text-sm text-slate-500">{quote.months} month(s) total</span>
								{quote.discountPercent > 0 && <Badge tone="success">{quote.discountPercent}% off</Badge>}
							</div>
							<p className="mt-1 text-2xl font-semibold text-slate-900">{formatMoney(quote.amount)}</p>
							<p className="text-xs text-slate-400">≈ {formatMoney(quote.monthlyRate)} / month rate</p>
						</>
					)}
				</div>

				<Button
					className="w-full"
					disabled={isFetching || !quote || months < 1 || months > MAX_MONTHS}
					isLoading={isSubmitting}
					onClick={() => onConfirm(months)}
				>
					Continue to payment
				</Button>
			</div>
		</Modal>
	);
}
