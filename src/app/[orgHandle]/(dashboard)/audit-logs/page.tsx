import type { Metadata } from "next";
import PageContent from "./_client";

export const metadata: Metadata = { title: "Audit Logs" };

export default function Page() {
	return <PageContent />;
}
