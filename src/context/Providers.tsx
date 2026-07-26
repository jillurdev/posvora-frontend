"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./AuthContext";
import { ConfirmDialogProvider } from "./ConfirmDialogContext";

export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ConfirmDialogProvider>
					{children}
					<Toaster richColors position="top-right" />
				</ConfirmDialogProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
