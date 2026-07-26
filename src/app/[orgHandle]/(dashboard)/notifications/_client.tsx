"use client";

import { Bell, Check } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "@/features/notification/hooks/useNotifications";
import { formatDateTime, cn } from "@/lib/utils";

export default function NotificationsPage() {
	const { data: notifications = [], isLoading } = useNotifications();
	const markRead = useMarkNotificationRead();
	const markAllRead = useMarkAllRead();

	return (
		<div>
			<PageHeader
				title="Notifications"
				description="Stay on top of low stock alerts, due follow-ups and system messages."
				action={
					<Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
						<Check className="h-4 w-4" /> Mark all read
					</Button>
				}
			/>

			{isLoading ? (
				<Spinner />
			) : notifications.length === 0 ? (
				<EmptyState icon={Bell} title="You're all caught up" description="No notifications right now." />
			) : (
				<div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
					{notifications.map(n => (
						<button
							key={n.id}
							onClick={() => !n.isRead && markRead.mutate(n.id)}
							className={cn("flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50", !n.isRead && "bg-blue-50/40")}
						>
							<div>
								<p className="text-sm font-medium text-slate-900">{n.title}</p>
								{n.body && <p className="mt-1 text-sm text-slate-500">{n.body}</p>}
								<p className="mt-1 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
							</div>
							{!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
