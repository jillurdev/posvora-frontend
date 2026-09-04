import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { siteConfig } from "@/config/site";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://posvora-frontend.vercel.app").replace(/\/$/, "");

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: `${siteConfig.name} — ${siteConfig.description}`,
		// Inner pages set their own <title> (e.g. "Pricing") via each
		// page's own metadata export — this template appends the brand
		// name so a browser tab/search result reads "Pricing — Posvora"
		// instead of just "Pricing".
		template: `%s — ${siteConfig.name}`,
	},
	description: siteConfig.description,
	openGraph: {
		type: "website",
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		url: baseUrl,
	},
	twitter: {
		card: "summary",
		title: siteConfig.name,
		description: siteConfig.description,
	},
	robots: { index: true, follow: true },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0e6b4f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
