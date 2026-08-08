"use client";

import { ReactNode } from "react";
import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";

export interface Column<T> {
	header: string;
	accessor: (row: T) => ReactNode;
	className?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	isLoading?: boolean;
	emptyTitle?: string;
	emptyDescription?: string;
	rowKey: (row: T) => string;
	onRowClick?: (row: T) => void;
}

export function DataTable<T>({
	columns,
	data,
	isLoading,
	emptyTitle = "No records found",
	emptyDescription,
	rowKey,
	onRowClick,
}: DataTableProps<T>) {
	if (isLoading) return <Spinner />;
	if (!data || data.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

	return (
		<div className="overflow-x-auto rounded-xl border border-slate-200">
			<table className="w-full text-left text-sm">
				<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
					<tr>
						{columns.map(col => (
							<th key={col.header} className="px-4 py-3 font-medium">
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{data.map(row => (
						<tr
							key={rowKey(row)}
							onClick={onRowClick ? () => onRowClick(row) : undefined}
							className={`hover:bg-slate-50/60 ${onRowClick ? "cursor-pointer" : ""}`}
						>
							{columns.map(col => (
								<td key={col.header} className={`px-4 py-3 text-slate-700 ${col.className ?? ""}`}>
									{col.accessor(row)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
