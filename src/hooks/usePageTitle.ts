"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { siteConfig } from "@/config/site";

/**
 * Sets document.title to "<title> · <Organization> · Posvora" while inside an
 * organization (falls back to "<title> · Posvora" if the org isn't loaded yet,
 * or just "Posvora" if no title is given). Pass undefined/empty while data is
 * still loading to avoid a flash of the wrong title.
 */
export function usePageTitle(title?: string) {
	const { user } = useAuth();
	const orgName = user?.organization?.name;

	useEffect(() => {
		if (!title) {
			document.title = siteConfig.name;
			return;
		}
		document.title = orgName ? `${title} · ${orgName} · ${siteConfig.name}` : `${title} · ${siteConfig.name}`;
	}, [title, orgName]);
}
