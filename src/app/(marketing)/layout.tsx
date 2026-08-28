import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";
import { PublicFooter } from "@/components/marketing/PublicFooter";

const mkDisplay = Space_Grotesk({
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	variable: "--font-mk-display",
});

const mkMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-mk-mono",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={`${mkDisplay.variable} ${mkMono.variable} flex min-h-screen flex-col bg-[var(--mk-paper)]`}
		>
			<PublicNavbar />
			<main className="flex-1">{children}</main>
			<PublicFooter />
		</div>
	);
}
