import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";
import { Input, Select, Textarea } from "./Input";

/**
 * Why this exists: FormField (label/required/error/hint layout) and Input
 * (the raw styled control) are kept as separate, single-responsibility
 * primitives on purpose — Input needs to work label-less too (inline table
 * filters, search boxes, quick-edit cells), and the same FormField wraps
 * Input, Select, *and* Textarea without repeating label/error logic three
 * times.
 *
 * But that means every labeled field in a real form repeats the same
 * `<FormField id label error><Input id {...} /></FormField>` boilerplate.
 * TextField/SelectField/TextareaField are a thin convenience layer on top:
 * same two primitives underneath, one line at the call site.
 *
 * Use the primitives directly when you need something label-less or a
 * custom layout; use these everywhere else.
 */

interface FieldWrapperProps {
	label: string;
	error?: string;
	required?: boolean;
	hint?: string;
	wrapperClassName?: string;
}

export interface TextFieldProps
	extends FieldWrapperProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
	id: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
	({ id, label, error, required, hint, wrapperClassName, className, ...inputProps }, ref) => (
		<FormField id={id} label={label} error={error} required={required} hint={hint} className={wrapperClassName}>
			<Input
				ref={ref}
				id={id}
				aria-invalid={!!error}
				className={cn(className, error && "border-red-500 focus:ring-red-200")}
				{...inputProps}
			/>
		</FormField>
	),
);
TextField.displayName = "TextField";

export interface SelectFieldProps
	extends FieldWrapperProps,
		Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
	id: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
	({ id, label, error, required, hint, wrapperClassName, className, children, ...selectProps }, ref) => (
		<FormField id={id} label={label} error={error} required={required} hint={hint} className={wrapperClassName}>
			<Select
				ref={ref}
				id={id}
				aria-invalid={!!error}
				className={cn(className, error && "border-red-500 focus:ring-red-200")}
				{...selectProps}
			>
				{children}
			</Select>
		</FormField>
	),
);
SelectField.displayName = "SelectField";

export interface TextareaFieldProps
	extends FieldWrapperProps,
		Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
	id: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	({ id, label, error, required, hint, wrapperClassName, className, ...textareaProps }, ref) => (
		<FormField id={id} label={label} error={error} required={required} hint={hint} className={wrapperClassName}>
			<Textarea
				ref={ref}
				id={id}
				aria-invalid={!!error}
				className={cn(className, error && "border-red-500 focus:ring-red-200")}
				{...textareaProps}
			/>
		</FormField>
	),
);
TextareaField.displayName = "TextareaField";
