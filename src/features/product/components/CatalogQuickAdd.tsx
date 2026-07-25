"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateCategory, useCreateBrand, useCreateUnit } from "../hooks/useCatalog";

type Kind = "category" | "brand" | "unit";

export function CatalogQuickAdd({ shopId, kind, label }: { shopId: string; kind: Kind; label: string }) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [shortName, setShortName] = useState("");

	const createCategory = useCreateCategory();
	const createBrand = useCreateBrand();
	const createUnit = useCreateUnit();

	const isPending = createCategory.isPending || createBrand.isPending || createUnit.isPending;

	const handleSubmit = () => {
		const onSuccess = () => {
			setOpen(false);
			setName("");
			setShortName("");
		};
		if (kind === "category") createCategory.mutate({ shopId, name }, { onSuccess });
		if (kind === "brand") createBrand.mutate({ shopId, name }, { onSuccess });
		if (kind === "unit") createUnit.mutate({ shopId, name, shortName }, { onSuccess });
	};

	return (
		<>
			<Button variant="outline" size="sm" onClick={() => setOpen(true)}>
				<Plus className="h-4 w-4" /> {label}
			</Button>
			<Modal open={open} onClose={() => setOpen(false)} title={label} size="sm">
				<div className="space-y-4">
					<FormField label="Name" required>
						<Input value={name} onChange={e => setName(e.target.value)} />
					</FormField>
					{kind === "unit" && (
						<FormField label="Short name" required>
							<Input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="e.g. pcs, kg" />
						</FormField>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} isLoading={isPending} disabled={!name || (kind === "unit" && !shortName)}>
							Save
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
