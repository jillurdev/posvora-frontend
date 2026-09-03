"use client";

import { useState } from "react";
import { Check, ShoppingCart, Boxes, Truck, Wallet, Building2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module {
	key: string;
	icon: typeof ShoppingCart;
	label: string;
	title: string;
	description: string;
	// Concrete, specific capabilities — not vague marketing lines — so a
	// visitor can tell exactly what they'll get before they ever sign up.
	items: string[];
}

const MODULES: Module[] = [
	{
		key: "pos",
		icon: ShoppingCart,
		label: "Point of Sale",
		title: "A counter that keeps up on a busy Friday",
		description: "Built for speed at the till, not just a pretty screen.",
		items: [
			"Barcode scanning and quick product search",
			"Split payments across cash, card and mobile wallets in one sale",
			"Hold a sale and recall it later without losing the cart",
			"Returns and exchanges tied back to the original sale",
			"Sell in your customer's currency with live exchange rates",
			"Works per-shop, per-branch — each till knows its own stock",
		],
	},
	{
		key: "inventory",
		icon: Boxes,
		label: "Inventory & Products",
		title: "Know what you have, everywhere you have it",
		description: "Stock tracked down to the branch and warehouse, not just a single number.",
		items: [
			"Stock by shop → branch → warehouse, not lumped together",
			"Low-stock alerts before you run out",
			"One-click transfers between locations",
			"Categories, brands, units and variants (colour, size, storage)",
			"Cost, wholesale and dealer pricing per product",
			"FEFO batch tracking for stock that expires (pharmacies, groceries)",
			"Weighted-average costing so your margins are always accurate",
		],
	},
	{
		key: "purchasing",
		icon: Truck,
		label: "Purchasing & Suppliers",
		title: "The other half of inventory — buying it in",
		description: "Purchase orders, supplier relationships and stock intake in one place.",
		items: [
			"Supplier profiles with credit terms and purchase history",
			"Purchase orders that update stock the moment goods arrive",
			"Customer and supplier ledgers with running balances",
			"Follow-up reminders so nothing falls through the cracks",
		],
	},
	{
		key: "accounting",
		icon: Wallet,
		label: "Accounting",
		title: "Real double-entry books, not a spreadsheet",
		description: "No separate bookkeeping software to reconcile against your sales.",
		items: [
			"Full chart of accounts with double-entry journal",
			"Trial balance and profit & loss, generated automatically",
			"Day-close workflow to lock and reconcile each day's sales",
			"Expense tracking against the right account",
			"Tax rules by jurisdiction, applied automatically at checkout",
			"Daily exchange-rate sync for accurate multi-currency books",
		],
	},
	{
		key: "multi-branch",
		icon: Building2,
		label: "Multi-Shop & Multi-Branch",
		title: "One counter or fifty — same system",
		description: "Built for organizations, not single storefronts.",
		items: [
			"Run multiple shops under one organization",
			"Each shop can have its own branches and warehouses",
			"Each shop gets its own public storefront link",
			"Multi-currency pricing per product, per market",
			"Consolidated reporting across every location",
		],
	},
	{
		key: "team",
		icon: ShieldCheck,
		label: "Team & Security",
		title: "Give people exactly the access they need",
		description: "Nothing more, nothing less — and a full record of who did what.",
		items: [
			"Role-based permissions for cashiers, managers and accountants",
			"Every state-changing action requires explicit confirmation",
			"Full audit trail — see what changed, who changed it, and when",
			"Optional two-factor authentication",
			"KYC/business verification to build trust with your customers",
		],
	},
];

export function ModuleShowcase() {
	const [active, setActive] = useState(MODULES[0].key);
	const current = MODULES.find(m => m.key === active) ?? MODULES[0];

	return (
		<div>
			{/* Module picker — deliberately not the app's own Tabs component,
			    which is styled for the dashboard; this uses the marketing
			    "till receipt" palette so it fits the page around it. */}
			<div className="flex flex-wrap justify-center gap-2">
				{MODULES.map(m => {
					const isActive = m.key === active;
					return (
						<button
							key={m.key}
							onClick={() => setActive(m.key)}
							className={cn(
								"flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
								isActive
									? "border-[var(--mk-till)] bg-[var(--mk-till)] text-white"
									: "border-[var(--mk-line)] bg-[var(--mk-paper-raised)] text-[var(--mk-ink-soft)] hover:border-[var(--mk-till)]/40 hover:text-[var(--mk-ink)]",
							)}
						>
							<m.icon className="h-4 w-4" />
							{m.label}
						</button>
					);
				})}
			</div>

			<div className="mt-8 grid grid-cols-1 gap-8 rounded-2xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
				<div>
					<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
						<current.icon className="h-5 w-5" />
					</div>
					<h3 className="mt-4 font-[var(--font-mk-display)] text-2xl font-semibold tracking-tight text-[var(--mk-ink)]">
						{current.title}
					</h3>
					<p className="mt-2 text-[var(--mk-ink-soft)]">{current.description}</p>
				</div>
				<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{current.items.map(item => (
						<li key={item} className="flex items-start gap-2.5 text-sm text-[var(--mk-ink)]">
							<Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mk-till)]" />
							{item}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
