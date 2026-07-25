"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useShops } from "@/features/shop/hooks/useShops";
import type { Shop } from "@/features/shop/types";

interface ActiveShopContextValue {
	shops: Shop[];
	activeShopId: string | null;
	setActiveShopId: (id: string) => void;
	isLoading: boolean;
}

const ActiveShopContext = createContext<ActiveShopContextValue | undefined>(undefined);

export function ActiveShopProvider({ children }: { children: ReactNode }) {
	const { data: shops = [], isLoading } = useShops();
	const [activeShopId, setActiveShopId] = useState<string | null>(null);

	useEffect(() => {
		if (!activeShopId && shops.length > 0) setActiveShopId(shops[0].id);
	}, [shops, activeShopId]);

	return (
		<ActiveShopContext.Provider value={{ shops, activeShopId, setActiveShopId, isLoading }}>
			{children}
		</ActiveShopContext.Provider>
	);
}

export function useActiveShop() {
	const ctx = useContext(ActiveShopContext);
	if (!ctx) throw new Error("useActiveShop must be used within ActiveShopProvider");
	return ctx;
}
