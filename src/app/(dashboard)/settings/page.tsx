"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/common/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/features/user/hooks/useProfile";
import { useOrganization, useUpdateOrganization } from "@/features/organization/hooks/useOrganization";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/auth/schema";

export default function SettingsPage() {
	const { user } = useAuth();
	const updateProfile = useUpdateProfile();
	const { data: organization } = useOrganization();
	const updateOrganization = useUpdateOrganization();
	const changePassword = useChangePassword();

	const profileForm = useForm({ defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" } });
	const orgForm = useForm({ defaultValues: { name: "", email: "", phone: "", address: "" } });
	const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

	useEffect(() => {
		if (organization) orgForm.reset({ name: organization.name, email: organization.email ?? "", phone: organization.phone ?? "", address: organization.address ?? "" });
	}, [organization]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="max-w-2xl space-y-8">
			<PageHeader title="Settings" description="Manage your profile, organization and security." />

			<section className="rounded-xl border border-slate-200 bg-white p-6">
				<h2 className="mb-4 text-sm font-semibold text-slate-700">Your profile</h2>
				<form
					onSubmit={profileForm.handleSubmit(values => updateProfile.mutate(values))}
					className="space-y-4"
				>
					<FormField label="Name">
						<Input {...profileForm.register("name")} />
					</FormField>
					<FormField label="Phone">
						<Input {...profileForm.register("phone")} />
					</FormField>
					<Button type="submit" isLoading={updateProfile.isPending}>Save profile</Button>
				</form>
			</section>

			<section className="rounded-xl border border-slate-200 bg-white p-6">
				<h2 className="mb-4 text-sm font-semibold text-slate-700">Organization</h2>
				<form
					onSubmit={orgForm.handleSubmit(values => updateOrganization.mutate(values))}
					className="space-y-4"
				>
					<FormField label="Business name">
						<Input {...orgForm.register("name")} />
					</FormField>
					<FormField label="Email">
						<Input type="email" {...orgForm.register("email")} />
					</FormField>
					<FormField label="Phone">
						<Input {...orgForm.register("phone")} />
					</FormField>
					<FormField label="Address">
						<Input {...orgForm.register("address")} />
					</FormField>
					<Button type="submit" isLoading={updateOrganization.isPending}>Save organization</Button>
				</form>
			</section>

			<section className="rounded-xl border border-slate-200 bg-white p-6">
				<h2 className="mb-4 text-sm font-semibold text-slate-700">Change password</h2>
				<form
					onSubmit={passwordForm.handleSubmit(values =>
						changePassword.mutate(
							{ oldPassword: values.oldPassword, newPassword: values.newPassword },
							{ onSuccess: () => passwordForm.reset() },
						),
					)}
					className="space-y-4"
				>
					<FormField label="Current password" error={passwordForm.formState.errors.oldPassword?.message}>
						<Input type="password" {...passwordForm.register("oldPassword")} />
					</FormField>
					<FormField label="New password" error={passwordForm.formState.errors.newPassword?.message}>
						<Input type="password" {...passwordForm.register("newPassword")} />
					</FormField>
					<FormField label="Confirm new password" error={passwordForm.formState.errors.confirmPassword?.message}>
						<Input type="password" {...passwordForm.register("confirmPassword")} />
					</FormField>
					<Button type="submit" isLoading={changePassword.isPending}>Update password</Button>
				</form>
			</section>
		</div>
	);
}
