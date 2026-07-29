"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CreditCard, Check, Clock, Gift } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { usePlans, useMySubscription, useCheckout } from "@/features/subscription/hooks/useSubscription";
import { DurationPickerModal } from "@/features/subscription/components/DurationPickerModal";
import { getRenewalWarning, isSubscriptionCurrentlyActive, isTrialEligible, planLimitLines } from "@/features/subscription/utils";
import type { Plan } from "@/features/subscription/types";
import { formatMoney, formatDate } from "@/lib/utils";

export default function SubscriptionPage() {
	const { data: plans = [], isLoading } = usePlans();
	const { data: me } = useMySubscription();
	const subscription = me?.subscription ?? null;
	const hasUsedTrial = me?.hasUsedTrial ?? false;
	const checkout = useCheckout();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [pickingPlan, setPickingPlan] = useState<Plan | null>(null);

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
		// Free tier never needs a duration/payment step. If there's still
		// paid/trial time left, the backend schedules the switch for period
		// end instead of throwing away what's already been paid for.
		if (Number(plan.price) === 0) {
			checkout.mutate({ planId: plan.id });
			return;
		}
		// Genuinely trial-eligible (never used a trial, no active subscription
		// right now) -> activate immediately, no payment, no modal. The
		// duration/payment picker only ever appears for an actual charge.
		if (isTrialEligible(plan, subscription, hasUsedTrial)) {
			checkout.mutate({ planId: plan.id });
			return;
		}
		setPickingPlan(plan);
	};

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
						const active = subscription?.planId === plan.id && !subscription?.scheduledPlanId;
						const isScheduled = subscription?.scheduledPlanId === plan.id;
						const isUpgrade = subscription?.plan && plan.price > subscription.plan.price;
						const isFree = Number(plan.price) === 0;
						const trialEligible = isTrialEligible(plan, subscription, hasUsedTrial);
						const activeOnTrial = active && isTrialing;

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
									{activeOnTrial && <Badge tone="info">On trial</Badge>}
									{active && !isTrialing && <Badge tone="success">Active</Badge>}
									{isScheduled && <Badge tone="warning">Scheduled</Badge>}
								</div>
								<p className="mt-2 text-2xl font-semibold text-slate-900">
									{formatMoney(plan.price)}
									<span className="text-sm font-normal text-slate-400"> /{plan.billingCycle?.toLowerCase()}</span>
								</p>
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

			<p className="mt-6 text-xs text-slate-400">
				Plans with a free trial never ask for payment up front. For paid checkouts you choose how long to prepay for
				(1 month up to multiple years — longer terms get a discount). Upgrades take effect immediately after payment
				via SSLCommerz. Downgrades — including switching to Free — take effect at the end of your current billing
				period, so you never lose time you&apos;ve already paid for.
			</p>

			<DurationPickerModal
				plan={pickingPlan}
				onClose={() => setPickingPlan(null)}
				isSubmitting={checkout.isPending}
				onConfirm={durationMonths => {
					if (!pickingPlan) return;
					checkout.mutate({ planId: pickingPlan.id, durationMonths });
					setPickingPlan(null);
				}}
			/>
		</div>
	);
}
