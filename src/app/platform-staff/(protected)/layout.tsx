"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, LifeBuoy, LogOut, Building2, CreditCard, Users, BadgeCheck, Wallet, MessageSquare, Settings, Menu, X } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminLogout } from "@/features/admin-auth/hooks/useAdminAuth";
import type { SuperAdminRole } from "@/features/admin-auth/types";
import { cn } from "@/lib/utils";

const NAV: { label: string; href: string; icon: typeof LayoutDashboard; exact?: boolean; roles?: SuperAdminRole[] }[] = [
	{ label: "Dashboard", href: "/platform-staff", icon: LayoutDashboard, exact: true },
	{ label: "Organizations", href: "/platform-staff/organizations", icon: Building2, roles: ["OWNER", "ADMIN"] },
	{ label: "Plans", href: "/platform-staff/plans", icon: CreditCard, roles: ["OWNER", "ADMIN"] },
	{ label: "KYC Verification", href: "/platform-staff/kyc", icon: BadgeCheck, roles: ["OWNER", "ADMIN"] },
	{ label: "Billing", href: "/platform-staff/billing", icon: Wallet, roles: ["OWNER", "ADMIN"] },
	{ label: "Messages", href: "/platform-staff/messages", icon: MessageSquare, roles: ["OWNER", "ADMIN"] },
	{ label: "Platform Staff", href: "/platform-staff/staff", icon: Users, roles: ["OWNER"] },
	{ label: "Support Tickets", href: "/platform-staff/support", icon: LifeBuoy },
	// No `roles` restriction — every admin (including SUPPORT) manages their own account.
	{ label: "Settings", href: "/platform-staff/settings", icon: Settings },
];

function SidebarContent({
	admin,
	pathname,
	onNavigate,
	onSignOut,
	isSigningOut,
}: {
	admin: { email: string; role: SuperAdminRole };
	pathname: string;
	onNavigate?: () => void;
	onSignOut: () => void;
	isSigningOut: boolean;
}) {
	return (
		<>
			<div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
				<ShieldCheck className="h-5 w-5 text-slate-300" />
				<span className="text-sm font-semibold text-white">Platform Admin</span>
			</div>
			<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
				{NAV.filter(item => !item.roles || item.roles.includes(admin.role)).map(item => {
					const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavigate}
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
				<div className="flex items-center justify-between px-3 py-2">
					<span className="truncate text-xs text-slate-500">{admin.email}</span>
					<Badge tone={admin.role === "OWNER" ? "success" : admin.role === "ADMIN" ? "info" : "default"} className="shrink-0">
						{admin.role}
					</Badge>
				</div>
				<button
					onClick={onSignOut}
					disabled={isSigningOut}
					className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200"
				>
					<LogOut className="h-4 w-4" /> Sign out
				</button>
			</div>
		</>
	);
}

export default function SuperAdminProtectedLayout({ children }: { children: React.ReactNode }) {
	const { admin, isLoading } = useAdminAuth();
	const router = useRouter();
	const pathname = usePathname();
	const logout = useAdminLogout();
	// Sidebar used to be permanently visible at a fixed 240px — fine on
	// desktop, but on a phone that left barely any room for the actual
	// page. Below lg it now lives in a slide-in drawer instead.
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	useEffect(() => {
		if (!isLoading && !admin) router.replace("/platform-staff/login");
	}, [isLoading, admin, router]);

	// Close the drawer automatically on every route change so it doesn't
	// stay open after tapping a nav link.
	useEffect(() => {
		setMobileNavOpen(false);
	}, [pathname]);

	if (isLoading || !admin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Desktop sidebar */}
			<aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
				<SidebarContent admin={admin} pathname={pathname} onSignOut={() => logout.mutate()} isSigningOut={logout.isPending} />
			</aside>

			{/* Mobile drawer */}
			{mobileNavOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileNavOpen(false)} />
					<div className="relative flex h-full w-64 max-w-[80vw] flex-col bg-slate-950">
						<button
							onClick={() => setMobileNavOpen(false)}
							className="absolute right-3 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-900"
							aria-label="Close menu"
						>
							<X className="h-5 w-5" />
						</button>
						<SidebarContent
							admin={admin}
							pathname={pathname}
							onNavigate={() => setMobileNavOpen(false)}
							onSignOut={() => logout.mutate()}
							isSigningOut={logout.isPending}
						/>
					</div>
				</div>
			)}

			<div className="flex min-w-0 flex-1 flex-col">
				{/* Mobile top bar */}
				<div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
					<button
						onClick={() => setMobileNavOpen(true)}
						className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
						aria-label="Open menu"
					>
						<Menu className="h-5 w-5" />
					</button>
					<span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
						<ShieldCheck className="h-4 w-4 text-slate-400" /> Platform Admin
					</span>
				</div>
				<main className="flex-1 overflow-x-hidden p-4 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
