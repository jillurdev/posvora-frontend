"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { VerifyEmailPayload } from "../types";
import { useAuth } from "@/context/AuthContext";

export function useVerifyEmail() {
	const { setUser } = useAuth();

	return useMutation({
		mutationFn: (payload: VerifyEmailPayload) => authApi.verifyEmail(payload),
		onSuccess: result => {
			setUser(result.user);
			toast.success("Email verified — welcome to Posvora!");
		},
		onError: (err: Error) => toast.error(err.message || "Invalid or expired code"),
	});
}
