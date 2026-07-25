"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ActiveShopProvider } from "@/context/ActiveShopContext";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { MobileSidebar } from "@/components/shared/MobileSidebar";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		if (!isLoading && !user) router.replace("/login");
	}, [isLoading, user, router]);

	if (isLoading || !user) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<ActiveShopProvider>
			<div className="flex min-h-screen bg-slate-50">
				<Sidebar />
				<MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
				<div className="flex min-h-screen flex-1 flex-col">
					<Topbar onMenuClick={() => setMobileOpen(true)} />
					<main className="flex-1 p-4 lg:p-8">{children}</main>
				</div>
			</div>
		</ActiveShopProvider>
	);
}
