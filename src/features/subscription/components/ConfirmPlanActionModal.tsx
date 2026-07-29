"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmPlanActionModalProps {
	open: boolean;
	title: string;
	description: string;
	confirmLabel: string;
	isLoading?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export function ConfirmPlanActionModal({
	open,
	title,
	description,
	confirmLabel,
	isLoading,
	onConfirm,
	onClose,
}: ConfirmPlanActionModalProps) {
	return (
		<Modal open={open} onClose={onClose} title={title} size="sm">
			<div className="space-y-5">
				<p className="text-sm text-slate-600">{description}</p>
				<div className="grid grid-cols-2 gap-2">
					<Button variant="outline" onClick={onClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button isLoading={isLoading} onClick={onConfirm}>
						{confirmLabel}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
