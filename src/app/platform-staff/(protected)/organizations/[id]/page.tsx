"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone, Store, Warehouse } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useConfirm } from "@/context/ConfirmDialogContext";
import {
	useAdminAssignSubscription,
	useAdminOrganization,
	useAdminPlans,
	useAdminToggleOrganization,
} from "@/features/platform-staff/hooks/useSuperAdmin";
import { formatDate } from "@/lib/utils";

function formatPrice(price: string | number) {
	const n = typeof price === "string" ? Number(price) : price;
	return `৳${n.toLocaleString()}`;
}

export default function OrganizationDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { data: org, isLoading } = useAdminOrganization(params.id);
	const { data: plans } = useAdminPlans();
	const toggleOrg = useAdminToggleOrganization();
	const assignSubscription = useAdminAssignSubscription(params.id);
	const confirm = useConfirm();

	const [planModalOpen, setPlanModalOpen] = useState(false);
	const [selectedPlanId, setSelectedPlanId] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELLED" | "EXPIRED">("ACTIVE");
	const [customEndDate, setCustomEndDate] = useState("");

	if (isLoading) {
		return (
			<div className="flex justify-center py-16">
				<Spinner />
			</div>
		);
	}

	if (!org) return null;

	const onToggle = async () => {
		const suspending = org.isActive;
		const result = await confirm({
			title: suspending ? "Suspend this organization?" : "Reactivate this organization?",
			description: suspending
				? `"${org.name}" and its staff will immediately lose access to Posvora until reactivated.`
				: `"${org.name}" will regain access to Posvora.`,
			confirmLabel: suspending ? "Suspend" : "Reactivate",
			variant: suspending ? "danger" : "primary",
		});
		if (result) toggleOrg.mutate({ id: org.id, isActive: !org.isActive });
	};

	const openPlanModal = () => {
		setSelectedPlanId(org.subscription?.plan?.id ?? plans?.[0]?.id ?? "");
		setSelectedStatus("ACTIVE");
		setCustomEndDate("");
		setPlanModalOpen(true);
	};

	const handleAssignPlan = () => {
		if (!selectedPlanId) return;
		assignSubscription.mutate(
			{
				planId: selectedPlanId,
				status: selectedStatus,
				// Only sent when the operator explicitly overrides it — otherwise
				// the backend computes the period end from the plan's billing cycle.
				...(customEndDate ? { currentEnd: new Date(customEndDate).toISOString() } : {}),
			},
			{ onSuccess: () => setPlanModalOpen(false) },
		);
	};

	return (
		<div>
			<button
				onClick={() => router.push("/platform-staff/organizations")}
				className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
				<ArrowLeft className="h-4 w-4" /> Back to organizations
			</button>

			<PageHeader
				title={org.name}
				description={`Business type: ${org.businessType}`}
				action={
					<div className="flex gap-2">
						<Button
							variant="outline"
							isLoading={toggleOrg.isPending}
							onClick={onToggle}>
							{org.isActive ? "Suspend organization" : "Reactivate organization"}
						</Button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Overview */}
				<div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
					<h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Building2 className="h-4 w-4 text-slate-400" /> Overview
					</h3>
					<dl className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<dt className="text-slate-500">Status</dt>
							<dd className="mt-1">{org.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Suspended</Badge>}</dd>
						</div>
						<div>
							<dt className="text-slate-500">Created</dt>
							<dd className="mt-1 text-slate-900">{formatDate(org.createdAt)}</dd>
						</div>
						<div>
							<dt className="text-slate-500">Owner</dt>
							<dd className="mt-1 text-slate-900">{org.owner?.name ?? "—"}</dd>
						</div>
						<div>
							<dt className="text-slate-500">Owner contact</dt>
							<dd className="mt-1 flex flex-col gap-1 text-slate-900">
								{org.owner?.email && (
									<span className="flex items-center gap-1">
										<Mail className="h-3.5 w-3.5 text-slate-400" /> {org.owner.email}
									</span>
								)}
								{org.owner?.phone && (
									<span className="flex items-center gap-1">
										<Phone className="h-3.5 w-3.5 text-slate-400" /> {org.owner.phone}
									</span>
								)}
							</dd>
						</div>
						<div>
							<dt className="text-slate-500">Team members</dt>
							<dd className="mt-1 text-slate-900">{org._count?.users ?? "—"}</dd>
						</div>
						<div>
							<dt className="text-slate-500">Support tickets</dt>
							<dd className="mt-1 text-slate-900">{org._count?.supportTickets ?? "—"}</dd>
						</div>
					</dl>

					<h3 className="mb-3 mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Store className="h-4 w-4 text-slate-400" /> Shops
					</h3>
					{org.shops && org.shops.length > 0 ? (
						<ul className="divide-y divide-slate-100 rounded-lg border border-slate-100">
							{org.shops.map(shop => (
								<li key={shop.id} className="px-4 py-2.5 text-sm">
									<div className="flex items-center justify-between">
										<span className="font-medium text-slate-900">{shop.name}</span>
										{shop.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Inactive</Badge>}
									</div>
									{shop.branches && shop.branches.length > 0 ? (
										<ul className="mt-2 space-y-1.5 border-l border-slate-100 pl-3">
											{shop.branches.map(branch => (
												<li key={branch.id} className="text-xs text-slate-600">
													<div className="flex items-center justify-between">
														<span>
															{branch.name}
															{branch.code ? ` (${branch.code})` : ""}
															{branch.isMain ? " · Main" : ""}
														</span>
														{branch.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Inactive</Badge>}
													</div>
													{branch.warehouses && branch.warehouses.length > 0 ? (
														<ul className="mt-1 space-y-0.5 border-l border-slate-100 pl-3">
															{branch.warehouses.map(warehouse => (
																<li key={warehouse.id} className="flex items-center justify-between text-xs text-slate-500">
																	<span className="flex items-center gap-1">
																		<Warehouse className="h-3 w-3 text-slate-400" />
																		{warehouse.name}
																		{warehouse.isDefault ? " · Default" : ""}
																	</span>
																	{warehouse.isActive ? (
																		<Badge tone="success">Active</Badge>
																	) : (
																		<Badge tone="danger">Inactive</Badge>
																	)}
																</li>
															))}
														</ul>
													) : (
														<p className="mt-1 pl-3 text-xs text-slate-400">No warehouses yet.</p>
													)}
												</li>
											))}
										</ul>
									) : (
										<p className="mt-1 pl-3 text-xs text-slate-400">No branches yet.</p>
									)}
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-slate-400">No shops created yet.</p>
					)}
				</div>

				{/* Subscription */}
				<div className="rounded-xl border border-slate-200 bg-white p-5">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-sm font-semibold text-slate-900">Subscription</h3>
						<Button variant="outline" size="sm" onClick={openPlanModal}>
							{org.subscription ? "Change plan" : "Assign plan"}
						</Button>
					</div>

					{org.subscription ? (
						<dl className="space-y-3 text-sm">
							<div>
								<dt className="text-slate-500">Plan</dt>
								<dd className="mt-1 font-medium text-slate-900">{org.subscription.plan.name}</dd>
							</div>
							<div>
								<dt className="text-slate-500">Price</dt>
								<dd className="mt-1 text-slate-900">
									{formatPrice(org.subscription.plan.price)} / {org.subscription.plan.billingCycle.toLowerCase()}
								</dd>
							</div>
							<div>
								<dt className="text-slate-500">Status</dt>
								<dd className="mt-1">
									<Badge tone={org.subscription.status === "ACTIVE" ? "success" : org.subscription.status === "TRIALING" ? "info" : "warning"}>
										{org.subscription.status}
									</Badge>
								</dd>
							</div>
							{org.subscription.currentEnd && (
								<div>
									<dt className="text-slate-500">Renews / ends</dt>
									<dd className="mt-1 text-slate-900">{formatDate(org.subscription.currentEnd)}</dd>
								</div>
							)}
						</dl>
					) : (
						<p className="text-sm text-slate-400">No subscription assigned yet.</p>
					)}
				</div>
			</div>

			<Modal open={planModalOpen} onClose={() => setPlanModalOpen(false)} title="Assign subscription plan">
				<div className="space-y-4">
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700">Plan</label>
						<Select value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)}>
							{plans?.map(plan => (
								<option key={plan.id} value={plan.id}>
									{plan.name} — {formatPrice(plan.price)}/{plan.billingCycle.toLowerCase()}
								</option>
							))}
						</Select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
						<Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as typeof selectedStatus)}>
							<option value="ACTIVE">Active</option>
							<option value="TRIALING">Trialing</option>
							<option value="PAST_DUE">Past due</option>
							<option value="CANCELLED">Cancelled</option>
							<option value="EXPIRED">Expired</option>
						</Select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700">
							Custom period end date <span className="font-normal text-slate-400">(optional)</span>
						</label>
						<Input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} />
						<p className="mt-1 text-xs text-slate-400">
							Leave blank to let the plan&apos;s billing cycle decide when this subscription renews. Set this to grant a
							manual extension or backdate a period end.
						</p>
					</div>
					<Button className="w-full" isLoading={assignSubscription.isPending} onClick={handleAssignPlan}>
						Save subscription
					</Button>
				</div>
			</Modal>
		</div>
	);
}
