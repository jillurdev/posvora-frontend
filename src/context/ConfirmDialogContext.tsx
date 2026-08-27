"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface ConfirmInputOptions {
	label: string;
	placeholder?: string;
	required?: boolean;
}

interface ConfirmOptions {
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** "danger" for destructive actions (delete, deactivate, reject, etc). */
	variant?: ButtonProps["variant"];
	/** Optional free-text field (e.g. a rejection/suspension reason) shown inside the dialog. */
	input?: ConfirmInputOptions;
}

/** Resolves to `false` when cancelled, or `{ note }` (note may be "") when confirmed. */
type ConfirmResult = false | { note: string };
type ConfirmFn = (options: ConfirmOptions) => Promise<ConfirmResult>;

const ConfirmDialogContext = createContext<ConfirmFn | null>(null);

/**
 * App-wide confirm dialog. Mount once in Providers; call `useConfirm()`
 * anywhere and `await` the result instead of wiring up a one-off modal
 * per page for "are you sure you want to delete this?" (or "reject",
 * "suspend", "deactivate", etc) flows.
 *
 * Usage (simple):
 *   const confirm = useConfirm();
 *   const result = await confirm({ title: "Delete branch?", description: "...", variant: "danger" });
 *   if (result) deleteBranch.mutate(id);
 *
 * Usage (with a reason/note, e.g. rejecting a KYC document):
 *   const result = await confirm({ title: "Reject document?", input: { label: "Reason (shown to the organization)" }, variant: "danger" });
 *   if (result) review({ id, approve: false, note: result.note || undefined });
 */
export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const [noteValue, setNoteValue] = useState("");
	const resolveRef = useRef<(value: ConfirmResult) => void>();

	const confirm = useCallback<ConfirmFn>(opts => {
		setOptions(opts);
		setNoteValue("");
		return new Promise<ConfirmResult>(resolve => {
			resolveRef.current = resolve;
		});
	}, []);

	function close(result: ConfirmResult) {
		resolveRef.current?.(result);
		setOptions(null);
		setNoteValue("");
	}

	const canConfirm = !options?.input?.required || noteValue.trim().length > 0;

	return (
		<ConfirmDialogContext.Provider value={confirm}>
			{children}

			<Modal
				open={!!options}
				onClose={() => close(false)}
				title={options?.title ?? ""}
				size="sm">
				{options?.description && (
					<p className="text-sm text-slate-600">{options.description}</p>
				)}
				{options?.input && (
					<div className="mt-4">
						<label className="mb-1 block text-sm font-medium text-slate-700">
							{options.input.label}
						</label>
						<Textarea
							rows={3}
							value={noteValue}
							placeholder={options.input.placeholder}
							onChange={e => setNoteValue(e.target.value)}
						/>
					</div>
				)}
				<div className="mt-6 flex justify-end gap-2">
					<Button variant="outline" onClick={() => close(false)}>
						{options?.cancelLabel ?? "Cancel"}
					</Button>
					<Button
						variant={options?.variant ?? "primary"}
						disabled={!canConfirm}
						onClick={() => close({ note: noteValue.trim() })}>
						{options?.confirmLabel ?? "Confirm"}
					</Button>
				</div>
			</Modal>
		</ConfirmDialogContext.Provider>
	);
}

export function useConfirm(): ConfirmFn {
	const ctx = useContext(ConfirmDialogContext);
	if (!ctx)
		throw new Error("useConfirm must be used within ConfirmDialogProvider");
	return ctx;
}
