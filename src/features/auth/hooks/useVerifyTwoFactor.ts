"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { VerifyTwoFactorPayload } from "../types";
import { useAuth } from "@/context/AuthContext";

export function useVerifyTwoFactor() {
	const { setUser } = useAuth();

	return useMutation({
		mutationFn: (payload: VerifyTwoFactorPayload) => authApi.verifyTwoFactor(payload),
		onSuccess: result => {
			setUser(result.user);
			toast.success("Welcome back!");
		},
		onError: (err: Error) => toast.error(err.message || "Invalid code"),
	});
}
