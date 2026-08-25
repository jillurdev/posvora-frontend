"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, TextareaField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import {
	useAdminCreatePlan,
	useAdminPlans,
	useAdminTogglePlan,
	useAdminUpdatePlan,
} from "@/features/platform-staff/hooks/useSuperAdmin";
import type { CreatePlanPayload, Plan } from "@/features/platform-staff/types";

function formatPrice(price: string | number) {
	const n = typeof price === "string" ? Number(price) : price;
	return `৳${n.toLocaleString()}`;
}

const emptyForm: CreatePlanPayload = {
	name: "",
	slug: "",
	description: "",
	price: 0,
	priceUsd: undefined,
	billingCycle: "MONTHLY",
	trialDays: 14,
	branchLimit: 1,
	userLimit: 5,
	storageLimitMb: 1024,
	apiLimitPerDay: 1000,
	isPublic: true,
};

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export default function PlansPage() {
	const { data: plans, isLoading } = useAdminPlans();
	const createPlan = useAdminCreatePlan();
	const togglePlan = useAdminTogglePlan();

	const [modalOpen, setModalOpen] = useState(false);
	const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
	const [form, setForm] = useState<CreatePlanPayload>(emptyForm);

	// Separate hook instance is fine here since only one edit modal is open at a time.
	const updatePlan = useAdminUpdatePlan(editingPlan?.id ?? "");

	const openCreateModal = () => {
		setEditingPlan(null);
		setForm(emptyForm);
		setModalOpen(true);
	};

	const openEditModal = (plan: Plan) => {
		setEditingPlan(plan);
		setForm({
			name: plan.name,
			slug: plan.slug,
			description: plan.description ?? "",
			price: Number(plan.price),
			priceUsd: plan.priceUsd != null ? Number(plan.priceUsd) : undefined,
			billingCycle: plan.billingCycle,
			trialDays: plan.trialDays,
			branchLimit: plan.branchLimit,
			userLimit: plan.userLimit,
			storageLimitMb: plan.storageLimitMb,
			apiLimitPerDay: plan.apiLimitPerDay,
			isPublic: plan.isPublic,
		});
		setModalOpen(true);
	};

	const handleNameChange = (name: string) => {
		setForm(f => ({ ...f, name, slug: editingPlan ? f.slug : slugify(name) }));
	};

	const handleSubmit = () => {
		if (editingPlan) {
			updatePlan.mutate(form, { onSuccess: () => setModalOpen(false) });
		} else {
			createPlan.mutate(form, { onSuccess: () => setModalOpen(false) });
		}
	};

	const isSaving = editingPlan ? updatePlan.isPending : createPlan.isPending;

	const columns: Column<Plan>[] = [
		{ header: "Plan", accessor: p => <span className="font-medium text-slate-900">{p.name}</span> },
		{
			header: "Price",
			accessor: p =>
				`${formatPrice(p.price)} / ${p.billingCycle.toLowerCase()}${p.priceUsd != null ? ` · $${Number(p.priceUsd).toLocaleString()} intl.` : ""}`,
		},
		{ header: "Limits", accessor: p => `${p.branchLimit} branches · ${p.userLimit} staff accounts` },
		{ header: "Subscribers", accessor: p => p._count?.subscriptions ?? 0 },
		{
			header: "Visibility",
			accessor: p => (p.isPublic ? <Badge tone="info">Public</Badge> : <Badge>Hidden</Badge>),
		},
		{
			header: "Status",
			accessor: p => (p.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Inactive</Badge>),
		},
		{
			header: "",
			accessor: p => (
				<div className="flex justify-end gap-2">
					<Button variant="outline" size="sm" onClick={() => openEditModal(p)}>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						isLoading={togglePlan.isPending}
						onClick={() => togglePlan.mutate({ id: p.id, isActive: !p.isActive })}>
						{p.isActive ? "Deactivate" : "Activate"}
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<PageHeader
				title="Plans"
				description="Pricing plans available to organizations."
				action={
					<Button onClick={openCreateModal}>
						<Plus className="mr-1.5 h-4 w-4" /> New plan
					</Button>
				}
			/>

			<DataTable columns={columns} data={plans ?? []} isLoading={isLoading} rowKey={p => p.id} emptyTitle="No plans created yet" />

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPlan ? "Edit plan" : "Create plan"}>
				<div className="space-y-4">
					<TextField id="plan-name" label="Plan name" required value={form.name} onChange={e => handleNameChange(e.target.value)} />
					<TextField
						id="plan-slug"
						label="Slug"
						required
						hint="Used internally as a unique identifier"
						value={form.slug}
						onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
					/>
					<TextareaField
						id="plan-description"
						label="Description"
						rows={2}
						value={form.description}
						onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
					/>
					<div className="grid grid-cols-2 gap-4">
						<TextField
							id="plan-price"
							label="Price (৳ BDT — Bangladesh)"
							required
							type="number"
							min={0}
							value={form.price}
							onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
						/>
						<TextField
							id="plan-price-usd"
							label="Price ($ USD — international, optional)"
							type="number"
							min={0}
							hint="Leave blank to keep this plan Bangladesh-only for now."
							value={form.priceUsd ?? ""}
							onChange={e => setForm(f => ({ ...f, priceUsd: e.target.value === "" ? undefined : Number(e.target.value) }))}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<SelectField
							id="plan-billing-cycle"
							label="Billing cycle"
							required
							value={form.billingCycle}
							onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value as CreatePlanPayload["billingCycle"] }))}>
							<option value="MONTHLY">Monthly</option>
							<option value="YEARLY">Yearly</option>
						</SelectField>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<TextField
							id="plan-trial-days"
							label="Trial days"
							type="number"
							min={0}
							value={form.trialDays}
							onChange={e => setForm(f => ({ ...f, trialDays: Number(e.target.value) }))}
						/>
						<TextField
							id="plan-branch-limit"
							label="Branch limit"
							type="number"
							min={1}
							value={form.branchLimit}
							onChange={e => setForm(f => ({ ...f, branchLimit: Number(e.target.value) }))}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<TextField
							id="plan-user-limit"
							label="Staff account limit"
							type="number"
							min={1}
							value={form.userLimit}
							onChange={e => setForm(f => ({ ...f, userLimit: Number(e.target.value) }))}
						/>
						<TextField
							id="plan-storage-limit"
							label="Storage limit (MB)"
							type="number"
							min={1}
							value={form.storageLimitMb}
							onChange={e => setForm(f => ({ ...f, storageLimitMb: Number(e.target.value) }))}
						/>
					</div>
					<TextField
						id="plan-api-limit"
						label="API calls / day"
						type="number"
						min={1}
						value={form.apiLimitPerDay}
						onChange={e => setForm(f => ({ ...f, apiLimitPerDay: Number(e.target.value) }))}
					/>
					<label className="flex items-center gap-2 text-sm text-slate-700">
						<input
							type="checkbox"
							checked={form.isPublic}
							onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
							className="h-4 w-4 rounded border-slate-300"
						/>
						Publicly visible on the pricing page
					</label>

					<Button className="w-full" isLoading={isSaving} onClick={handleSubmit}>
						{editingPlan ? "Save changes" : "Create plan"}
					</Button>
				</div>
			</Modal>
		</div>
	);
}
