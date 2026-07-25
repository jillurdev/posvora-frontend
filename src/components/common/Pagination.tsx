"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

export function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between pt-4">
			<p className="text-sm text-slate-500">
				Page {page} of {totalPages}
			</p>
			<div className="flex gap-2">
				<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
					<ChevronLeft className="h-4 w-4" /> Prev
				</Button>
				<Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
					Next <ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
