import type { Metadata } from "next";
import PageContent from "./_client";

export const metadata: Metadata = { title: "Accounting" };

export default function Page() {
	return <PageContent />;
}
