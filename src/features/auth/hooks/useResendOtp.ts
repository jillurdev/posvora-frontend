"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { ResendOtpPayload } from "../types";

export function useResendOtp() {
	return useMutation({
		mutationFn: (payload: ResendOtpPayload) => authApi.resendOtp(payload),
		onSuccess: () => toast.success("A new code has been sent to your email"),
		onError: (err: Error) => toast.error(err.message || "Please wait a moment and try again"),
	});
}
