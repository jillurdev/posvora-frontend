"use client";

import { useEffect, useState } from "react";
import { Megaphone, X } from "lucide-react";
import { useAnnouncements } from "../hooks/useAnnouncements";

const DISMISSED_KEY = "posvora:dismissed-announcements";

function getDismissedIds(): string[] {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(window.localStorage.getItem(DISMISSED_KEY) ?? "[]");
	} catch {
		return [];
	}
}

function dismiss(id: string) {
	const current = getDismissedIds();
	window.localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, id]));
}

export function AnnouncementBanner() {
	const { data: announcements = [] } = useAnnouncements();
	const [dismissedIds, setDismissedIds] = useState<string[]>([]);

	useEffect(() => {
		setDismissedIds(getDismissedIds());
	}, []);

	const active = announcements.find(a => !dismissedIds.includes(a.id));
	if (!active) return null;

	return (
		<div className="flex items-start justify-between gap-3 border-b border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-800 lg:px-8">
			<span className="flex items-start gap-2">
				<Megaphone className="mt-0.5 h-4 w-4 shrink-0" />
				<span>
					<span className="font-medium">{active.title}</span> — {active.message}
				</span>
			</span>
			<button
				type="button"
				onClick={() => {
					dismiss(active.id);
					setDismissedIds(prev => [...prev, active.id]);
				}}
				className="shrink-0 rounded p-0.5 hover:bg-blue-100"
				aria-label="Dismiss"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
