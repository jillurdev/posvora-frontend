"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { usePlans, useMySubscription, useCheckout } from "@/features/subscription/hooks/useSubscription";
import { formatMoney, formatDate } from "@/lib/utils";

export default function SubscriptionPage() {
	const { data: plans = [], isLoading } = usePlans();
	const { data: subscription } = useMySubscription();
	const checkout = useCheckout();
	const router = useRouter();
	const searchParams = useSearchParams();

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

	const renewalDate = subscription?.status === "TRIALING" ? subscription.trialEndsAt : subscription?.currentEnd;

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

						let label = "Subscribe";
						if (active) label = "Current plan";
						else if (isScheduled) label = "Scheduled";
						else if (subscription?.plan) label = isUpgrade ? "Upgrade" : "Switch to this plan";

						return (
							<div key={plan.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
									{active && <Badge tone="success">Active</Badge>}
									{isScheduled && <Badge tone="warning">Scheduled</Badge>}
								</div>
								<p className="mt-2 text-2xl font-semibold text-slate-900">
									{formatMoney(plan.price)}
									<span className="text-sm font-normal text-slate-400"> /{plan.billingCycle?.toLowerCase()}</span>
								</p>
								<ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
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
									isLoading={checkout.isPending && checkout.variables === plan.id}
									onClick={() => checkout.mutate(plan.id)}
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
				Upgrades take effect immediately after payment via SSLCommerz. Downgrades take effect at the end of your
				current billing period — you keep your current plan until then, no extra charge.
			</p>
		</div>
	);
}
