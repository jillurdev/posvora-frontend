"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, LifeBuoy, LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminLogout } from "@/features/admin-auth/hooks/useAdminAuth";
import { cn } from "@/lib/utils";

const NAV = [
	{ label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
	{ label: "Support Tickets", href: "/super-admin/support", icon: LifeBuoy },
];

export default function SuperAdminProtectedLayout({ children }: { children: React.ReactNode }) {
	const { admin, isLoading } = useAdminAuth();
	const router = useRouter();
	const pathname = usePathname();
	const logout = useAdminLogout();

	useEffect(() => {
		if (!isLoading && !admin) router.replace("/super-admin/login");
	}, [isLoading, admin, router]);

	if (isLoading || !admin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-slate-50">
			<aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
				<div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
					<ShieldCheck className="h-5 w-5 text-slate-300" />
					<span className="text-sm font-semibold text-white">Platform Admin</span>
				</div>
				<nav className="flex-1 space-y-1 px-3 py-4">
					{NAV.map(item => {
						const active = pathname === item.href || pathname.startsWith(item.href + "/");
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
									active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
								)}
							>
								<Icon className="h-4 w-4" />
								{item.label}
							</Link>
						);
					})}
				</nav>
				<div className="border-t border-slate-800 p-3">
					<div className="px-3 py-2 text-xs text-slate-500">{admin.email}</div>
					<button
						onClick={() => logout.mutate()}
						className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200"
					>
						<LogOut className="h-4 w-4" /> Sign out
					</button>
				</div>
			</aside>
			<main className="flex-1 p-4 lg:p-8">{children}</main>
		</div>
	);
}
