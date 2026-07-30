"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/features/user/hooks/useProfile";
import { useOrganization, useUpdateOrganization } from "@/features/organization/hooks/useOrganization";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/auth/schema";
import { TwoFactorSection } from "@/features/auth/components/TwoFactorSection";
import { KycVerificationSection } from "@/features/kyc/components/KycVerificationSection";
import type { UpdateOrganizationPayload } from "@/features/organization/types";

export default function SettingsPage() {
	const { user } = useAuth();
	const isOwner = user?.roles?.includes("OWNER");

	const updateProfile = useUpdateProfile();
	const { data: organization } = useOrganization();
	const updateOrganization = useUpdateOrganization();
	const changePassword = useChangePassword();

	const profileForm = useForm({ defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" } });
	const orgForm = useForm<UpdateOrganizationPayload>({ defaultValues: { name: "", handle: "", email: "", phone: "", address: "" } });
	const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

	useEffect(() => {
		if (organization)
			orgForm.reset({
				name: organization.name,
				handle: organization.handle ?? "",
				email: organization.email ?? "",
				phone: organization.phone ?? "",
				address: organization.address ?? "",
			});
	}, [organization]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="max-w-2xl space-y-8">
			<PageHeader
				title="Settings"
				description="Manage your profile, organization and security."
			/>

			<section className="rounded-xl border border-slate-200 bg-white p-6">
				<h2 className="mb-4 text-sm font-semibold text-slate-700">
					Your profile
				</h2>
				<form
					onSubmit={profileForm.handleSubmit(values =>
						updateProfile.mutate(values),
					)}
					className="space-y-4">
					<TextField
						id="profile-name"
						label="Name"
						{...profileForm.register("name")}
					/>
					<TextField
						id="profile-phone"
						label="Phone"
						{...profileForm.register("phone")}
					/>
					<Button type="submit" isLoading={updateProfile.isPending}>
						Save profile
					</Button>
				</form>
			</section>

			<section className="rounded-xl border border-slate-200 bg-white p-6">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-sm font-semibold text-slate-700">Organization</h2>
					{!isOwner && (
						<span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
							<Lock className="h-3 w-3" />
							Owner only
						</span>
					)}
				</div>

				{!isOwner && (
					<p className="mb-4 -mt-2 text-sm text-slate-500">
						Only the organization owner can update these details. Ask your owner
						if something needs to change.
					</p>
				)}

				<fieldset disabled={!isOwner} className="space-y-4 disabled:opacity-60">
					<form
						onSubmit={orgForm.handleSubmit(values =>
							updateOrganization.mutate(values),
						)}
						className="space-y-4">
						<TextField
							id="org-name"
							label="Business name"
							{...orgForm.register("name")}
						/>
						<TextField
							id="org-handle"
							label="Handle (public URL)"
							hint="Use letters, numbers, and hyphens only. This creates your organization's unique URL. Owners and staff will use it to access the workspace, for example: posvora.com/your-business/dashboard."
							placeholder="your-business"
							{...orgForm.register("handle")}
						/>
						<TextField
							id="org-email"
							label="Email"
							type="email"
							{...orgForm.register("email")}
						/>
						<TextField
							id="org-phone"
							label="Phone"
							{...orgForm.register("phone")}
						/>
						<TextField
							id="org-address"
							label="Address"
							{...orgForm.register("address")}
						/>
						{isOwner && (
							<Button type="submit" isLoading={updateOrganization.isPending}>
								Save organization
							</Button>
						)}
					</form>
				</fieldset>
			</section>

			<KycVerificationSection />

			<section className="rounded-xl border border-slate-200 bg-white p-6">
				<h2 className="mb-4 text-sm font-semibold text-slate-700">
					Change password
				</h2>
				<form
					onSubmit={passwordForm.handleSubmit(values =>
						changePassword.mutate(
							{
								oldPassword: values.oldPassword,
								newPassword: values.newPassword,
							},
							{ onSuccess: () => passwordForm.reset() },
						),
					)}
					className="space-y-4">
					<TextField
						id="current-password"
						label="Current password"
						type="password"
						error={passwordForm.formState.errors.oldPassword?.message}
						{...passwordForm.register("oldPassword")}
					/>
					<TextField
						id="new-password"
						label="New password"
						type="password"
						error={passwordForm.formState.errors.newPassword?.message}
						{...passwordForm.register("newPassword")}
					/>
					<TextField
						id="confirm-password"
						label="Confirm new password"
						type="password"
						error={passwordForm.formState.errors.confirmPassword?.message}
						{...passwordForm.register("confirmPassword")}
					/>
					<Button type="submit" isLoading={changePassword.isPending}>
						Update password
					</Button>
				</form>
			</section>

			<TwoFactorSection />
		</div>
	);
}
