import Link from "next/link";
import { ReceiptText } from "lucide-react";
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
		<footer className="border-t border-[var(--mk-line)] bg-[var(--mk-paper-raised)]">
			<div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
					<div className="col-span-2 sm:col-span-1">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--mk-till)] text-white">
								<ReceiptText className="h-4 w-4" />
							</div>
							<span className="font-[var(--font-mk-display)] text-base font-semibold tracking-tight text-[var(--mk-ink)]">
								{siteConfig.name}
							</span>
						</div>
						<p className="mt-3 text-sm text-[var(--mk-ink-soft)]">{siteConfig.description}</p>
					</div>
					{COLUMNS.map(col => (
						<div key={col.title}>
							<h4 className="text-sm font-semibold text-[var(--mk-ink)]">{col.title}</h4>
							<ul className="mt-3 space-y-2">
								{col.links.map(link => (
									<li key={link.href}>
										<Link href={link.href} className="text-sm text-[var(--mk-ink-soft)] hover:text-[var(--mk-ink)]">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-10 flex flex-col gap-2 border-t border-[var(--mk-line)] pt-6 text-sm text-[var(--mk-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
					<span>
						© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
					</span>
					<span className="font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]/70">Made for shops across Bangladesh</span>
				</div>
			</div>
		</footer>
	);
}
