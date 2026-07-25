"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "../schema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
	const { mutate, isPending } = useForgotPassword();
	const [submitted, setSubmitted] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

	const onSubmit = (values: ForgotPasswordFormValues) => {
		mutate(values, { onSuccess: () => setSubmitted(true) });
	};

	if (submitted) {
		return (
			<div className="w-full max-w-sm text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
					<MailCheck className="h-6 w-6 text-slate-600" />
				</div>
				<h1 className="mt-4 text-2xl font-semibold text-slate-900">Check your email</h1>
				<p className="mt-2 text-sm text-slate-500">
					If an account exists with that email, we&apos;ve sent a link to reset your password. The link expires in 15
					minutes.
				</p>
				<Link href="/login" className="mt-6 inline-block text-sm font-medium text-slate-900 hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full max-w-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Forgot password?</h1>
			<p className="mt-1 text-sm text-slate-500">
				Enter the email associated with your account and we&apos;ll send you a link to reset your password.
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
				<FormField label="Email" error={errors.email?.message} required>
					<Input type="email" placeholder="you@company.com" {...register("email")} />
				</FormField>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Send reset link
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-500">
				Remembered your password?{" "}
				<Link href="/login" className="font-medium text-slate-900 hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	);
}
