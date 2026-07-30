"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { RegisterPayload } from "../types";

export function useRegister() {
	return useMutation({
		mutationFn: (payload: RegisterPayload) => authApi.register(payload),
		onSuccess: () => {
			toast.success("We've sent a verification code to your email");
		},
		onError: (err: Error) => toast.error(err.message || "Registration failed"),
	});
}
