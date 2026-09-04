"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, PackageSearch, Store, Landmark, Globe2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/marketing/Reveal";
import { usePlans } from "@/features/subscription/hooks/useSubscription";
import { formatMoney } from "@/lib/utils";

const ROADMAP = [
	{
		phase: "Phase 1",
		status: "Live now",
		icon: Store,
		title: "Run your shop",
		description:
			"Sell in-store with multi-currency pricing, manage inventory across branches, and keep your own books — everything on this page is available today.",
	},
	{
		phase: "Phase 2",
		status: "In progress",
		icon: Landmark,
		title: "Transactions through Posvora",
		description:
			"Every sale, payment and payout routed through Posvora's own payment rails — so settlement, reconciliation and reporting happen automatically, without a separate gateway.",
	},
	{
		phase: "Phase 3",
		status: "Planned",
		icon: Globe2,
		title: "Marketplace & open API",
		description:
			"A storefront marketplace for buyers, plus a public API so you can deploy Posvora on your own website and run everything through it — API access will be its own add-on when this ships.",
	},
];

// Best-effort label so the currency switcher reads as "US Dollar" rather
// than a bare ISO code — falls back to just the code for anything not
// listed here (new PlanPrice currencies added later still render fine).
const CURRENCY_LABELS: Record<string, string> = {
	BDT: "Bangladeshi Taka",
	USD: "US Dollar",
	INR: "Indian Rupee",
	GBP: "British Pound",
	EUR: "Euro",
	AED: "UAE Dirham",
	SAR: "Saudi Riyal",
};

