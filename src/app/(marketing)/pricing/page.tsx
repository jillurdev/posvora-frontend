import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PLANS = [
	{
		name: "Starter",
		price: "৳990",
		cycle: "/month",
		description: "For a single counter just getting started.",
		features: ["1 shop, 1 branch", "Up to 500 products", "POS & inventory", "Email support"],
		highlighted: false,
	},
	{
		name: "Growth",
		price: "৳2,490",
		cycle: "/month",
		description: "For growing shops with multiple staff.",
		features: [
			"Up to 3 branches",
			"Unlimited products",
			"Customers, suppliers & follow-ups",
			"Roles & permissions",
			"Priority support",
		],
		highlighted: true,
	},
	{
		name: "Business",
		price: "Custom",
		cycle: "",
		description: "For multi-branch chains and distributors.",
		features: [
			"Unlimited branches & warehouses",
			"Full accounting & payroll",
			"Audit logs & advanced reports",
			"Dedicated onboarding",
		],
		highlighted: false,
	},
];

export default function PricingPage() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
			<div className="mx-auto max-w-2xl text-center">
				<span className="text-sm font-medium text-slate-400">Pricing</span>
				<h1 className="mt-2 text-4xl font-semibold text-slate-900">Simple pricing that scales with you</h1>
				<p className="mt-4 text-lg text-slate-500">
					Start free, upgrade when you need more branches, staff or storage. No hidden fees.
				</p>
			</div>

			<div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
				{PLANS.map(plan => (
					<div
						key={plan.name}
						className={`flex flex-col rounded-2xl border p-8 ${
							plan.highlighted ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
						}`}
					>
						<h3 className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
						<p className={`mt-1 text-sm ${plan.highlighted ? "text-slate-300" : "text-slate-500"}`}>{plan.description}</p>
						<p className="mt-6">
							<span className="text-3xl font-semibold">{plan.price}</span>
							<span className={plan.highlighted ? "text-slate-300" : "text-slate-400"}> {plan.cycle}</span>
						</p>
						<ul className="mt-6 flex-1 space-y-3">
							{plan.features.map(f => (
								<li key={f} className="flex items-center gap-2 text-sm">
									<Check className={`h-4 w-4 ${plan.highlighted ? "text-emerald-400" : "text-emerald-500"}`} />
									{f}
								</li>
							))}
						</ul>
						<Link href="/register" className="mt-8">
							<Button className="w-full" variant={plan.highlighted ? "secondary" : "primary"}>
								Get started
							</Button>
						</Link>
					</div>
				))}
			</div>

			<p className="mt-10 text-center text-sm text-slate-400">
				Prices shown are indicative — final plans are managed from your dashboard under Subscription once you sign
				up.
			</p>
		</div>
	);
}
