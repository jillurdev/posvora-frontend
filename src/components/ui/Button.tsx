import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
	{
		variants: {
			variant: {
				primary: "bg-slate-900 text-white hover:bg-slate-800",
				secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
				outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
				ghost: "text-slate-600 hover:bg-slate-100",
				danger: "bg-red-600 text-white hover:bg-red-700",
			},
			size: {
				sm: "h-8 px-3 text-xs",
				md: "h-10 px-4",
				lg: "h-11 px-6",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
		<button
			ref={ref}
			className={cn(buttonVariants({ variant, size }), className)}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
			{children}
		</button>
	),
);
Button.displayName = "Button";
