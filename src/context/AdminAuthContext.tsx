"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { adminAuthApi } from "@/features/admin-auth/api";
import type { SuperAdminProfile } from "@/features/admin-auth/types";

interface AdminAuthContextValue {
	admin: SuperAdminProfile | null;
	isLoading: boolean;
	setAdmin: (admin: SuperAdminProfile | null) => void;
	refetchAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
	const [admin, setAdmin] = useState<SuperAdminProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refetchAdmin = useCallback(async () => {
		try {
			const me = await adminAuthApi.me();
			setAdmin(me);
		} catch {
			setAdmin(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refetchAdmin();
	}, [refetchAdmin]);

	return (
		<AdminAuthContext.Provider value={{ admin, isLoading, setAdmin, refetchAdmin }}>
			{children}
		</AdminAuthContext.Provider>
	);
}

export function useAdminAuth() {
	const ctx = useContext(AdminAuthContext);
	if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
	return ctx;
}
