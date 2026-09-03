import Link from "next/link";
import {
	ArrowRight,
	Package,
	Boxes,
	ShoppingCart,
	Users,
	Wallet,
	ShieldCheck,
	BarChart3,
	Building2,
	UserPlus,
	Settings2,
	Rocket,
} from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { ReceiptTicket } from "@/components/marketing/ReceiptTicket";
import { ModuleShowcase } from "@/components/marketing/ModuleShowcase";
import { FaqAccordion, type FaqItem } from "@/components/marketing/FaqAccordion";

const FEATURES = [
	{
		icon: ShoppingCart,
		title: "Point of Sale",
		description: "Fast checkout with barcode scanning, split payments, holds and returns — built for busy counters.",
	},
	{
		icon: Boxes,
		title: "Inventory across locations",
		description: "Track stock by branch and warehouse, get low-stock alerts, and transfer between locations in a click.",
	},
	{
		icon: Package,
		title: "Product catalog",
		description: "Categories, brands, units and variants (color, size, storage) — with cost, wholesale and dealer pricing.",
	},
	{
		icon: Users,
		title: "Customers & suppliers",
		description: "Groups, credit limits, follow-ups and purchase history so you never lose track of a relationship.",
	},
	{
		icon: Wallet,
		title: "Accounting built in",
		description: "Chart of accounts, expense tracking, day-closing and profit & loss — no separate bookkeeping tool needed.",
	},
	{
		icon: Building2,
		title: "Multi-shop & multi-branch",
		description: "Run one shop or fifty branches from a single organization, each with its own team and stock.",
	},
	{
		icon: ShieldCheck,
		title: "Roles & permissions",
		description: "Give cashiers, managers and accountants exactly the access they need — nothing more.",
	},
	{
		icon: BarChart3,
		title: "Reports & audit trail",
		description: "Every action is logged. See what changed, who changed it, and when.",
	},
];

const AUDIENCE = [
	"Retail & grocery stores",
	"Restaurants & cafes",
	"Pharmacies",
	"Wholesale & distribution",
	"Electronics & mobile shops",
	"Service businesses",
];

const HOW_IT_WORKS = [
	{
		icon: UserPlus,
		step: "01",
		title: "Create your organization",
		description: "Sign up, name your business, and pick a plan — including a free trial where available. No card required to start.",
	},
	{
		icon: Settings2,
		step: "02",
		title: "Set up your shop",
		description: "Add your products, branches and team in minutes. Import what you already have, or start from scratch.",
	},
	{
		icon: Rocket,
		step: "03",
		title: "Start selling",
		description: "Ring up sales at the counter while inventory, accounting and reports update themselves in the background.",
	},
];

const FAQS: FaqItem[] = [
	{
		question: "Exactly what do I get — is this just a POS, or more?",
		answer:
			"More than a POS. Posvora covers point of sale, inventory across branches, purchasing and suppliers, real double-entry accounting, customer/supplier ledgers, multi-currency pricing, roles & permissions, and a full audit trail — all connected, so a single sale updates everything else automatically. See the full breakdown above, module by module.",
	},
	{
		question: "Can I run more than one shop or branch?",
		answer:
			"Yes. One organization can hold multiple shops, and each shop can have its own branches and warehouses — each with its own stock, team and public storefront link. Reporting rolls up across all of them.",
	},
	{
		question: "What happens if I switch plans later?",
		answer:
			"You can hold more than one paid plan at once. Buying a new plan while another is still running banks it — nothing you've paid for is ever converted to a credit or lost — and you can switch between held plans instantly, free of charge, from Subscription settings.",
	},
	{
		question: "Do you support multiple currencies?",
		answer:
			"Yes — products can be priced in multiple currencies, exchange rates sync automatically every day, and your accounting stays accurate across all of them. Useful if you sell to customers paying in different currencies or run branches in different markets.",
	},
	{
		question: "Is my business data safe?",
		answer:
			"Every staff account only gets the access its role needs, every state-changing action requires explicit confirmation, and every change is recorded in a full audit trail — so you always know what changed, who changed it, and when.",
	},
	{
		question: "Can I cancel anytime?",
		answer:
			"Yes, anytime from Subscription settings. If you have no other plan held, your organization automatically falls back to the Free plan (limited features) rather than losing access outright.",
	},
];