export default function PricingPage() {
	// Pulled live from /subscription/plans (the same public, unauthenticated
	// endpoint the in-app Subscription page uses) instead of a hardcoded list,
	// so this page can never drift out of sync with what customers are
	// actually offered after they sign up.
	const { data: plans = [], isLoading, isError } = usePlans();
	const hasFreePlan = plans.some(p => Number(p.price) === 0);
	const hasTrial = plans.some(p => (p.trialDays ?? 0) > 0);

	// Build the list of currencies actually priced across all plans (BDT is
	// always the base price; others come from each plan's `prices` table —
	// see PlanPrice on the backend). Falls back to BDT-only if a plan has no
	// multi-currency rows yet.
	const currencies = useMemo(() => {
		const set = new Set<string>(["BDT"]);
		plans.forEach(p => {
			if (p.priceUsd != null) set.add("USD");
			(p.prices ?? []).forEach(pr => set.add(pr.currencyCode));
		});
		return Array.from(set);
	}, [plans]);

	const [currency, setCurrency] = useState("BDT");
	const activeCurrency = currencies.includes(currency) ? currency : "BDT";

	// Foreign visitors were always landing on BDT pricing by default and
	// had to notice/click the switcher themselves — this guesses a better
	// starting currency from the browser's own locale (no geo-IP call
	// needed) the moment we know which currencies are actually available.
	// Runs client-side only, so it can't affect the server-rendered markup;
	// worst case a visitor briefly sees BDT before this fires.
	const [hasAutoDetected, setHasAutoDetected] = useState(false);
	useEffect(() => {
		if (hasAutoDetected || currencies.length <= 1) return;
		setHasAutoDetected(true);

		const languages = typeof navigator !== "undefined" ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : [];
		let region: string | null = null;
		for (const lang of languages) {
			const match = /-([A-Z]{2})$/.exec(lang ?? "");
			if (match) {
				region = match[1];
				break;
			}
		}

		const guess = region === "BD" ? "BDT" : region === "IN" ? "INR" : region ? "USD" : null;
		if (guess && currencies.includes(guess)) setCurrency(guess);
	}, [currencies, hasAutoDetected]);

	const priceFor = (plan: (typeof plans)[number]) => {
		if (activeCurrency === "BDT") return Number(plan.price);
		const match = (plan.prices ?? []).find(pr => pr.currencyCode === activeCurrency);
		if (match) return Number(match.amount);
		if (activeCurrency === "USD" && plan.priceUsd != null) return Number(plan.priceUsd);
		return null; // not priced in this currency — plan card will say so
	};

	const subheading = hasFreePlan
		? "Start free, upgrade when you need more branches, staff or storage. No hidden fees."
		: hasTrial
			? "Try any plan free, upgrade when you need more branches, staff or storage. No hidden fees."
			: "Simple, transparent plans that scale with your business. No hidden fees.";

	return (
		<div>
			<div className="mx-auto max-w-6xl px-4 pb-16 pt-20 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<span className="inline-flex items-center gap-2 rounded-sm border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] px-3 py-1 font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">
						<span className="h-1.5 w-1.5 rounded-full bg-[var(--mk-till)]" />
						Pricing
					</span>
					<h1 className="mt-4 font-[var(--font-mk-display)] text-4xl font-semibold tracking-tight text-[var(--mk-ink)]">
						Simple pricing that scales with you
					</h1>
					<p className="mt-4 text-lg text-[var(--mk-ink-soft)]">{subheading}</p>
				</div>

				{!isLoading && !isError && currencies.length > 1 && (
					<div className="mt-8 flex flex-col items-center gap-2">
						<div className="inline-flex rounded-md border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-1">
							{currencies.map(c => (
								<button
									key={c}
									onClick={() => setCurrency(c)}
									title={CURRENCY_LABELS[c] ?? c}
									className={`rounded-sm px-4 py-1.5 font-[var(--font-mk-mono)] text-xs font-medium transition-colors ${
										activeCurrency === c
											? "bg-[var(--mk-till)] text-white"
											: "text-[var(--mk-ink-soft)] hover:text-[var(--mk-ink)]"
									}`}
								>
									{c}
								</button>
							))}
						</div>
						<p className="max-w-md text-center text-xs text-[var(--mk-ink-soft)]">
							Prices convert instantly — you&apos;ll be charged in whichever of these matches your payment
							method at checkout.
						</p>
					</div>
				)}

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
								<Link
									href="/register"
									className="inline-flex h-10 items-center rounded-md bg-[var(--mk-till)] px-5 text-sm font-medium text-white hover:bg-[var(--mk-till-deep)]"
								>
									Get started
								</Link>
							}
						/>
					</div>
				)}

				{!isLoading && !isError && (
					<div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
						{plans.map((plan, idx) => {
							// The middle-priced paid plan is the one we steer people
							// toward, matching the in-app Subscription page's framing.
							const paidPlans = plans.filter(p => Number(p.price) > 0);
							const highlighted = paidPlans.length > 0 && plan.id === paidPlans[Math.floor((paidPlans.length - 1) / 2)]?.id;
							const isFree = Number(plan.price) === 0;
							const amount = priceFor(plan);

							return (
								<Reveal key={plan.id} delayMs={idx * 60}>
									<div
										className={`flex h-full flex-col rounded-2xl border p-8 transition-shadow ${
											highlighted
												? "border-[var(--mk-till)] bg-[var(--mk-till-deep)] text-white shadow-[0_20px_45px_-20px_rgba(10,79,58,0.55)]"
												: "border-[var(--mk-line)] bg-[var(--mk-paper-raised)] hover:shadow-[0_16px_36px_-22px_rgba(18,32,26,0.25)]"
										}`}
									>
										{highlighted && (
											<span className="mb-3 inline-flex w-fit items-center rounded-sm bg-[var(--mk-gold)] px-2 py-0.5 font-[var(--font-mk-mono)] text-[10px] font-semibold uppercase tracking-wide text-[var(--mk-till-deep)]">
												Most popular
											</span>
										)}
										<h3 className={`text-lg font-semibold ${highlighted ? "text-white" : "text-[var(--mk-ink)]"}`}>
											{plan.name}
										</h3>
										{(plan.branchLimit || plan.userLimit) && (
											<p className={`mt-1 text-sm ${highlighted ? "text-[var(--mk-till-soft)]" : "text-[var(--mk-ink-soft)]"}`}>
												{[
													plan.branchLimit ? `${plan.branchLimit} branch${plan.branchLimit > 1 ? "es" : ""}` : null,
													plan.userLimit ? `${plan.userLimit} users` : null,
												]
													.filter(Boolean)
													.join(" · ")}
											</p>
										)}
										<p className="mt-6">
											{isFree ? (
												<span className="text-3xl font-semibold">Free</span>
											) : amount != null ? (
												<>
													<span className="text-3xl font-semibold">{formatMoney(amount, activeCurrency)}</span>
													<span className={highlighted ? "text-[var(--mk-till-soft)]" : "text-[var(--mk-ink-soft)]"}>
														{" "}
														/{plan.billingCycle === "YEARLY" ? "year" : "month"}
													</span>
												</>
											) : (
												<span className={`text-sm ${highlighted ? "text-[var(--mk-till-soft)]" : "text-[var(--mk-ink-soft)]"}`}>
													Not yet priced in {activeCurrency} — contact us
												</span>
											)}
										</p>
										{!isFree && (plan.trialDays ?? 0) > 0 && (
											<p className={`mt-1 text-xs font-medium ${highlighted ? "text-[var(--mk-gold-soft)]" : "text-[var(--mk-till)]"}`}>
												{plan.trialDays}-day free trial included
											</p>
										)}
										<ul className="mt-6 flex-1 space-y-3">
											{(plan.features ?? []).map(f => (
												<li key={f} className="flex items-center gap-2 text-sm">
													<Check
														className={`h-4 w-4 shrink-0 ${highlighted ? "text-[var(--mk-gold)]" : "text-[var(--mk-till)]"}`}
													/>
													<span className={highlighted ? "text-white/90" : "text-[var(--mk-ink)]"}>{f}</span>
												</li>
											))}
										</ul>
										<Link
											href="/register"
											className={`mt-8 inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
												highlighted
													? "bg-[var(--mk-gold)] text-[var(--mk-till-deep)] hover:bg-[var(--mk-gold-soft)]"
													: "bg-[var(--mk-till)] text-white hover:bg-[var(--mk-till-deep)]"
											}`}
										>
											Get started
										</Link>
									</div>
								</Reveal>
							);
						})}
					</div>
				)}

				<p className="mt-10 text-center text-sm text-[var(--mk-ink-soft)]">
					Prices shown are live from our current plans — manage or change yours anytime from your dashboard under
					Subscription.
				</p>
			</div>

			{/* Roadmap */}
			<section className="border-t border-[var(--mk-line)] bg-[var(--mk-paper-raised)] py-20">
				<div className="mx-auto max-w-6xl px-4 lg:px-8">
					<Reveal className="mx-auto max-w-2xl text-center">
						<span className="font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">Where Posvora is headed</span>
						<h2 className="mt-2 font-[var(--font-mk-display)] text-3xl font-semibold tracking-tight text-[var(--mk-ink)]">
							Today it&apos;s a POS. Tomorrow, your whole payment stack.
						</h2>
						<p className="mt-3 text-[var(--mk-ink-soft)]">
							The plans above cover what&apos;s live today. Here&apos;s what&apos;s next — no API fees or marketplace charges
							apply yet, they'll arrive as their own offering when each phase ships.
						</p>
					</Reveal>

					<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
						{ROADMAP.map((r, i) => (
							<Reveal key={r.phase} delayMs={i * 100}>
								<div className="relative h-full rounded-xl border border-[var(--mk-line)] bg-[var(--mk-paper)] p-6">
									<div className="flex items-center justify-between">
										<span className="font-[var(--font-mk-mono)] text-xs font-semibold text-[var(--mk-till)]">{r.phase}</span>
										<span
											className={`rounded-sm px-2 py-0.5 font-[var(--font-mk-mono)] text-[10px] font-medium uppercase tracking-wide ${
												r.status === "Live now"
													? "bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]"
													: r.status === "In progress"
														? "bg-[var(--mk-gold-soft)] text-[var(--mk-gold)]"
														: "bg-[var(--mk-line)] text-[var(--mk-ink-soft)]"
											}`}
										>
											{r.status}
										</span>
									</div>
									<div className="mt-4 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
										<r.icon className="h-5 w-5" />
									</div>
									<h3 className="mt-4 text-base font-semibold text-[var(--mk-ink)]">{r.title}</h3>
									<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">{r.description}</p>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
