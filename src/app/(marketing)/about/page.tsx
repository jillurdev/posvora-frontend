import type { Metadata } from "next";
import Link from "next/link";
import { Target, Heart, Users2, Store, Landmark, Globe2, Layers, Coins, Eye } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
	title: "About Us",
	description:
		"Posvora is built for businesses that run on the ground — one system for sales, inventory, purchasing, accounting and reporting instead of a dozen disconnected tools.",
};

const PILLARS = [
	{
		icon: Target,
		title: "Our mission",
		description:
			"Give every shop, restaurant and distributor the same operational tools that large chains take for granted — without the cost or complexity.",
	},
	{
		icon: Heart,
		title: "How we work",
		description:
			"We build with owners and cashiers in the room, not just spreadsheets. If a feature slows down the counter on a busy Friday, we redesign it.",
	},
	{
		icon: Users2,
		title: "Who we serve",
		description:
			"Retail stores, restaurants, pharmacies, wholesalers and service businesses running one counter or fifty branches.",
	},
];

const WHY = [
	{
		icon: Layers,
		title: "One system, not a dozen",
		description: "Sales, inventory, purchasing, accounting and reporting share the same data — nothing to reconcile between separate tools.",
	},
	{
		icon: Coins,
		title: "Real accounting, not a workaround",
		description: "Double-entry books, trial balance and profit & loss built in — not a bolt-on export to a spreadsheet.",
	},
	{
		icon: Eye,
		title: "Nothing hidden",
		description: "Every state-changing action is logged in a full audit trail, and every plan's pricing is public on our Pricing page — no sales call required to find out what something costs.",
	},
];

const ROADMAP = [
	{
		phase: "Phase 1",
		status: "Live now",
		icon: Store,
		title: "Run your shop",
		description: "Point of sale, inventory across branches, purchasing, accounting and reporting — everything described on this site is available today.",
	},
	{
		phase: "Phase 2",
		status: "In progress",
		icon: Landmark,
		title: "Transactions through Posvora",
		description: "Every sale, payment and payout routed through Posvora's own payment rails, so settlement and reconciliation happen automatically.",
	},
	{
		phase: "Phase 3",
		status: "Planned",
		icon: Globe2,
		title: "Marketplace & open API",
		description: "A storefront marketplace for buyers, plus a public API so you can deploy Posvora on your own website.",
	},
];

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
			<span className="inline-flex items-center gap-2 rounded-sm border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] px-3 py-1 font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">
				<span className="h-1.5 w-1.5 rounded-full bg-[var(--mk-till)]" />
				About us
			</span>
			<h1 className="mt-4 font-[var(--font-mk-display)] text-4xl font-semibold tracking-tight text-[var(--mk-ink)]">
				Built for businesses that run on the ground
			</h1>
			<p className="mt-6 text-lg text-[var(--mk-ink-soft)]">
				Posvora started from a simple observation: most small and mid-sized businesses juggle separate tools
				for selling, tracking stock, managing staff and doing the books — and none of them talk to each other.
				We set out to build a single, affordable platform that handles all of it, in one place, for teams that
				don&apos;t have time to babysit software.
			</p>

			<div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
				{PILLARS.map((p, i) => (
					<Reveal key={p.title} delayMs={i * 80}>
						<div className="h-full rounded-xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
								<p.icon className="h-5 w-5" />
							</div>
							<h3 className="mt-4 text-base font-semibold text-[var(--mk-ink)]">{p.title}</h3>
							<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">{p.description}</p>
						</div>
					</Reveal>
				))}
			</div>

			{/* Why Posvora — what makes it different, in plain terms */}
			<Reveal>
				<div className="mt-20">
					<h2 className="font-[var(--font-mk-display)] text-2xl font-semibold tracking-tight text-[var(--mk-ink)]">
						Why businesses choose Posvora
					</h2>
					<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
						{WHY.map((w, i) => (
							<Reveal key={w.title} delayMs={i * 80}>
								<div className="h-full">
									<div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--mk-gold-soft)] text-[var(--mk-gold)]">
										<w.icon className="h-5 w-5" />
									</div>
									<h3 className="mt-3 text-base font-semibold text-[var(--mk-ink)]">{w.title}</h3>
									<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">{w.description}</p>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</Reveal>

			{/* Roadmap — where the product is headed, honestly labelled by status */}
			<Reveal>
				<div className="mt-20">
					<h2 className="font-[var(--font-mk-display)] text-2xl font-semibold tracking-tight text-[var(--mk-ink)]">
						Where we&apos;re headed
					</h2>
					<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">
						We&apos;d rather show you the real roadmap than promise everything is done already.
					</p>
					<div className="mt-8 space-y-4">
						{ROADMAP.map((r, i) => (
							<Reveal key={r.phase} delayMs={i * 80}>
								<div className="flex items-start gap-4 rounded-xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-5">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
										<r.icon className="h-5 w-5" />
									</div>
									<div>
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">{r.phase}</span>
											<span
												className={
													r.status === "Live now"
														? "rounded-full bg-[var(--mk-till-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--mk-till-deep)]"
														: "rounded-full bg-[var(--mk-gold-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--mk-ink)]"
												}
											>
												{r.status}
											</span>
										</div>
										<h3 className="mt-1.5 text-base font-semibold text-[var(--mk-ink)]">{r.title}</h3>
										<p className="mt-1 text-sm text-[var(--mk-ink-soft)]">{r.description}</p>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</Reveal>

			<Reveal>
				<div className="mt-16 overflow-hidden rounded-2xl bg-[var(--mk-till-deep)] p-8">
					<h3 className="font-[var(--font-mk-display)] text-lg font-semibold text-white">Questions about Posvora?</h3>
					<p className="mt-2 text-sm text-[var(--mk-till-soft)]">
						We&apos;d love to hear from you — reach out on the{" "}
						<Link href="/contact" className="font-medium text-[var(--mk-gold-soft)] underline underline-offset-2">
							contact page
						</Link>{" "}
						and our team will get back to you.
					</p>
				</div>
			</Reveal>
		</div>
	);
}
