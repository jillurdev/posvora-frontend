"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateStaff } from "@/features/super-admin/hooks/useSuperAdmin";

export function CreateStaffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const { mutate, isPending } = useCreateStaff();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate(
			{ name, email, phone: phone || undefined, password },
			{
				onSuccess: () => {
					setName("");
					setEmail("");
					setPhone("");
					setPassword("");
					onClose();
				},
			},
		);
	};

	return (
		<Modal open={open} onClose={onClose} title="Add platform staff">
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormField label="Name" required>
					<Input value={name} onChange={e => setName(e.target.value)} required />
				</FormField>
				<FormField label="Email" required>
					<Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
				</FormField>
				<FormField label="Phone">
					<Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" />
				</FormField>
				<FormField label="Temporary password" required hint="They can change this after signing in.">
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
						Create account
					</Button>
				</div>
			</form>
		</Modal>
	);
}
