import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
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
