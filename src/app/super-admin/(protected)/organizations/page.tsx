"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAdminOrganizations, useAdminToggleOrganization } from "@/features/super-admin/hooks/useSuperAdmin";
import type { AdminOrganization } from "@/features/super-admin/types";
import { formatDate } from "@/lib/utils";

export default function OrganizationsPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useAdminOrganizations({ page, limit: 20, search: search || undefined });
	const toggle = useAdminToggleOrganization();

	const columns: Column<AdminOrganization>[] = [
		{
			header: "Organization",
			accessor: o => (
				<Link href={`/super-admin/organizations/${o.id}`} className="font-medium text-slate-900 hover:underline">
					{o.name}
				</Link>
			),
		},
		{ header: "Owner", accessor: o => o.owner?.email ?? "—" },
		{ header: "Business type", accessor: o => o.businessType },
		{ header: "Plan", accessor: o => o.subscription?.plan?.name ?? <span className="text-slate-400">No plan</span> },
		{ header: "Status", accessor: o => (o.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Suspended</Badge>) },
		{ header: "Created", accessor: o => formatDate(o.createdAt) },
		{
			header: "",
			accessor: o => (
				<Button
					variant="outline"
					size="sm"
					isLoading={toggle.isPending}
					onClick={() => toggle.mutate({ id: o.id, isActive: !o.isActive })}>
					{o.isActive ? "Suspend" : "Reactivate"}
				</Button>
			),
		},
	];

	return (
		<div>
			<PageHeader title="Organizations" description="All businesses running on Posvora." />

			<div className="mb-4 max-w-sm">
				<SearchInput
					value={search}
					onChange={value => {
						setSearch(value);
						setPage(1);
					}}
					placeholder="Search organizations..."
				/>
			</div>

			<DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={o => o.id} emptyTitle="No organizations found" />

			{data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
		</div>
	);
}
