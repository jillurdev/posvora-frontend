import type { Metadata } from "next";
import PricingPageClient from "./_client";

export const metadata: Metadata = {
	title: "Pricing",
	description: "Simple, transparent pricing that scales with your business. See exactly what's included in every plan — no hidden fees.",
};

export default function PricingPage() {
	return <PricingPageClient />;
}
