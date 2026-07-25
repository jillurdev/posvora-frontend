import Link from "next/link";
import { Store } from "lucide-react";
import { siteConfig } from "@/config/site";

const COLUMNS = [
	{
		title: "Product",
		links: [
			{ href: "/#features", label: "Features" },
			{ href: "/pricing", label: "Pricing" },
		],
	},
	{
		title: "Company",
		links: [
			{ href: "/about", label: "About us" },
			{ href: "/contact", label: "Contact" },
		],
	},
	{
		title: "Legal",
		links: [
			{ href: "/terms", label: "Terms of Service" },
			{ href: "/privacy", label: "Privacy Policy" },
		],
	},
];

export function PublicFooter() {
	return (
		<footer className="border-t border-slate-200 bg-white">
			<div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
					<div className="col-span-2 sm:col-span-1">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
								<Store className="h-4 w-4" />
							</div>
							<span className="text-base font-semibold text-slate-900">{siteConfig.name}</span>
						</div>
						<p className="mt-3 text-sm text-slate-500">{siteConfig.description}</p>
					</div>
					{COLUMNS.map(col => (
						<div key={col.title}>
							<h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
							<ul className="mt-3 space-y-2">
								{col.links.map(link => (
									<li key={link.href}>
										<Link href={link.href} className="text-sm text-slate-500 hover:text-slate-900">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-400">
					© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
