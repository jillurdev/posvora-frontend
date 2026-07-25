"use client";

import { Package, Users, ShoppingCart, Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useActiveShop } from "@/context/ActiveShopContext";
import { ROLE_LABELS } from "@/lib/permissions";

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Package }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5">
			<div className="flex items-center justify-between">
				<p className="text-sm text-slate-500">{label}</p>
				<Icon className="h-5 w-5 text-slate-400" />
			</div>
			<p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
		</div>
	);
}

export default function DashboardPage() {
	const { user } = useAuth();
	const { shops } = useActiveShop();

	return (
		<div>
			<PageHeader
				title={`Welcome back, ${user?.name?.split(" ")[0] ?? ""}`}
				description={`${user?.roles?.map(r => ROLE_LABELS[r]).join(", ")} · ${shops.length} shop${shops.length === 1 ? "" : "s"}`}
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Products" value="—" icon={Package} />
				<StatCard label="Customers" value="—" icon={Users} />
				<StatCard label="Sales today" value="—" icon={ShoppingCart} />
				<StatCard label="Revenue (month)" value="—" icon={Wallet} />
			</div>

			<div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
				Real-time stats wire up to your branch/shop reporting endpoints once you pick a default branch —
				see the Sales, Purchases and Inventory pages for live data.
			</div>
		</div>
	);
}
