"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { AuthUser } from "@/types/user";
import { authApi } from "@/features/auth/api";

interface AuthContextValue {
	user: AuthUser | null;
	isLoading: boolean;
	setUser: (user: AuthUser | null) => void;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Only these route prefixes require a signed-in user. Any other route (marketing pages,
// /login, /register) must never be force-redirected just because a background "am I logged
// in?" check came back unauthenticated.
const PROTECTED_PREFIXES = [
	"/dashboard",
	"/products",
	"/inventory",
	"/sales",
	"/purchases",
	"/customers",
	"/suppliers",
	"/employees",
	"/accounting",
	"/shops",
	"/branches",
	"/warehouses",
	"/roles",
	"/subscription",
	"/audit-logs",
	"/notifications",
	"/settings",
	"/support",
];

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();
	const pathnameRef = useRef(pathname);
	pathnameRef.current = pathname;

	const refetchUser = useCallback(async () => {
		try {
			const me = await authApi.me();
			setUser(me);
		} catch {
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refetchUser();
	}, [refetchUser]);

	useEffect(() => {
		const handleLogout = () => {
			setUser(null);
			const currentPath = pathnameRef.current ?? "";
			const isProtected = PROTECTED_PREFIXES.some(prefix => currentPath.startsWith(prefix));
			if (isProtected) router.replace("/login");
		};
		window.addEventListener("auth:logout", handleLogout);
		return () => window.removeEventListener("auth:logout", handleLogout);
	}, [router]);

	return (
		<AuthContext.Provider value={{ user, isLoading, setUser, refetchUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
