import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
	id?: string;
	label: string;
	error?: string;
	required?: boolean;
	children: ReactNode;
	className?: string;
	hint?: string;
}

export function FormField({
	id,
	label,
	error,
	required,
	children,
	className,
	hint,
}: FormFieldProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<label htmlFor={id} className="block text-sm font-medium text-slate-700">
				{label}
				{required && (
					<span aria-hidden="true" className="ml-0.5 text-red-500">
						*
					</span>
				)}
			</label>

			{children}

			{hint && !error && <p className="text-xs text-slate-400">{hint}</p>}

			{error && (
				<p role="alert" className="text-xs text-red-500">
					{error}
				</p>
			)}
		</div>
	);
}
