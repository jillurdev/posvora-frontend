"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useResetStaffPassword } from "@/features/super-admin/hooks/useSuperAdmin";

export function ResetStaffPasswordModal({
	staffId,
	staffName,
	onClose,
}: {
	staffId: string | null;
	staffName?: string;
	onClose: () => void;
}) {
	const [password, setPassword] = useState("");
	const { mutate, isPending } = useResetStaffPassword();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!staffId) return;
		mutate(
			{ id: staffId, newPassword: password },
			{ onSuccess: () => { setPassword(""); onClose(); } },
		);
	};

	return (
		<Modal open={!!staffId} onClose={onClose} title={`Reset password${staffName ? ` — ${staffName}` : ""}`}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormField label="New password" required hint="Share this with them securely — it won't be shown again.">
					<Input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						minLength={8}
					/>
				</FormField>
				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" isLoading={isPending}>
						Reset password
					</Button>
				</div>
			</form>
		</Modal>
	);
}