export default function HomePage() {
	return (
		<div>
			{/* Hero */}
			<section className="relative overflow-hidden">
				{/* faint receipt-paper texture: vertical dashed guide lines */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
					style={{
						backgroundImage: "linear-gradient(90deg, var(--mk-line) 1px, transparent 1px)",
						backgroundSize: "56px 100%",
						maskImage: "linear-gradient(to bottom, black, transparent 85%)",
					}}
				/>

				<div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:pt-24">
					<div className="text-center lg:text-left">
						<span className="inline-flex items-center gap-2 rounded-sm border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] px-3 py-1 font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--mk-till)]" />
							TXN #001 · Universal Business Management &amp; POS
						</span>
						<h1 className="mx-auto mt-6 max-w-xl font-[var(--font-mk-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--mk-ink)] sm:text-5xl lg:mx-0">
							Every sale, counted. Every shop, connected.
						</h1>
						<p className="mx-auto mt-5 max-w-xl text-lg text-[var(--mk-ink-soft)] lg:mx-0">
							Sales, inventory, purchases, accounting, HR and reporting — Posvora replaces a dozen spreadsheets
							and disconnected tools with a single system built for shops, restaurants and distributors.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
							<Link
								href="/register"
								className="group inline-flex h-11 items-center gap-2 rounded-md bg-[var(--mk-till)] px-6 text-sm font-medium text-white transition-colors hover:bg-[var(--mk-till-deep)]"
							>
								Start free trial
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
							<Link
								href="/pricing"
								className="inline-flex h-11 items-center rounded-md border border-[var(--mk-ink)]/15 bg-transparent px-6 text-sm font-medium text-[var(--mk-ink)] transition-colors hover:bg-[var(--mk-paper-raised)]"
							>
								View pricing
							</Link>
						</div>
						<p className="mt-4 font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">
							No credit card required · Set up your business in minutes
						</p>
					</div>

					<div className="lg:justify-self-end">
						<ReceiptTicket />
					</div>
				</div>
			</section>

			{/* Audience marquee */}
			<section className="overflow-hidden border-y border-[var(--mk-line)] bg-[var(--mk-paper-raised)] py-5">
				<div className="flex w-max">
					<div className="mk-marquee-track flex shrink-0 items-center gap-10 pr-10">
						{[...AUDIENCE, ...AUDIENCE].map((a, i) => (
							<span key={`${a}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--mk-ink-soft)]">
								<span className="h-1 w-1 rounded-full bg-[var(--mk-gold)]" />
								{a}
							</span>
						))}
					</div>
					<div className="mk-marquee-track flex shrink-0 items-center gap-10 pr-10" aria-hidden>
						{[...AUDIENCE, ...AUDIENCE].map((a, i) => (
							<span key={`dup-${a}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--mk-ink-soft)]">
								<span className="h-1 w-1 rounded-full bg-[var(--mk-gold)]" />
								{a}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2 className="font-[var(--font-mk-display)] text-3xl font-semibold tracking-tight text-[var(--mk-ink)]">
						From signup to your first sale, in minutes
					</h2>
					<p className="mt-3 text-[var(--mk-ink-soft)]">No sales calls, no lengthy onboarding — start using it today.</p>
				</Reveal>
				<div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
					{HOW_IT_WORKS.map((step, i) => (
						<Reveal key={step.title} delayMs={i * 100}>
							<div className="relative h-full rounded-xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-6">
								<span className="font-[var(--font-mk-mono)] text-xs text-[var(--mk-gold)]">{step.step}</span>
								<div className="mt-3 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
									<step.icon className="h-5 w-5" />
								</div>
								<h3 className="mt-4 text-base font-semibold text-[var(--mk-ink)]">{step.title}</h3>
								<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">{step.description}</p>
							</div>
						</Reveal>
					))}
				</div>
			</section>

			{/* Features */}
			<section id="features" className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2 className="font-[var(--font-mk-display)] text-3xl font-semibold tracking-tight text-[var(--mk-ink)]">
						Everything your business needs, connected
					</h2>
					<p className="mt-3 text-[var(--mk-ink-soft)]">
						Every module talks to the others — a sale updates your inventory, your accounting and your reports
						at the same time.
					</p>
				</Reveal>
				<div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map((f, i) => (
						<Reveal key={f.title} delayMs={(i % 4) * 80}>
							<div className="group h-full rounded-lg border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--mk-gold)] hover:shadow-[0_12px_30px_-14px_rgba(217,153,46,0.45)]">
								<div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)] transition-colors group-hover:bg-[var(--mk-gold-soft)] group-hover:text-[var(--mk-gold)]">
									<f.icon className="h-5 w-5" />
								</div>
								<h3 className="mt-4 text-base font-semibold text-[var(--mk-ink)]">{f.title}</h3>
								<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">{f.description}</p>
							</div>
						</Reveal>
					))}
				</div>
			</section>

			{/* Module deep-dive — exactly what's included, module by module */}
			<section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2 className="font-[var(--font-mk-display)] text-3xl font-semibold tracking-tight text-[var(--mk-ink)]">
						See exactly what you&apos;re getting
					</h2>
					<p className="mt-3 text-[var(--mk-ink-soft)]">
						Pick a module below for the full, specific list of what it does — not just a headline.
					</p>
				</Reveal>
				<Reveal className="mt-12" delayMs={80}>
					<ModuleShowcase />
				</Reveal>
			</section>

			{/* FAQ */}
			<section className="mx-auto max-w-3xl px-4 pb-20 lg:px-8">
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2 className="font-[var(--font-mk-display)] text-3xl font-semibold tracking-tight text-[var(--mk-ink)]">
						Common questions
					</h2>
				</Reveal>
				<Reveal className="mt-10" delayMs={80}>
					<FaqAccordion items={FAQS} />
				</Reveal>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
				<Reveal>
					<div className="relative overflow-hidden rounded-2xl bg-[var(--mk-till-deep)] px-8 py-12">
						<div
							aria-hidden
							className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
							style={{ background: "var(--mk-gold)" }}
						/>
						<div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
							<div>
								<span className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 px-2.5 py-1 font-[var(--font-mk-mono)] text-[11px] font-medium tracking-wide text-[var(--mk-gold-soft)]">
									✓ APPROVED FOR YOUR SHOP
								</span>
								<h3 className="mt-4 font-[var(--font-mk-display)] text-2xl font-semibold tracking-tight text-white">
									Ready to see it in action?
								</h3>
								<p className="mt-2 text-[var(--mk-till-soft)]">
									Create your organization and start selling in under five minutes.
								</p>
							</div>
							<Link
								href="/register"
								className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-[var(--mk-gold)] px-6 text-sm font-medium text-[var(--mk-till-deep)] transition-colors hover:bg-[var(--mk-gold-soft)]"
							>
								Start free trial
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					</div>
				</Reveal>
			</section>
		</div>
	);
}
