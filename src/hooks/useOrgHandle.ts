"use client";

import { useParams } from "next/navigation";

/**
 * Reads the `[orgHandle]` dynamic segment from the URL (e.g. "myorg" from
 * posvora.com/myorg/dashboard). Only meaningful inside the org-scoped
 * dashboard routes — returns an empty string elsewhere.
 */
export function useOrgHandle(): string {
	const params = useParams<{ orgHandle?: string }>();
	return params?.orgHandle ?? "";
}

/** Builds an org-scoped dashboard path, e.g. orgPath("products") -> "/myorg/products". */
export function useOrgPath() {
	const orgHandle = useOrgHandle();
	return (segment: string) => `/${orgHandle}/${segment.replace(/^\/+/, "")}`;
}
