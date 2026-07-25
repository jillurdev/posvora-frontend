import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
	default: "bg-slate-100 text-slate-700",
	success: "bg-emerald-100 text-emerald-700",
	warning: "bg-amber-100 text-amber-700",
	danger: "bg-red-100 text-red-700",
	info: "bg-blue-100 text-blue-700",
};

export function Badge({ tone = "default", children, className }: { tone?: keyof typeof tones; children: React.ReactNode; className?: string }) {
	return (
		<span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
			{children}
		</span>
	);
}
