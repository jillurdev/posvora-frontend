"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

const LINKS = [
	{ href: "/#features", label: "Features" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
	const { user, isLoading } = useAuth();
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
				<Link href="/" className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
						<Store className="h-4 w-4" />
					</div>
					<span className="text-base font-semibold text-slate-900">{siteConfig.name}</span>
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					{LINKS.map(link => (
						<Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					{!isLoading && user ? (
						<Link href={`/${user.organization?.handle ?? ""}/dashboard`}>
							<Button size="sm">Go to dashboard</Button>
						</Link>
					) : (
						<>
							<Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Sign in
							</Link>
							<Link href="/register">
								<Button size="sm">Start free trial</Button>
							</Link>
						</>
					)}
				</div>

				<button className="p-2 text-slate-600 md:hidden" onClick={() => setOpen(!open)}>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			{open && (
				<div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
					<nav className="flex flex-col gap-3">
						{LINKS.map(link => (
							<Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
								{link.label}
							</Link>
						))}
						<hr className="my-2 border-slate-100" />
						{!isLoading && user ? (
							<Link href={`/${user.organization?.handle ?? ""}/dashboard`} onClick={() => setOpen(false)}>
								<Button className="w-full">Go to dashboard</Button>
							</Link>
						) : (
							<>
								<Link href="/login" className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
									Sign in
								</Link>
								<Link href="/register" onClick={() => setOpen(false)}>
									<Button className="w-full">Start free trial</Button>
								</Link>
							</>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
