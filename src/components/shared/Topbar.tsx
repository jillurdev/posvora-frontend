"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check, LogOut, Menu, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useOrgHandle } from "@/hooks/useOrgHandle";
import { useOrganization } from "@/features/organization/hooks/useOrganization";
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "@/features/notification/hooks/useNotifications";
import { SubscriptionPlanBadge } from "@/features/subscription/components/SubscriptionPlanBadge";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDateTime, cn } from "@/lib/utils";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
	const { user } = useAuth();
	const logout = useLogout();
	const { shops, activeShopId, setActiveShopId } = useActiveShop();
	const orgHandle = useOrgHandle();
	// Fresh, upload-invalidated source for the org logo — user.organization
	// from AuthContext only refreshes on next login/manual refetch, but this
	// query is invalidated the moment Settings uploads a new logo.
	const { data: organization } = useOrganization();
	const logoUrl = organization?.logoUrl;

	const { data: notifications = [] } = useNotifications();
	const markRead = useMarkNotificationRead();
	const markAllRead = useMarkAllRead();
	const unreadCount = notifications.filter(n => !n.isRead).length;

	const [bellOpen, setBellOpen] = useState(false);
	const bellRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!bellOpen) return;
		const onClickOutside = (e: MouseEvent) => {
			if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [bellOpen]);

	return (
		<header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
			<button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onMenuClick}>
				<Menu className="h-5 w-5" />
			</button>
			<div className="hidden items-center gap-2 lg:flex">
				{/* Org identity — shows the uploaded logo once set (Settings ->
				    Organization), falling back to the storefront icon so this
				    row never looks broken before a logo is uploaded. */}
				{logoUrl ? (
					// eslint-disable-next-line @next/next/no-img-element -- Cloudinary-hosted, arbitrary remote host not worth whitelisting in next.config for a 24px topbar icon.
					<img src={logoUrl} alt={organization?.name ?? "Organization logo"} className="h-6 w-6 rounded-md object-cover" />
				) : (
					<Store className="h-4 w-4 text-slate-400" />
				)}
				{shops.length > 0 && (
					<select
						value={activeShopId ?? ""}
						onChange={e => setActiveShopId(e.target.value)}
						className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none"
					>
						{shops.map(shop => (
							<option key={shop.id} value={shop.id}>
								{shop.name}
							</option>
						))}
					</select>
				)}
			</div>
			<div className="flex items-center gap-4">
				<SubscriptionPlanBadge />

				<div ref={bellRef} className="relative">
					<button
						className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
						onClick={() => setBellOpen(o => !o)}
						aria-label="Notifications"
					>
						<Bell className="h-5 w-5" />
						{unreadCount > 0 && (
							<span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
								{unreadCount > 9 ? "9+" : unreadCount}
							</span>
						)}
					</button>

					{bellOpen && (
						<div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
							<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
								<p className="text-sm font-semibold text-slate-900">Notifications</p>
								{unreadCount > 0 && (
									<button
										className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
										onClick={() => markAllRead.mutate()}
									>
										<Check className="h-3.5 w-3.5" /> Mark all read
									</button>
								)}
							</div>
							<div className="max-h-96 overflow-y-auto">
								{notifications.length === 0 ? (
									<p className="px-4 py-8 text-center text-sm text-slate-400">You&apos;re all caught up.</p>
								) : (
									notifications.slice(0, 8).map(n => (
										<button
											key={n.id}
											onClick={() => !n.isRead && markRead.mutate(n.id)}
											className={cn(
												"flex w-full items-start justify-between gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50",
												!n.isRead && "bg-blue-50/40",
											)}
										>
											<div>
												<p className="text-sm font-medium text-slate-900">{n.title}</p>
												{n.body && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.body}</p>}
												<p className="mt-1 text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</p>
											</div>
											{!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
										</button>
									))
								)}
							</div>
							<Link
								href={`/${orgHandle}/notifications`}
								onClick={() => setBellOpen(false)}
								className="block border-t border-slate-100 px-4 py-2.5 text-center text-xs font-medium text-slate-600 hover:bg-slate-50"
							>
								View all notifications
							</Link>
						</div>
					)}
				</div>

				<div className="flex items-center gap-3">
					<Link
						href={`/${orgHandle}/settings`}
						className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
						title="Profile settings"
					>
						{user?.avatarUrl ? (
							// eslint-disable-next-line @next/next/no-img-element -- Cloudinary-hosted, arbitrary remote host not worth whitelisting in next.config for a 36px avatar.
							<img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
						) : (
							user?.name?.[0]?.toUpperCase() ?? "U"
						)}
					</Link>
					<div className="hidden text-sm sm:block">
						<p className="font-medium text-slate-900">{user?.name}</p>
						<p className="text-xs text-slate-400">{user?.roles?.map(r => ROLE_LABELS[r]).join(", ")}</p>
					</div>
					<button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500" title="Logout">
						<LogOut className="h-4 w-4" />
					</button>
				</div>
			</div>
		</header>
	);
}
