"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import { useAuth } from "@/context/AuthContext";

export function useEnableTwoFactor() {
	const { refetchUser } = useAuth();

	return useMutation({
		mutationFn: (token: string) => authApi.enableTwoFactor(token),
		onSuccess: () => {
			refetchUser();
		},
		onError: (err: Error) => toast.error(err.message || "Invalid code"),
	});
}
