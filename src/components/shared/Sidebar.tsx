"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { NAV_ITEMS, siteConfig } from "@/config/site";
import { useAuth } from "@/context/AuthContext";
import { useOrgHandle } from "@/hooks/useOrgHandle";
import { hasRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function Sidebar({ forceVisible = false }: { forceVisible?: boolean }) {
	const pathname = usePathname();
	const { user } = useAuth();
	const orgHandle = useOrgHandle();

	return (
		<aside
			className={cn(
				"w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col",
				forceVisible ? "flex flex-col" : "hidden",
			)}
		>
			<div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
					<Store className="h-4 w-4" />
				</div>
				<span className="text-base font-semibold text-slate-900">{siteConfig.name}</span>
			</div>
			<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
				{NAV_ITEMS.filter(item => hasRole(user?.roles, item.roles)).map(item => {
					const href = `/${orgHandle}/${item.href}`;
					const active = pathname === href || pathname.startsWith(href + "/");
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100",
							)}
						>
							<Icon className="h-4 w-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
