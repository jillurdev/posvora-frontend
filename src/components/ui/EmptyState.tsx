import { LucideIcon, Inbox } from "lucide-react";

export function EmptyState({
	icon: Icon = Inbox,
	title,
	description,
	action,
}: {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center">
			<Icon className="mb-3 h-10 w-10 text-slate-300" />
			<p className="text-sm font-medium text-slate-700">{title}</p>
			{description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
