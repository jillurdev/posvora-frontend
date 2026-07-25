import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
	label: string;
	error?: string;
	required?: boolean;
	children: ReactNode;
	className?: string;
	hint?: string;
}

export function FormField({ label, error, required, children, className, hint }: FormFieldProps) {
	return (
		<div className={cn("space-y-1.5", className)}>
			<label className="block text-sm font-medium text-slate-700">
				{label}
				{required && <span className="ml-0.5 text-red-500">*</span>}
			</label>
			{children}
			{hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
}
