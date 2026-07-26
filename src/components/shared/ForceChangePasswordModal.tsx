"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/auth/schema";

/**
 * Rendered instead of the dashboard whenever user.mustChangePassword is
 * true (set on the backend when an owner/manager creates an employee
 * account with a temporary password). There's no "close" or "skip" —
 * the backend also rejects every other request until this is done, so
 * this modal simply mirrors that requirement in the UI.
 */
export function ForceChangePasswordModal() {
	const { user, setUser } = useAuth();
	const changePassword = useChangePassword();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

	const onSubmit = (values: ChangePasswordFormValues) => {
		changePassword.mutate(
			{ oldPassword: values.oldPassword, newPassword: values.newPassword },
			{
				onSuccess: () => {
					if (user) setUser({ ...user, mustChangePassword: false });
				},
			},
		);
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
						<ShieldAlert className="h-5 w-5 text-amber-600" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-slate-900">Set a new password</h2>
						<p className="text-sm text-slate-500">
							Your account was created with a temporary password. Set your own before continuing.
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormField label="Temporary password" error={errors.oldPassword?.message}>
						<Input type="password" autoComplete="current-password" {...register("oldPassword")} />
					</FormField>
					<FormField label="New password" error={errors.newPassword?.message}>
						<Input type="password" autoComplete="new-password" {...register("newPassword")} />
					</FormField>
					<FormField label="Confirm new password" error={errors.confirmPassword?.message}>
						<Input type="password" autoComplete="new-password" {...register("confirmPassword")} />
					</FormField>

					<Button type="submit" isLoading={changePassword.isPending} className="w-full">
						Set password &amp; continue
					</Button>
				</form>
			</div>
		</div>
	);
}
