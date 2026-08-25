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
// org handle — and therefore protected. Marketing pages, auth pages, and the platform-staff
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
	"platform-staff",
]);

function isProtectedPath(pathname: string): boolean {
	const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
	return !PUBLIC_TOP_SEGMENTS.has(firstSegment);
}

// Pages that only make sense for a logged-out visitor. If a session turns out
// to be valid while sitting on one of these, bounce straight to the dashboard
// instead of showing the login/register form to an already-authenticated user.
const AUTH_ONLY_SEGMENTS = new Set(["login", "register", "forgot-password", "reset-password"]);

function isAuthOnlyPath(pathname: string): boolean {
	const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
	return AUTH_ONLY_SEGMENTS.has(firstSegment);
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

	// Once we know the visitor is already signed in, don't let them sit on
	// /login, /register, etc. — send them straight to their dashboard.
	useEffect(() => {
		if (isLoading || !user) return;
		if (!isAuthOnlyPath(pathname ?? "")) return;
		router.replace(`/${user.organization?.handle ?? ""}/dashboard`);
	}, [isLoading, user, pathname, router]);

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
