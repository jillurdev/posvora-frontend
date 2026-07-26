"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";

export function useSetupTwoFactor() {
	return useMutation({
		mutationFn: () => authApi.setupTwoFactor(),
		onError: (err: Error) => toast.error(err.message || "Could not start 2FA setup"),
	});
}
