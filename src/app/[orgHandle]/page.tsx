"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";

// Visiting the bare org URL (e.g. posvora.com/private-company, with nothing
// after the handle) has no page of its own — send it straight to that org's
// dashboard. The (dashboard) layout still does the real auth + handle
// validation once we land there.
export default function OrgRootPage() {
	const router = useRouter();
	const { orgHandle } = useParams<{ orgHandle: string }>();

	useEffect(() => {
		router.replace(`/${orgHandle}/dashboard`);
	}, [orgHandle, router]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Spinner />
		</div>
	);
}
