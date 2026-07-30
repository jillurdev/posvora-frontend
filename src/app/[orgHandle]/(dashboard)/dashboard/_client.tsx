"use client";

import { Package, Users, ShoppingCart, Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useDashboardSummary } from "@/features/organization/hooks/useOrganization";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatMoney } from "@/lib/utils";

function StatCard({
	label,
	value,
	icon: Icon,
	isLoading,
}: {
	label: string;
	value: string;
	icon: typeof Package;
	isLoading?: boolean;
}) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5">
			<div className="flex items-center justify-between">
				<p className="text-sm text-slate-500">{label}</p>
				<Icon className="h-5 w-5 text-slate-400" />
			</div>
			<p className="mt-2 text-2xl font-semibold text-slate-900">
				{isLoading ? <span className="inline-block h-6 w-16 animate-pulse rounded bg-slate-100" /> : value}
			</p>
		</div>
	);
}

export default function DashboardPage() {
	const { user } = useAuth();
	const { shops } = useActiveShop();
	const { data: summary, isLoading, isError } = useDashboardSummary();

	return (
		<div>
			<PageHeader
				title={`Welcome back, ${user?.name?.split(" ")[0] ?? ""}`}
				description={`${user?.roles?.map(r => ROLE_LABELS[r]).join(", ")} · ${shops.length} shop${shops.length === 1 ? "" : "s"}`}
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Products" value={String(summary?.products ?? 0)} icon={Package} isLoading={isLoading} />
				<StatCard label="Customers" value={String(summary?.customers ?? 0)} icon={Users} isLoading={isLoading} />
				<StatCard label="Sales today" value={String(summary?.salesToday ?? 0)} icon={ShoppingCart} isLoading={isLoading} />
				<StatCard
					label="Revenue (month)"
					value={formatMoney(summary?.revenueThisMonth ?? 0)}
					icon={Wallet}
					isLoading={isLoading}
				/>
			</div>

			{isError && (
				<div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
					Couldn&apos;t load your live stats right now — check the Sales, Purchases and Inventory pages directly, or
					refresh this page in a moment.
				</div>
			)}
		</div>
	);
}
