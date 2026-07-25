"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminAuthApi } from "../api";
import type { AdminLoginPayload } from "../types";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function useAdminLogin() {
	const { refetchAdmin } = useAdminAuth();

	return useMutation({
		mutationFn: (payload: AdminLoginPayload) => adminAuthApi.login(payload),
		onSuccess: async () => {
			await refetchAdmin();
			toast.success("Welcome back!");
		},
		onError: (err: Error) => toast.error(err.message || "Invalid email or password"),
	});
}

export function useAdminLogout() {
	const { setAdmin } = useAdminAuth();

	return useMutation({
		mutationFn: () => adminAuthApi.logout(),
		onSuccess: () => setAdmin(null),
	});
}
