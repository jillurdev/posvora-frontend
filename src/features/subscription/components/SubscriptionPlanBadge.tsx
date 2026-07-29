"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CreditCard } from "lucide-react";
import { useMySubscription } from "../hooks/useSubscription";
import { daysRemaining, getRenewalWarning } from "../utils";

export function SubscriptionPlanBadge() {
	const { data: me } = useMySubscription();
	const { orgHandle } = useParams<{ orgHandle: string }>();
	const subscription = me?.subscription;

	if (!subscription?.plan) return null;

	const isTrialing = subscription.status === "TRIALING";
	const left = isTrialing ? daysRemaining(subscription.trialEndsAt) : daysRemaining(subscription.currentEnd);
	const warning = getRenewalWarning(subscription);

	return (
		<Link
			href={`/${orgHandle}/subscription`}
			className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 md:flex"
			title="Manage subscription"
		>
			<CreditCard className="h-3.5 w-3.5 text-slate-400" />
			{subscription.plan.name}
			{left !== null && (
				<span className={warning?.level === "urgent" ? "font-semibold text-red-600" : warning ? "text-amber-600" : "text-slate-400"}>
					· {left}d {isTrialing ? "trial" : "left"}
				</span>
			)}
		</Link>
	);
}
