import type { MetadataRoute } from "next";

// Public-facing marketing/storefront pages are crawlable; everything
// behind a login (org dashboards, platform-staff) is disallowed — there's
// nothing there for a search engine to index anyway since it 302s to
// /login for an unauthenticated crawler, but disallowing it outright saves
// crawl budget and avoids login-wall pages ever getting indexed by mistake.
export default function robots(): MetadataRoute.Robots {
	const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://posvora-frontend.vercel.app").replace(/\/$/, "");

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/platform-staff", "/*/dashboard", "/*/settings", "/*/products", "/*/sales", "/*/purchases", "/*/subscription"],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
