"use client";

import { useRouter } from "next/navigation";
import { authApi } from "../api";
import { useAuth } from "@/context/AuthContext";

export function useLogout() {
	const router = useRouter();
	const { setUser } = useAuth();

	return async () => {
		try {
			await authApi.logout();
		} catch {
			// ignore network errors on logout
		}
		setUser(null);
		router.replace("/login");
	};
}
