"use client";

import Link from "next/link";
import { Check, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePlans } from "@/features/subscription/hooks/useSubscription";
import { formatMoney } from "@/lib/utils";

export default function PricingPage() {
	// Pulled live from /subscription/plans (the same public, unauthenticated
	// endpoint the in-app Subscription page uses) instead of a hardcoded list,
	// so this page can never drift out of sync with what customers are
	// actually offered after they sign up.
	const { data: plans = [], isLoading, isError } = usePlans();
	const hasFreePlan = plans.some(p => Number(p.price) === 0);
	const hasTrial = plans.some(p => (p.trialDays ?? 0) > 0);

	const subheading = hasFreePlan
		? "Start free, upgrade when you need more branches, staff or storage. No hidden fees."
		: hasTrial
			? "Try any plan free, upgrade when you need more branches, staff or storage. No hidden fees."
			: "Simple, transparent plans that scale with your business. No hidden fees.";

	return (
		<div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
			<div className="mx-auto max-w-2xl text-center">
				<span className="text-sm font-medium text-slate-400">Pricing</span>
				<h1 className="mt-2 text-4xl font-semibold text-slate-900">Simple pricing that scales with you</h1>
				<p className="mt-4 text-lg text-slate-500">{subheading}</p>
			</div>

			{isLoading && (
				<div className="mt-14 flex justify-center">
					<Spinner />
				</div>
			)}

			{isError && (
				<div className="mt-14">
					<EmptyState
						icon={PackageSearch}
						title="Couldn't load plans right now"
						description="Please refresh, or head straight to sign up — you can pick a plan from your dashboard."
						action={
							<Link href="/register">
								<Button>Get started</Button>
							</Link>
						}
					/>
				</div>
			)}

			{!isLoading && !isError && (
				<div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{plans.map((plan, idx) => {
						// The middle-priced paid plan is the one we steer people
						// toward, matching the in-app Subscription page's framing.
						const paidPlans = plans.filter(p => Number(p.price) > 0);
						const highlighted = paidPlans.length > 0 && plan.id === paidPlans[Math.floor((paidPlans.length - 1) / 2)]?.id;
						const isFree = Number(plan.price) === 0;

						return (
							<div
								key={plan.id}
								className={`flex flex-col rounded-2xl border p-8 ${
									highlighted ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
								}`}
							>
								<h3 className={`text-lg font-semibold ${highlighted ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
								{(plan.branchLimit || plan.userLimit) && (
									<p className={`mt-1 text-sm ${highlighted ? "text-slate-300" : "text-slate-500"}`}>
										{[
											plan.branchLimit ? `${plan.branchLimit} branch${plan.branchLimit > 1 ? "es" : ""}` : null,
											plan.userLimit ? `${plan.userLimit} users` : null,
										]
											.filter(Boolean)
											.join(" · ")}
									</p>
								)}
								<p className="mt-6">
									<span className="text-3xl font-semibold">{isFree ? "Free" : formatMoney(plan.price)}</span>
									{!isFree && (
										<span className={highlighted ? "text-slate-300" : "text-slate-400"}>
											{" "}
											/{plan.billingCycle === "YEARLY" ? "year" : "month"}
										</span>
									)}
								</p>
								{!isFree && (plan.trialDays ?? 0) > 0 && (
									<p className={`mt-1 text-xs font-medium ${highlighted ? "text-emerald-400" : "text-emerald-600"}`}>
										{plan.trialDays}-day free trial included
									</p>
								)}
								<ul className="mt-6 flex-1 space-y-3">
									{(plan.features ?? []).map(f => (
										<li key={f} className="flex items-center gap-2 text-sm">
											<Check className={`h-4 w-4 shrink-0 ${highlighted ? "text-emerald-400" : "text-emerald-500"}`} />
											{f}
										</li>
									))}
								</ul>
								<Link href="/register" className="mt-8">
									<Button className="w-full" variant={highlighted ? "secondary" : "primary"}>
										Get started
									</Button>
								</Link>
							</div>
						);
					})}
				</div>
			)}

			<p className="mt-10 text-center text-sm text-slate-400">
				Prices shown are live from our current plans — manage or change yours anytime from your dashboard under
				Subscription.
			</p>
		</div>
	);
}

