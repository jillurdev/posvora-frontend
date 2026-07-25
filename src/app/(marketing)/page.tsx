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
	Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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

export default function HomePage() {
	return (
		<div>
			{/* Hero */}
			<section className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center lg:px-8 lg:pt-24">
				<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
					Universal Business Management & POS SaaS
				</span>
				<h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
					Run your entire business from one dashboard
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
					Sales, inventory, purchases, accounting, HR and reporting — Posvora replaces a dozen spreadsheets
					and disconnected tools with a single system built for shops, restaurants and distributors.
				</p>
				<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Link href="/register">
						<Button size="lg">
							Start free trial <ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
					<Link href="/pricing">
						<Button size="lg" variant="outline">
							View pricing
						</Button>
					</Link>
				</div>
				<p className="mt-4 text-sm text-slate-400">No credit card required · Set up your business in minutes</p>
			</section>

			{/* Audience strip */}
			<section className="border-y border-slate-100 bg-slate-50/60 py-6">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm text-slate-500 lg:px-8">
					{AUDIENCE.map(a => (
						<span key={a} className="flex items-center gap-1.5">
							<Check className="h-3.5 w-3.5 text-emerald-500" /> {a}
						</span>
					))}
				</div>
			</section>

			{/* Features */}
			<section id="features" className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-semibold text-slate-900">Everything your business needs, connected</h2>
					<p className="mt-3 text-slate-500">
						Every module talks to the others — a sale updates your inventory, your accounting and your reports
						at the same time.
					</p>
				</div>
				<div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map(f => (
						<div key={f.title} className="rounded-xl border border-slate-200 p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
								<f.icon className="h-5 w-5" />
							</div>
							<h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
							<p className="mt-2 text-sm text-slate-500">{f.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-900 px-8 py-12 text-center sm:flex-row sm:text-left">
					<div>
						<h3 className="text-2xl font-semibold text-white">Ready to see it in action?</h3>
						<p className="mt-2 text-slate-300">Create your organization and start selling in under five minutes.</p>
					</div>
					<Link href="/register">
						<Button size="lg" variant="secondary">
							Start free trial <ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
