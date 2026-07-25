"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminAuthApi } from "../api";
import type { AdminForgotPasswordPayload, AdminResetPasswordPayload } from "../types";

export function useAdminForgotPassword() {
	return useMutation({
		mutationFn: (payload: AdminForgotPasswordPayload) => adminAuthApi.forgotPassword(payload),
		onError: (err: Error) => toast.error(err.message || "Something went wrong"),
	});
}

export function useAdminResetPassword() {
	return useMutation({
		mutationFn: (payload: AdminResetPasswordPayload) => adminAuthApi.resetPassword(payload),
		onError: (err: Error) => toast.error(err.message || "Could not reset password"),
	});
}
