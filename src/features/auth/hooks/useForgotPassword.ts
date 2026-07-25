"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { ForgotPasswordPayload } from "../types";

export function useForgotPassword() {
	return useMutation({
		mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
		onError: (err: Error) => toast.error(err.message || "Something went wrong"),
	});
}
