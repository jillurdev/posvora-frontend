"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";

export function useForgotPassword() {
	return useMutation({
		mutationFn: (email: string) => authApi.forgotPassword(email),
		onError: (err: Error) => toast.error(err.message || "Something went wrong"),
	});
}

export function useResetPassword() {
	return useMutation({
		mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
			authApi.resetPassword(token, newPassword),
		onError: (err: Error) => toast.error(err.message || "Could not reset password"),
	});
}
