"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { usePlanQuote } from "../hooks/useSubscription";
import type { PaymentGateway } from "../api";
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
	onConfirm: (durationMonths: number | undefined, gateway: PaymentGateway, autoRenew: boolean) => void;
	isSubmitting?: boolean;
	// Which gateway to preselect — typically the org's country-based
	// default (BD -> SSLCommerz, IN -> Razorpay, else -> Stripe). The
	// customer can always switch to another option below; this is only a
	// starting point, never a restriction.
	defaultGateway?: PaymentGateway;
	// Offer the Razorpay/INR option — only when this plan has an INR
	// PlanPrice configured (mirrors the existing stripeAvailable check for
	// plan.priceUsd below).
	razorpayAvailable?: boolean;
}

export function DurationPickerModal({ plan, onClose, onConfirm, isSubmitting, defaultGateway = "SSLCOMMERZ", razorpayAvailable }: DurationPickerModalProps) {
	const [months, setMonths] = useState(1);
	const [customMode, setCustomMode] = useState(false);
	const [customUnit, setCustomUnit] = useState<"months" | "years">("months");
	const [customAmount, setCustomAmount] = useState(1);
	const [gateway, setGateway] = useState<PaymentGateway>(defaultGateway);
	// Real recurring Stripe billing instead of a fixed-term prepay — see
	// StripeService.initRecurringCheckoutSession on the backend. Stripe-only,
	// and mutually exclusive with a chosen duration (the backend rejects
	// combining them), so picking this hides the duration/discount picker.
	const [autoRenew, setAutoRenew] = useState(false);

	// Re-sync when a different plan is opened (e.g. the picker's default
	// should reflect the org's own default each time it's freshly opened).
	useEffect(() => {
		if (plan) { setGateway(defaultGateway); setAutoRenew(false); }
	}, [plan?.id, defaultGateway]);

	const { data: quote, isFetching } = usePlanQuote(plan?.id, months, gateway);

	if (!plan) return null;

	// Stripe/USD is only offered once this plan has international pricing
	// set — otherwise there's nothing to switch to and the toggle would
	// just be confusing.
	const stripeAvailable = plan.priceUsd != null;

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

				{(stripeAvailable || razorpayAvailable) && (
					<div>
						<p className="mb-1.5 text-xs font-medium text-slate-500">Pay with</p>
						<div className="flex gap-2">
							<button
								onClick={() => { setGateway("SSLCOMMERZ"); setAutoRenew(false); }}
								className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
									gateway === "SSLCOMMERZ"
										? "border-slate-900 bg-slate-900 text-white"
										: "border-slate-200 text-slate-600 hover:border-slate-300"
								}`}
							>
								৳ BDT — SSLCommerz
							</button>
							{stripeAvailable && (
								<button
									onClick={() => setGateway("STRIPE")}
									className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
										gateway === "STRIPE"
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 text-slate-600 hover:border-slate-300"
									}`}
								>
									$ USD — Card (Stripe)
								</button>
							)}
							{razorpayAvailable && (
								<button
									onClick={() => { setGateway("RAZORPAY"); setAutoRenew(false); }}
									className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
										gateway === "RAZORPAY"
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 text-slate-600 hover:border-slate-300"
									}`}
								>
									₹ INR — Razorpay
								</button>
							)}
						</div>
					</div>
				)}

				{gateway === "STRIPE" && (
					<label className="flex items-start gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600">
						<input
							type="checkbox"
							checked={autoRenew}
							onChange={e => setAutoRenew(e.target.checked)}
							className="mt-0.5 rounded border-slate-300"
						/>
						<span>
							<span className="font-medium text-slate-800">Auto-renew with Stripe</span> — we&apos;ll save your card and
							charge it automatically each {plan.billingCycle?.toLowerCase()}, so you never have to manually renew.
							Cancel anytime.
						</span>
					</label>
				)}

				{!autoRenew && (
					<>
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
							{quote.unavailable ? (
								<p className="text-sm text-amber-600">
									This plan doesn&apos;t have international pricing set up yet — please contact support.
								</p>
							) : quote.creditAmount > 0 ? (
								<>
									<p className="mt-1 text-sm text-slate-400 line-through">{formatMoney(quote.listAmount, quote.currency)}</p>
									<p className="text-2xl font-semibold text-slate-900">{formatMoney(quote.amount, quote.currency)}</p>
									<p className="text-xs text-emerald-600">
										Includes {formatMoney(quote.creditAmount, quote.currency)} credit for unused time on your current plan
									</p>
								</>
							) : (
								<>
									<p className="mt-1 text-2xl font-semibold text-slate-900">{formatMoney(quote.amount, quote.currency)}</p>
									<p className="text-xs text-slate-400">≈ {formatMoney(quote.monthlyRate, quote.currency)} / month rate</p>
								</>
							)}
						</>
					)}
				</div>
					</>
				)}

				{autoRenew && (
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
						<p className="text-sm text-slate-500">Billed automatically every</p>
						<p className="text-2xl font-semibold text-slate-900">{plan.billingCycle?.toLowerCase()}</p>
						<p className="mt-1 text-xs text-slate-400">
							{formatMoney(plan.priceUsd ?? 0, "USD")} / {plan.billingCycle?.toLowerCase()}, charged to your card automatically.
						</p>
					</div>
				)}

				<Button
					className="w-full"
					disabled={autoRenew ? false : (isFetching || !quote || quote.unavailable || months < 1 || months > MAX_MONTHS)}
					isLoading={isSubmitting}
					onClick={() => onConfirm(autoRenew ? undefined : months, gateway, autoRenew)}
				>
					{autoRenew
						? "Continue to payment — auto-renew"
						: quote && quote.amount === 0 && quote.listAmount > 0
							? "Activate — fully covered by credit"
							: "Continue to payment"}
				</Button>
			</div>
		</Modal>
	);
}
