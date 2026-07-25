"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateSupportTicket } from "../hooks/useSupportTickets";
import type { SupportTicketPriority } from "../types";

export function CreateTicketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<SupportTicketPriority>("MEDIUM");
	const { mutate, isPending } = useCreateSupportTicket();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate(
			{ subject, description, priority },
			{
				onSuccess: () => {
					setSubject("");
					setDescription("");
					setPriority("MEDIUM");
					onClose();
				},
			},
		);
	};

	return (
		<Modal open={open} onClose={onClose} title="New support ticket">
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormField label="Subject" required>
					<Input
						value={subject}
						onChange={e => setSubject(e.target.value)}
						placeholder="Briefly describe the issue"
						required
					/>
				</FormField>
				<FormField label="Priority">
					<Select value={priority} onChange={e => setPriority(e.target.value as SupportTicketPriority)}>
						<option value="LOW">Low</option>
						<option value="MEDIUM">Medium</option>
						<option value="HIGH">High</option>
						<option value="URGENT">Urgent</option>
					</Select>
				</FormField>
				<FormField label="Description" required>
					<Textarea
						rows={5}
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder="Give as much detail as you can..."
						required
					/>
				</FormField>
				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" isLoading={isPending}>
						Submit ticket
					</Button>
				</div>
			</form>
		</Modal>
	);
}
