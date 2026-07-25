"use client";

import { CreditCard, Check } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { usePlans, useMySubscription, useSubscribe } from "@/features/subscription/hooks/useSubscription";
import { formatMoney, formatDate } from "@/lib/utils";

export default function SubscriptionPage() {
	const { data: plans = [], isLoading } = usePlans();
	const { data: subscription } = useMySubscription();
	const subscribe = useSubscribe();

	return (
		<div>
			<PageHeader
				title="Subscription"
				description={
					subscription
						? `Current plan: ${subscription.plan?.name ?? "—"} · renews ${subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "—"}`
						: "Choose a plan for your organization."
				}
			/>

			{isLoading ? (
				<Spinner />
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{plans.map(plan => {
						const active = subscription?.planId === plan.id;
						return (
							<div key={plan.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
									{active && <Badge tone="success">Active</Badge>}
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
									disabled={active}
									isLoading={subscribe.isPending}
									onClick={() => subscribe.mutate(plan.id)}
								>
									{active ? "Current plan" : "Subscribe"}
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
		</div>
	);
}
