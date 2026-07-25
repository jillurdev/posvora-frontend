"use client";

import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-40 lg:hidden">
			<div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
			<div className="relative flex h-full w-64 flex-col bg-white">
				<button onClick={onClose} className="absolute right-3 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100">
					<X className="h-5 w-5" />
				</button>
				<Sidebar forceVisible />
			</div>
		</div>
	);
}
