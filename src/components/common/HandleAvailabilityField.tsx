"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export type HandleCheckResult = { available: boolean; handle?: string; slug?: string; reason?: string };

interface HandleAvailabilityFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	/** Current saved value — if the field is unchanged from this, it's always treated as available (no need to check against yourself). */
	currentValue?: string;
	placeholder?: string;
	hint?: string;
	disabled?: boolean;
	/** Hits the backend's availability-check endpoint. Return shape from either organization or shop API works — this component reads `.available`/`.reason` off it. */
	checkAvailability: (value: string) => Promise<HandleCheckResult>;
	/** Reports the live-checked status back up so the parent form can gate its Save button — true only once a fresh, definite "available" comes back for the CURRENT input value. */
	onAvailabilityChange: (isAvailableAndCurrent: boolean) => void;
}

type Status = "idle" | "checking" | "available" | "unavailable" | "invalid" | "error";

/**
 * "Handle (public URL)" field with a live, debounced availability check —
 * used identically for the organization handle and each shop's handle.
 * Save/Create in the parent form should stay disabled unless
 * onAvailabilityChange has most recently reported true, so a user can never
 * submit a handle this field just told them was taken.
 */
export function HandleAvailabilityField({
	id,
	label,
	value,
	onChange,
	currentValue,
	placeholder,
	hint,
	disabled,
	checkAvailability,
	onAvailabilityChange,
}: HandleAvailabilityFieldProps) {
	const [status, setStatus] = useState<Status>("idle");
	const [message, setMessage] = useState<string | null>(null);
	// Guards against a slow earlier request resolving after a newer one and
	// clobbering the status shown for what the user has since typed.
	const requestSeq = useRef(0);

	useEffect(() => {
		const trimmed = value.trim();

		if (!trimmed) {
			setStatus("idle");
			setMessage(null);
			onAvailabilityChange(false);
			return;
		}
		if (currentValue && trimmed === currentValue) {
			setStatus("idle");
			setMessage(null);
			onAvailabilityChange(true);
			return;
		}
		if (trimmed.length < 3) {
			setStatus("invalid");
			setMessage("At least 3 characters.");
			onAvailabilityChange(false);
			return;
		}

		setStatus("checking");
		onAvailabilityChange(false);
		const mySeq = ++requestSeq.current;

		const timer = setTimeout(async () => {
			try {
				const result = await checkAvailability(trimmed);
				if (requestSeq.current !== mySeq) return; // a newer keystroke superseded this check
				setStatus(result.available ? "available" : "unavailable");
				setMessage(result.available ? null : (result.reason ?? "This handle is already taken."));
				onAvailabilityChange(result.available);
			} catch {
				if (requestSeq.current !== mySeq) return;
				setStatus("error");
				setMessage("Couldn't check availability — try again.");
				onAvailabilityChange(false);
			}
		}, 500);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- checkAvailability/onAvailabilityChange are expected to be stable-ish per render; re-running on identity churn would defeat the debounce.
	}, [value, currentValue]);

	return (
		<FormField id={id} label={label} hint={!message ? hint : undefined}>
			<div className="relative">
				<Input
					id={id}
					value={value}
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					className={cn(
						"pr-9",
						status === "unavailable" || status === "invalid" || status === "error"
							? "border-red-300 focus:ring-red-200"
							: status === "available" && "border-emerald-300 focus:ring-emerald-200",
					)}
				/>
				<div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
					{status === "checking" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
					{status === "available" && <Check className="h-4 w-4 text-emerald-500" />}
					{(status === "unavailable" || status === "invalid" || status === "error") && <X className="h-4 w-4 text-red-500" />}
				</div>
			</div>
			{message && <p className="text-xs text-red-500">{message}</p>}
			{status === "available" && !message && <p className="text-xs text-emerald-600">Available!</p>}
		</FormField>
	);
}
