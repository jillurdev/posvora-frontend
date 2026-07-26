"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import { useAuth } from "@/context/AuthContext";

export function useDisableTwoFactor() {
	const { refetchUser } = useAuth();

	return useMutation({
		mutationFn: ({ password, token }: { password: string; token: string }) =>
			authApi.disableTwoFactor(password, token),
		onSuccess: () => {
			toast.success("Two-factor authentication disabled");
			refetchUser();
		},
		onError: (err: Error) => toast.error(err.message || "Could not disable 2FA"),
	});
}
