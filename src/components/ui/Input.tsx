"use client";

import {
	InputHTMLAttributes,
	SelectHTMLAttributes,
	TextareaHTMLAttributes,
	forwardRef,
	useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
	const [show, setShow] = useState(false);
	const isPassword = type === "password";
	const resolvedType = isPassword ? (show ? "text" : "password") : type;

	if (!isPassword) {
		return (
			<input
				ref={ref}
				type={type}
				className={cn(
					"h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		);
	}

	return (
		<div className="relative">
			<input
				ref={ref}
				type={resolvedType}
				className={cn(
					"h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
			<button
				type="button"
				tabIndex={-1}
				onClick={() => setShow(v => !v)}
				className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
				aria-label={show ? "Hide password" : "Show password"}>
				{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</button>
		</div>
	);
});

Input.displayName = "Input";

export const Select = forwardRef<
	HTMLSelectElement,
	SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
	<select
		ref={ref}
		className={cn(
			"h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
			className,
		)}
		{...props}>
		{children}
	</select>
));

Select.displayName = "Select";

export const Textarea = forwardRef<
	HTMLTextAreaElement,
	TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={cn(
			"w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
			className,
		)}
		{...props}
	/>
));

Textarea.displayName = "Textarea";
