"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CreditCard, Check, Clock, Gift } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { usePlans, useMySubscription, useCheckout, useCancelSubscription } from "@/features/subscription/hooks/useSubscription";
import { DurationPickerModal } from "@/features/subscription/components/DurationPickerModal";
import { ConfirmPlanActionModal } from "@/features/subscription/components/ConfirmPlanActionModal";
import { getRenewalWarning, isSubscriptionCurrentlyActive, isTrialEligible, planLimitLines } from "@/features/subscription/utils";
import type { Plan } from "@/features/subscription/types";
import type { PaymentGateway } from "@/features/subscription/api";
import { formatMoney, formatDate } from "@/lib/utils";

type PendingConfirm = { plan: Plan; kind: "trial" | "free-immediate" | "free-scheduled" };

export default function SubscriptionPage() {
	const { data: plans = [], isLoading } = usePlans();
	const { data: me } = useMySubscription();
	const subscription = me?.subscription ?? null;
	const hasUsedTrial = me?.hasUsedTrial ?? false;
	const orgCountry = me?.country ?? "BD";
	const isIntl = orgCountry !== "BD";
	const isIndia = orgCountry === "IN";
	const checkout = useCheckout();
	const cancelSubscription = useCancelSubscription();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [pickingPlan, setPickingPlan] = useState<Plan | null>(null);
	const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);

	// SSLCommerz redirects the browser back here with ?payment=success|failed|cancelled
	// after the customer completes (or abandons) checkout.
	const handledPaymentParam = useRef(false);
	useEffect(() => {
		const payment = searchParams.get("payment");
		if (!payment || handledPaymentParam.current) return;
		handledPaymentParam.current = true;

		if (payment === "success") toast.success("Payment received — your subscription is now active.");
		else if (payment === "failed") toast.error("Payment failed. Please try again.");
		else if (payment === "cancelled") toast.info("Payment was cancelled.");

		router.replace(window.location.pathname);
	}, [searchParams, router]);

	const isTrialing = subscription?.status === "TRIALING";
	const isOnFreePlan = subscription?.plan?.price === 0;
	const renewalDate = isTrialing ? subscription?.trialEndsAt : subscription?.currentEnd;
	const hasSomethingToLose = isSubscriptionCurrentlyActive(subscription); // paid time or an unused trial in progress
	const warning = getRenewalWarning(subscription);

	const handlePick = (plan: Plan) => {
		// Every plan action gets an explicit confirm step — nothing fires on
		// the first click, even the free/no-payment paths.
		if (Number(plan.price) === 0) {
			setPendingConfirm({ plan, kind: hasSomethingToLose ? "free-scheduled" : "free-immediate" });
			return;
		}
		if (isTrialEligible(plan, subscription, hasUsedTrial)) {
			setPendingConfirm({ plan, kind: "trial" });
			return;
		}
		setPickingPlan(plan);
	};

	const confirmCopy = (() => {
		if (!pendingConfirm) return null;
		const { plan, kind } = pendingConfirm;
		if (kind === "trial") {
			return {
				title: `Start your ${plan.trialDays}-day free trial?`,
				description: `You'll get full access to the ${plan.name} plan for ${plan.trialDays} days, completely free — no card, no payment. We'll remind you well before it ends so you can decide whether to continue.`,
				confirmLabel: "Start free trial",
			};
		}
		if (kind === "free-scheduled") {
			return {
				title: "Switch to the Free plan?",
				description: `You've already paid for your current plan, so nothing changes right now — you'll keep full access until ${renewalDate ? formatDate(renewalDate) : "your current period ends"}. After that, your organization moves to the Free plan (limited features) automatically.`,
				confirmLabel: "Schedule switch to Free",
			};
		}
		return {
			title: "Switch to the Free plan?",
			description: "Your organization will move to the Free plan right away — limited branches, staff accounts, storage, and API calls. You can upgrade again anytime.",
			confirmLabel: "Switch now",
		};
	})();

	return (
		<div>
			<PageHeader
				title="Subscription"
				description={
					subscription
						? `Current plan: ${subscription.plan?.name ?? "—"} · renews ${renewalDate ? formatDate(renewalDate) : "—"}`
						: "Choose a plan for your organization."
				}
			/>

			{warning && (
				<div
					className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
						warning.level === "urgent" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-800"
					}`}
				>
					<AlertTriangle className="h-4 w-4 shrink-0" />
					{warning.daysLeft === 0 ? (
						<>Your {warning.isTrial ? "free trial" : "plan"} ends <strong>today</strong> — renew now to avoid interruption.</>
					) : (
						<>
							Your {warning.isTrial ? "free trial" : "plan"} ends in <strong>{warning.daysLeft}</strong> day
							{warning.daysLeft === 1 ? "" : "s"}. Please renew as soon as possible — after it ends,{" "}
							{warning.isTrial
								? "you'll move to the Free plan automatically"
								: "premium features will stop and you'll be moved to the Free plan (limited features)"}
							.
						</>
					)}
				</div>
			)}

			{isTrialing && !warning && (
				<div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
					<Gift className="h-4 w-4 shrink-0" />
					You&apos;re using your free trial for the <strong>{subscription?.plan?.name}</strong> plan — completely free, no payment needed
					{renewalDate ? ` until ${formatDate(renewalDate)}` : ""}.
				</div>
			)}

			{isOnFreePlan && (
				<div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
					<Clock className="h-4 w-4 shrink-0" />
					You&apos;re on the <strong>Free</strong> plan — some features are limited. Upgrade anytime below.
				</div>
			)}

			{Number(subscription?.creditBalance ?? 0) > 0 && (
				<div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
					<Check className="h-4 w-4 shrink-0" />
					You have <strong>{formatMoney(subscription!.creditBalance!)}</strong> in credit banked from a previous plan change — it'll be
					applied automatically to your next upgrade.
				</div>
			)}

			{subscription?.autoRenew && subscription?.gatewaySubscriptionId && (
				<div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
					<div className="flex items-center gap-2">
						<CreditCard className="h-4 w-4 shrink-0 text-slate-500" />
						Auto-renewing via Stripe — your card will be charged automatically
						{subscription.nextBillingAt ? ` on ${formatDate(subscription.nextBillingAt)}` : " each billing cycle"}.
					</div>
					<Button
						variant="outline"
						size="sm"
						isLoading={cancelSubscription.isPending}
						onClick={() => {
							if (window.confirm("Stop auto-renewing? Your subscription stays active until the current period ends, then moves to the Free plan.")) {
								cancelSubscription.mutate();
							}
						}}
					>
						Cancel auto-renew
					</Button>
				</div>
			)}

			{subscription?.scheduledPlanId && subscription.scheduledPlan && (
				<div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
					<Clock className="h-4 w-4 shrink-0" />
					Switching to <strong>{subscription.scheduledPlan.name}</strong> on{" "}
					{subscription.scheduledEffectiveAt ? formatDate(subscription.scheduledEffectiveAt) : "your next billing date"}. No payment needed until then.
				</div>
			)}

			{isLoading ? (
				<Spinner />
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{plans.map(plan => {
						// The plan the org is actually on right now — independent of
						// any downgrade scheduled for later, which is a separate thing.
						const active = subscription?.planId === plan.id;
						const isScheduled = subscription?.scheduledPlanId === plan.id;
						const isUpgrade = subscription?.plan && plan.price > subscription.plan.price;
						const isFree = Number(plan.price) === 0;
						const trialEligible = isTrialEligible(plan, subscription, hasUsedTrial);
						const activeOnTrial = active && isTrialing;

						// Everyone can always pay in BDT via SSLCommerz, regardless of
						// their own country — Stripe/USD is simply an additional option
						// when this plan has international pricing set. So the teaser
						// price here shows USD only when available; otherwise it falls
						// back to BDT, which is never unavailable. The actual choice of
						// which to pay with happens in the duration/payment picker.
						const showUsd = isIntl && !isFree && plan.priceUsd != null;
						const displayPrice = showUsd ? plan.priceUsd : plan.price;

						let label = "Subscribe";
						if (active) label = "Current plan";
						else if (isScheduled) label = "Scheduled";
						else if (isFree) label = hasSomethingToLose ? "Downgrade to Free (at period end)" : "Switch to Free";
						else if (trialEligible) label = `Start ${plan.trialDays}-day free trial`;
						else if (subscription?.plan) label = isUpgrade ? "Upgrade" : "Switch to this plan";

						return (
							<div key={plan.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
									<div className="flex gap-1.5">
										{active && <Badge tone={activeOnTrial ? "info" : "success"}>{activeOnTrial ? "On trial" : "Active"}</Badge>}
										{isScheduled && <Badge tone="warning">Scheduled</Badge>}
									</div>
								</div>
								{active && subscription?.scheduledPlan && (
									<p className="mt-0.5 text-xs text-amber-600">Switching to {subscription.scheduledPlan.name} soon</p>
								)}
								<p className="mt-2 text-2xl font-semibold text-slate-900">
									{formatMoney(displayPrice ?? 0, showUsd ? "USD" : "BDT")}
									<span className="text-sm font-normal text-slate-400"> /{plan.billingCycle?.toLowerCase()}</span>
								</p>
								{!isFree && plan.priceUsd != null && (
									<p className="mt-0.5 text-xs text-slate-400">
										or {formatMoney(showUsd ? plan.price : plan.priceUsd, showUsd ? "BDT" : "USD")} via{" "}
										{showUsd ? "SSLCommerz" : "Stripe"}
									</p>
								)}
								{!isFree && plan.trialDays ? (
									<p className={`mt-1 text-xs ${trialEligible ? "font-medium text-emerald-600" : "text-slate-400"}`}>
										{activeOnTrial
											? "You're using your free trial for this plan"
											: `${plan.trialDays}-day free trial ${trialEligible ? "available — no card needed" : "(already used)"}`}
									</p>
								) : null}

								<ul className="mt-4 space-y-1.5 text-sm text-slate-600">
									{planLimitLines(plan).map(line => (
										<li key={line} className="flex items-center gap-2">
											<Check className="h-4 w-4 text-emerald-500" /> {line}
										</li>
									))}
									{plan.features?.map(f => (
										<li key={f} className="flex items-center gap-2">
											<Check className="h-4 w-4 text-emerald-500" /> {f}
										</li>
									))}
								</ul>

								<Button
									className="mt-6 w-full"
									variant={active ? "outline" : "primary"}
									disabled={active || isScheduled}
									isLoading={checkout.isPending && checkout.variables?.planId === plan.id}
									onClick={() => handlePick(plan)}
								>
									{label}
								</Button>
							</div>
						);
					})}
					{plans.length === 0 && (
						<div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
							<CreditCard className="mb-3 h-10 w-10" />
							No plans available yet.
						</div>
					)}
				</div>
			)}

			{!!subscription?.invoices?.length && (
				<div className="mt-8">
					<h3 className="mb-3 text-sm font-semibold text-slate-700">Billing history</h3>
					<div className="overflow-hidden rounded-xl border border-slate-200">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-2.5 font-medium">Date</th>
									<th className="px-4 py-2.5 font-medium">Plan</th>
									<th className="px-4 py-2.5 font-medium">Method</th>
									<th className="px-4 py-2.5 font-medium">Amount</th>
									<th className="px-4 py-2.5 font-medium">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{subscription.invoices.map(inv => (
									<tr key={inv.id}>
										<td className="px-4 py-2.5 text-slate-600">{formatDate(inv.paidAt ?? inv.createdAt)}</td>
										<td className="px-4 py-2.5 text-slate-700">{inv.plan?.name ?? "—"}</td>
										<td className="px-4 py-2.5 text-slate-500">{inv.paymentMethod ?? "—"}</td>
										<td className="px-4 py-2.5 font-medium text-slate-900">{formatMoney(inv.amount, inv.currency)}</td>
										<td className="px-4 py-2.5">
											<Badge tone={inv.status === "PAID" ? "success" : inv.status === "UNPAID" ? "warning" : "danger"}>
												{inv.status}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<p className="mt-6 text-xs text-slate-400">
				&quot;Staff accounts&quot; are the people who log in to run your business — cashiers, managers, etc. — not your
				shop&apos;s customers, who are unlimited on every plan. Plans with a free trial never ask for payment up front.
				For paid checkouts you choose how long to prepay for (1 month up to multiple years — longer terms get a
				discount), and any unused time on your current plan is credited toward an upgrade. Downgrades — including
				switching to Free — take effect at the end of your current billing period, so you never lose time you&apos;ve
				already paid for.
			</p>

			<DurationPickerModal
				plan={pickingPlan}
				onClose={() => setPickingPlan(null)}
				isSubmitting={checkout.isPending}
				defaultGateway={(orgCountry === "BD" ? "SSLCOMMERZ" : isIndia ? "RAZORPAY" : "STRIPE") as PaymentGateway}
				razorpayAvailable={isIndia}
				onConfirm={(durationMonths, gateway, autoRenew) => {
					if (!pickingPlan) return;
					checkout.mutate({ planId: pickingPlan.id, durationMonths, gateway, autoRenew });
					setPickingPlan(null);
				}}
			/>

			{pendingConfirm && confirmCopy && (
				<ConfirmPlanActionModal
					open={!!pendingConfirm}
					title={confirmCopy.title}
					description={confirmCopy.description}
					confirmLabel={confirmCopy.confirmLabel}
					isLoading={checkout.isPending}
					onClose={() => setPendingConfirm(null)}
					onConfirm={() => {
						checkout.mutate({ planId: pendingConfirm.plan.id });
						setPendingConfirm(null);
					}}
				/>
			)}
		</div>
	);
}
