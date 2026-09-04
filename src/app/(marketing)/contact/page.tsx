import type { Metadata } from "next";
import ContactPageClient from "./_client";

export const metadata: Metadata = {
	title: "Contact Us",
	description: "Have a question about Posvora? Send us a message and our team will get back to you within one business day.",
};

export default function ContactPage() {
	return <ContactPageClient />;
}
