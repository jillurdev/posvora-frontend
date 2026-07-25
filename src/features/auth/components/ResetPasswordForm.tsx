"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { resetPasswordSchema, ResetPasswordFormValues } from "../schema";
import { useResetPassword } from "../hooks/useResetPassword";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";
	const { mutate, isPending } = useResetPassword();
	const [done, setDone] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

	const onSubmit = (values: ResetPasswordFormValues) => {
		mutate(
			{ token, newPassword: values.newPassword },
			{ onSuccess: () => setDone(true) },
		);
	};

	if (!token) {
		return (
			<div className="w-full max-w-sm text-center">
				<h1 className="text-2xl font-semibold text-slate-900">Invalid link</h1>
				<p className="mt-2 text-sm text-slate-500">
					This password reset link is missing its token. Please request a new one.
				</p>
				<Link href="/forgot-password" className="mt-6 inline-block text-sm font-medium text-slate-900 hover:underline">
					Request a new link
				</Link>
			</div>
		);
	}

	if (done) {
		return (
			<div className="w-full max-w-sm text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
					<CheckCircle2 className="h-6 w-6 text-slate-600" />
				</div>
				<h1 className="mt-4 text-2xl font-semibold text-slate-900">Password reset</h1>
				<p className="mt-2 text-sm text-slate-500">
					Your password has been changed successfully. All of your previous sessions have been signed out.
				</p>
				<Button className="mt-6 w-full" onClick={() => router.replace("/login")}>
					Sign in
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>
			<p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
				<FormField label="New password" error={errors.newPassword?.message} required>
					<Input type="password" placeholder="••••••••" {...register("newPassword")} />
				</FormField>
				<FormField label="Confirm new password" error={errors.confirmPassword?.message} required>
					<Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
				</FormField>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Reset password
				</Button>
			</form>
		</div>
	);
}
