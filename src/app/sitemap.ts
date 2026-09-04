import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://posvora-frontend.vercel.app").replace(/\/$/, "");
	const now = new Date();

	// Only the public marketing pages — /shop/[slug] storefronts are
	// per-merchant and dynamic, and dashboard/platform-staff routes require
	// login (excluded via robots.ts too), so none of those belong here.
	const routes = ["", "/pricing", "/about", "/contact", "/terms", "/privacy"];

	return routes.map(route => ({
		url: `${baseUrl}${route}`,
		lastModified: now,
		changeFrequency: route === "" ? "weekly" : "monthly",
		priority: route === "" ? 1 : 0.7,
	}));
}
