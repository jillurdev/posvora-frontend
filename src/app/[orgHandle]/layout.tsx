import type { Metadata } from "next";
import { cookies } from "next/headers";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";

async function fetchOrgName(): Promise<string | null> {
	try {
		const cookieStore = await cookies();
		const cookieHeader = cookieStore.toString();
		if (!cookieHeader) return null;

		// Server-to-server call, forwarding the browser's (httpOnly) auth cookie so
		// the backend can resolve the signed-in user's own organization. This runs
		// at request time on the server, so it works even though httpOnly cookies
		// aren't readable by client-side JS.
		const res = await fetch(`${env.apiUrl}/organization/me`, {
			headers: { Cookie: cookieHeader },
			cache: "no-store",
		});
		if (!res.ok) return null;

		const json = await res.json().catch(() => null);
		const org = json?.data ?? json;
		return typeof org?.name === "string" ? org.name : null;
	} catch {
		return null;
	}
}

// Turns a handle like "whore-store" into "Whore Store" — used only as a
// fallback when we can't resolve the real organization name (e.g. logged out).
function humanizeHandle(handle: string): string {
	return handle
		.split("-")
		.filter(Boolean)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ orgHandle: string }>;
}): Promise<Metadata> {
	const { orgHandle } = await params;
	const orgName = (await fetchOrgName()) ?? humanizeHandle(orgHandle);

	return {
		// Every dashboard page sets its own short `metadata.title` (e.g. "Products"),
		// which fills in "%s" here — so the tab reads "Products · Acme Store",
		// "Dashboard · Acme Store", etc. Pages that don't set one fall back to `default`.
		title: {
			template: `%s · ${orgName}`,
			default: `${orgName} · ${siteConfig.name}`,
		},
	};
}

export default function OrgLayout({ children }: { children: React.ReactNode }) {
	return children;
}
