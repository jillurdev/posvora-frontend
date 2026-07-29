"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ActiveShopProvider } from "@/context/ActiveShopContext";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { MobileSidebar } from "@/components/shared/MobileSidebar";
import { ForceChangePasswordModal } from "@/components/shared/ForceChangePasswordModal";
import { Spinner } from "@/components/ui/Spinner";
import { SubscriptionStatusBanner } from "@/features/subscription/components/SubscriptionStatusBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const [mobileOpen, setMobileOpen] = useState(false);

	const correctHandle = user?.organization?.handle ?? null;
	// Every dashboard URL is scoped to an org handle (posvora.com/<handle>/dashboard).
	// If the segment in the URL doesn't match the signed-in user's own org — a stale
	// bookmark, a typo, or someone else's link — send them to their own org instead,
	// preserving whatever sub-page they were trying to reach.
	const handleMismatch = !!correctHandle && correctHandle !== orgHandle;

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			router.replace("/login");
			return;
		}

		if (handleMismatch) {
			const rest = pathname.split("/").slice(2).join("/");
			router.replace(`/${correctHandle}${rest ? `/${rest}` : ""}`);
		}
	}, [isLoading, user, handleMismatch, correctHandle, pathname, router]);

	if (isLoading || !user || handleMismatch) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (user.mustChangePassword) {
		return <ForceChangePasswordModal />;
	}

	return (
		<ActiveShopProvider>
			<div className="flex h-screen overflow-hidden bg-slate-50">
				<Sidebar />
				<MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
				<div className="flex h-screen flex-1 flex-col overflow-hidden">
					<Topbar onMenuClick={() => setMobileOpen(true)} />
					<SubscriptionStatusBanner />
					<main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
				</div>
			</div>
		</ActiveShopProvider>
	);
}
