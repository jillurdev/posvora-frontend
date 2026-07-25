"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { ChangePasswordPayload } from "../types";

export function useChangePassword() {
	return useMutation({
		mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
		onSuccess: () => toast.success("Password changed successfully"),
		onError: (err: Error) => toast.error(err.message || "Could not change password"),
	});
}
