"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Store, MapPin } from "lucide-react";
import { shopApi } from "@/features/shop/api";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/marketing/Reveal";

/**
 * Public, unauthenticated storefront profile — the first slice of the
 * "posvora.com/<handle>" public-view concept: anyone (logged out) can
 * open this page for any active shop, while the full management
 * dashboard for that shop still requires the owner/staff to sign in.
 */
export default function PublicShopPage() {
	const params = useParams<{ slug: string }>();
	const { data: shop, isLoading, isError } = useQuery({
		queryKey: ["public-shop", params.slug],
		queryFn: () => shopApi.getPublic(params.slug),
		retry: false,
	});

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (isError || !shop) {
		return (
			<div className="mx-auto max-w-xl px-4 py-24">
				<EmptyState
					icon={Store}
					title="Shop not found"
					description="This link may be incorrect, or the shop is no longer active."
				/>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
			<Reveal>
				<div className="flex items-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--mk-till)] text-white">
						<Store className="h-7 w-7" />
					</div>
					<div>
						<h1 className="font-[var(--font-mk-display)] text-2xl font-semibold tracking-tight text-[var(--mk-ink)]">{shop.name}</h1>
						<p className="text-sm text-[var(--mk-ink-soft)]">{shop.organization.name}</p>
					</div>
				</div>

				{shop.address && (
					<div className="mt-8 flex items-start gap-2 rounded-xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-4 text-sm text-[var(--mk-ink-soft)]">
						<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mk-till)]" />
						{shop.address}
					</div>
				)}

				<p className="mt-8 text-sm text-[var(--mk-ink-soft)]">
					Staff and owners of this shop can{" "}
					<a href="/login" className="font-medium text-[var(--mk-till)] underline underline-offset-2">
						sign in
					</a>{" "}
					to manage it. This public page never shows sales, staff, or customer data.
				</p>
			</Reveal>
		</div>
	);
}
