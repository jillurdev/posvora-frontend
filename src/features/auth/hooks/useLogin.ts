"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { LoginPayload } from "../types";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
	const { setUser } = useAuth();

	return useMutation({
		mutationFn: (payload: LoginPayload) => authApi.login(payload),
		onSuccess: result => {
			setUser(result.user);
			toast.success("Welcome back!");
		},
		onError: (err: Error) => {
		    return toast.error(err.message || "Login failed");
		},
	});
}
