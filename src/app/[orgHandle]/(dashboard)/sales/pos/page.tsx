import type { Metadata } from "next";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import PageContent from "./_client";

export const metadata: Metadata = { title: "New Sale · POS" };

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-[40vh] items-center justify-center">
					<Spinner />
				</div>
			}
		>
			<PageContent />
		</Suspense>
	);
}
