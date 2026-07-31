"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
	value: string;
	setValue: (v: string) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
	defaultValue,
	children,
	className,
}: {
	defaultValue: string;
	children: React.ReactNode;
	className?: string;
}) {
	const [value, setValue] = useState(defaultValue);
	return (
		<TabsContext.Provider value={{ value, setValue }}>
			<div className={className}>{children}</div>
		</TabsContext.Provider>
	);
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={cn("mb-6 flex gap-1 overflow-x-auto border-b border-slate-200", className)}>
			{children}
		</div>
	);
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");
	const active = ctx.value === value;
	return (
		<button
			type="button"
			onClick={() => ctx.setValue(value)}
			className={cn(
				"whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
				active
					? "border-slate-900 text-slate-900"
					: "border-transparent text-slate-500 hover:text-slate-700",
			)}
		>
			{children}
		</button>
	);
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error("TabsContent must be used inside Tabs");
	if (ctx.value !== value) return null;
	return <div className="space-y-8">{children}</div>;
}
