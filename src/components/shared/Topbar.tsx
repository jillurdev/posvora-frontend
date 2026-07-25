"use client";

import { Bell, LogOut, Menu, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useActiveShop } from "@/context/ActiveShopContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ROLE_LABELS } from "@/lib/permissions";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
	const { user } = useAuth();
	const logout = useLogout();
	const { shops, activeShopId, setActiveShopId } = useActiveShop();

	return (
		<header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
			<button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onMenuClick}>
				<Menu className="h-5 w-5" />
			</button>
			<div className="hidden items-center gap-2 lg:flex">
				{shops.length > 0 && (
					<>
						<Store className="h-4 w-4 text-slate-400" />
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
					</>
				)}
			</div>
			<div className="flex items-center gap-4">
				<button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
					<Bell className="h-5 w-5" />
				</button>
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
						{user?.name?.[0]?.toUpperCase() ?? "U"}
					</div>
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
