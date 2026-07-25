import { Store } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-10 text-white lg:flex">
				<div className="flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
						<Store className="h-5 w-5" />
					</div>
					<span className="text-lg font-semibold">{siteConfig.name}</span>
				</div>
				<div>
					<h2 className="text-3xl font-semibold leading-tight">
						Run your entire business from one dashboard.
					</h2>
					<p className="mt-3 max-w-md text-slate-300">
						{siteConfig.description} — sales, inventory, purchases, accounting, HR and more in a single POS SaaS.
					</p>
				</div>
				<p className="text-sm text-slate-400">© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
			</div>
			<div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">{children}</div>
		</div>
	);
}
