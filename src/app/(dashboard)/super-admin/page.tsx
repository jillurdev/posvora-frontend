"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAdminDashboard, useAdminOrganizations } from "@/features/super-admin/hooks/useSuperAdmin";
import type { AdminOrganization } from "@/features/super-admin/types";
import { formatDate } from "@/lib/utils";

function StatCard({ label, value, href }: { label: string; value: string | number; href?: string }) {
	const content = (
		<div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
			<p className="text-sm text-slate-500">{label}</p>
			<p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
		</div>
	);
	return href ? <Link href={href}>{content}</Link> : content;
}

export default function SuperAdminPage() {
	const { user } = useAuth();
	const { data: dashboard } = useAdminDashboard();
	const { data, isLoading } = useAdminOrganizations();

	if (!user?.roles?.includes("SUPER_ADMIN")) {
		return <EmptyState icon={ShieldCheck} title="Restricted" description="This area is for platform super admins only." />;
	}

	const columns: Column<AdminOrganization>[] = [
		{ header: "Organization", accessor: o => <span className="font-medium text-slate-900">{o.name}</span> },
		{ header: "Business type", accessor: o => o.businessType },
		{ header: "Status", accessor: o => (o.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Suspended</Badge>) },
		{ header: "Created", accessor: o => formatDate(o.createdAt) },
	];

	return (
		<div>
			<PageHeader title="Platform Admin" description="Cross-organization visibility for Posvora staff." />

			<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard label="Organizations" value={dashboard?.totalOrganizations ?? "—"} />
				<StatCard label="Active subscriptions" value={dashboard?.activeSubscriptions ?? "—"} />
				<StatCard label="Open support tickets" value={dashboard?.openSupportTickets ?? "—"} href="/super-admin/support" />
			</div>

			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={o => o.id} emptyTitle="No organizations found" />
		</div>
	);
}
