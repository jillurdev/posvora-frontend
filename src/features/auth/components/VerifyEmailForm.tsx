"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema, VerifyEmailFormValues } from "../schema";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendOtp } from "../hooks/useResendOtp";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const emailFromQuery = searchParams.get("email") ?? "";

	const { mutate: verify, isPending } = useVerifyEmail();
	const { mutate: resend, isPending: isResending } = useResendOtp();
	const [cooldown, setCooldown] = useState(0);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<VerifyEmailFormValues>({
		resolver: zodResolver(verifyEmailSchema),
		defaultValues: { email: emailFromQuery, code: "" },
	});

	useEffect(() => {
		if (emailFromQuery) setValue("email", emailFromQuery);
	}, [emailFromQuery, setValue]);

	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
		return () => clearInterval(timer);
	}, [cooldown]);

	const onSubmit = (values: VerifyEmailFormValues) => {
		verify(values, {
			onSuccess: result => router.replace(`/${result.organization?.handle ?? ""}/dashboard`),
		});
	};

	const onResend = () => {
		const email = emailFromQuery;
		if (!email || cooldown > 0) return;
		resend({ email });
		setCooldown(RESEND_COOLDOWN_SECONDS);
	};

	return (
		<div className="w-full max-w-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Verify your email</h1>
			<p className="mt-1 text-sm text-slate-500">
				We&apos;ve sent a 6-digit code to <span className="font-medium">{emailFromQuery || "your email"}</span>.
				Enter it below to activate your account.
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
				<input type="hidden" {...register("email")} />
				<FormField label="Verification code" error={errors.code?.message} required>
					<Input
						inputMode="numeric"
						maxLength={6}
						placeholder="123456"
						autoFocus
						{...register("code")}
					/>
				</FormField>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Verify & continue
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-500">
				Didn&apos;t get the code?{" "}
				<button
					type="button"
					onClick={onResend}
					disabled={isResending || cooldown > 0}
					className="font-medium text-slate-900 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
				>
					{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
				</button>
			</p>
		</div>
	);
}
