"use client";

import { usePathname, useParams } from "next/navigation";
import { AlertTriangle, Gift } from "lucide-react";
import Link from "next/link";
import { useMySubscription } from "../hooks/useSubscription";
import { getRenewalWarning } from "../utils";

export function SubscriptionStatusBanner() {
	const { data: me } = useMySubscription();
	const pathname = usePathname();
	const { orgHandle } = useParams<{ orgHandle: string }>();

	// The subscription page already shows this context inline — no need to
	// stack a second banner on top of it there.
	if (pathname?.endsWith("/subscription")) return null;

	const subscription = me?.subscription;
	if (!subscription) return null;

	const warning = getRenewalWarning(subscription);
	const isOnFreePlan = subscription.plan?.price === 0;

	if (warning) {
		const planWord = warning.isTrial ? "free trial" : "plan";
		const consequence = warning.isTrial
			? "you'll automatically move to the Free plan (limited features)"
			: "premium features will stop and your organization will automatically move to the Free plan (limited features)";

		return (
			<Banner tone={warning.level === "urgent" ? "danger" : "warning"} orgHandle={orgHandle} icon={<AlertTriangle className="h-4 w-4 shrink-0" />}>
				{warning.daysLeft === 0
					? `Your ${planWord} ends today — renew now to avoid interruption.`
					: `Your ${planWord} ends in ${warning.daysLeft} day${warning.daysLeft === 1 ? "" : "s"}. Renew as soon as possible — after it ends, ${consequence}.`}
			</Banner>
		);
	}

	if (isOnFreePlan) {
		return (
			<Banner tone="info" orgHandle={orgHandle} icon={<Gift className="h-4 w-4 shrink-0" />}>
				You&apos;re on the Free plan with limited features. Upgrade for full access.
			</Banner>
		);
	}

	return null;
}

function Banner({
	tone,
	orgHandle,
	icon,
	children,
}: {
	tone: "warning" | "danger" | "info";
	orgHandle: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	const toneClass = {
		warning: "border-amber-200 bg-amber-50 text-amber-800",
		danger: "border-red-200 bg-red-50 text-red-700",
		info: "border-blue-200 bg-blue-50 text-blue-700",
	}[tone];

	return (
		<div className={`flex items-center justify-between gap-3 border-b px-4 py-2 text-sm lg:px-8 ${toneClass}`}>
			<span className="flex items-center gap-2">
				{icon}
				{children}
			</span>
			<Link href={`/${orgHandle}/subscription`} className="shrink-0 font-medium underline underline-offset-2">
				Renew now
			</Link>
		</div>
	);
}
