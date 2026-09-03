"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/common/PageHeader";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminUpdateProfile, useAdminChangePassword } from "@/features/admin-auth/hooks/useAdminAuth";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/auth/schema";
import { formatDateTime } from "@/lib/utils";

interface ProfileFormValues {
	name: string;
	phone: string;
}

const roleTone: Record<string, "success" | "info" | "default"> = {
	OWNER: "success",
	ADMIN: "info",
	SUPPORT: "default",
};

export default function PlatformStaffSettingsPage() {
	const { admin } = useAdminAuth();
	const updateProfile = useAdminUpdateProfile();
	const changePassword = useAdminChangePassword();

	const profileForm = useForm<ProfileFormValues>({ defaultValues: { name: "", phone: "" } });
	const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

	useEffect(() => {
		if (admin) profileForm.reset({ name: admin.name, phone: admin.phone ?? "" });
	}, [admin]); // eslint-disable-line react-hooks/exhaustive-deps -- profileForm identity churns every render; only re-seed when the fetched admin itself changes.

	return (
		<div>
			<PageHeader title="Settings" description="Your platform-admin account." />

			<Tabs defaultValue="profile">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<section className="rounded-xl border border-slate-200 bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-sm font-semibold text-slate-700">Your profile</h2>
							{admin && <Badge tone={roleTone[admin.role] ?? "default"}>{admin.role}</Badge>}
						</div>
						<form
							onSubmit={profileForm.handleSubmit(values => updateProfile.mutate(values))}
							className="space-y-4"
						>
							<TextField
								id="admin-email"
								label="Email"
								type="email"
								value={admin?.email ?? ""}
								disabled
								hint="This is your login email — it can't be changed here. Contact the platform owner if it needs to change."
							/>
							<TextField id="admin-name" label="Name" {...profileForm.register("name")} />
							<TextField id="admin-phone" label="Phone" {...profileForm.register("phone")} />
							<Button type="submit" isLoading={updateProfile.isPending}>Save profile</Button>
						</form>
						{admin?.lastLoginAt && (
							<p className="mt-4 text-xs text-slate-400">Last login: {formatDateTime(admin.lastLoginAt)}</p>
						)}
					</section>
				</TabsContent>

				<TabsContent value="security">
					<section className="rounded-xl border border-slate-200 bg-white p-6">
						<h2 className="mb-4 text-sm font-semibold text-slate-700">Change password</h2>
						<form
							onSubmit={passwordForm.handleSubmit(values =>
								changePassword.mutate(
									{ currentPassword: values.oldPassword, newPassword: values.newPassword },
									{ onSuccess: () => passwordForm.reset() },
								),
							)}
							className="space-y-4"
						>
							<TextField
								id="admin-current-password"
								label="Current password"
								type="password"
								error={passwordForm.formState.errors.oldPassword?.message}
								{...passwordForm.register("oldPassword")}
							/>
							<TextField
								id="admin-new-password"
								label="New password"
								type="password"
								error={passwordForm.formState.errors.newPassword?.message}
								{...passwordForm.register("newPassword")}
							/>
							<TextField
								id="admin-confirm-password"
								label="Confirm new password"
								type="password"
								error={passwordForm.formState.errors.confirmPassword?.message}
								{...passwordForm.register("confirmPassword")}
							/>
							<Button type="submit" isLoading={changePassword.isPending}>Update password</Button>
						</form>
					</section>
				</TabsContent>
			</Tabs>
		</div>
	);
}
