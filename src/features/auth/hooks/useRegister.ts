"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api";
import type { RegisterPayload } from "../types";
import { useAuth } from "@/context/AuthContext";

export function useRegister() {
	const { setUser } = useAuth();

	return useMutation({
		mutationFn: (payload: RegisterPayload) => authApi.register(payload),
		onSuccess: result => {
			setUser(result.user);
			toast.success("Account created successfully");
		},
		onError: (err: Error) => toast.error(err.message || "Registration failed"),
	});
}
