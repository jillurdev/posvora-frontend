"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { ResetPasswordPayload } from "../types";

export function useResetPassword() {
	return useMutation({
		mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
		onError: (err: Error) => toast.error(err.message || "Could not reset password"),
	});
}
