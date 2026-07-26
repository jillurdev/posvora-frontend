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

// Dashboard routes are now org-scoped: /<orgHandle>/dashboard, /<orgHandle>/products, etc.
// Rather than hardcoding every dashboard section (which would need updating every time a
// new one is added), treat any first path segment that ISN'T a known public route as an
// org handle — and therefore protected. Marketing pages, auth pages, and the super-admin
// area must never be force-redirected just because a background "am I logged in?" check
// came back unauthenticated.
const PUBLIC_TOP_SEGMENTS = new Set([
	"",
	"login",
	"register",
	"forgot-password",
	"reset-password",
	"about",
	"contact",
	"pricing",
	"privacy",
	"terms",
	"shop",
	"support",
	"super-admin",
]);

function isProtectedPath(pathname: string): boolean {
	const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
	return !PUBLIC_TOP_SEGMENTS.has(firstSegment);
}

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
			if (isProtectedPath(currentPath)) router.replace("/login");
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
