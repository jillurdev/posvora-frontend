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

interface ConfirmOptions {
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** "danger" for destructive actions (delete, deactivate, etc). */
	variant?: ButtonProps["variant"];
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmFn | null>(null);

/**
 * App-wide confirm dialog. Mount once in Providers; call `useConfirm()`
 * anywhere and `await` the result instead of wiring up a one-off modal
 * per page for "are you sure you want to delete this?" flows.
 *
 * Usage:
 *   const confirm = useConfirm();
 *   const ok = await confirm({ title: "Delete branch?", description: "...", variant: "danger" });
 *   if (ok) deleteBranch.mutate(id);
 */
export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const resolveRef = useRef<(value: boolean) => void>();

	const confirm = useCallback<ConfirmFn>(opts => {
		setOptions(opts);
		return new Promise<boolean>(resolve => {
			resolveRef.current = resolve;
		});
	}, []);

	function close(result: boolean) {
		resolveRef.current?.(result);
		setOptions(null);
	}

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
				<div className="mt-6 flex justify-end gap-2">
					<Button variant="outline" onClick={() => close(false)}>
						{options?.cancelLabel ?? "Cancel"}
					</Button>
					<Button
						variant={options?.variant ?? "primary"}
						onClick={() => close(true)}>
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
