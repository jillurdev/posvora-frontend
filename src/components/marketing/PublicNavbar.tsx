"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ReceiptText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={`sticky top-0 z-40 border-b transition-colors ${
				scrolled ? "border-[var(--mk-line)] bg-[var(--mk-paper)]/90 backdrop-blur" : "border-transparent bg-[var(--mk-paper)]/0"
			}`}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
				<Link href="/" className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--mk-till)] text-white">
						<ReceiptText className="h-4 w-4" />
					</div>
					<span className="font-[var(--font-mk-display)] text-base font-semibold tracking-tight text-[var(--mk-ink)]">
						{siteConfig.name}
					</span>
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					{LINKS.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-[var(--mk-ink-soft)] transition-colors hover:text-[var(--mk-ink)]"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					{!isLoading && user ? (
						<Link
							href={`/${user.organization?.handle ?? ""}/dashboard`}
							className="inline-flex h-9 items-center rounded-md bg-[var(--mk-till)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--mk-till-deep)]"
						>
							Go to dashboard
						</Link>
					) : (
						<>
							<Link href="/login" className="text-sm font-medium text-[var(--mk-ink-soft)] hover:text-[var(--mk-ink)]">
								Sign in
							</Link>
							<Link
								href="/register"
								className="inline-flex h-9 items-center rounded-md bg-[var(--mk-till)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--mk-till-deep)]"
							>
								Start free trial
							</Link>
						</>
					)}
				</div>

				<button
					className="p-2 text-[var(--mk-ink-soft)] md:hidden"
					onClick={() => setOpen(!open)}
					aria-label={open ? "Close menu" : "Open menu"}
					aria-expanded={open}
				>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			{open && (
				<div className="border-t border-[var(--mk-line)] bg-[var(--mk-paper)] px-4 py-4 md:hidden">
					<nav className="flex flex-col gap-3">
						{LINKS.map(link => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-medium text-[var(--mk-ink-soft)]"
								onClick={() => setOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<hr className="my-2 border-[var(--mk-line)]" />
						{!isLoading && user ? (
							<Link
								href={`/${user.organization?.handle ?? ""}/dashboard`}
								onClick={() => setOpen(false)}
								className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[var(--mk-till)] text-sm font-medium text-white"
							>
								Go to dashboard
							</Link>
						) : (
							<>
								<Link href="/login" className="text-sm font-medium text-[var(--mk-ink-soft)]" onClick={() => setOpen(false)}>
									Sign in
								</Link>
								<Link
									href="/register"
									onClick={() => setOpen(false)}
									className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[var(--mk-till)] text-sm font-medium text-white"
								>
									Start free trial
								</Link>
							</>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
