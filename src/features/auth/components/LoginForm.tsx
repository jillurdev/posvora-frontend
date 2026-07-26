"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schema";
import { useLogin } from "../hooks/useLogin";
import { useVerifyTwoFactor } from "../hooks/useVerifyTwoFactor";
import { isTwoFactorChallenge } from "../types";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
	const router = useRouter();
	const { mutate, isPending } = useLogin();
	const verifyTwoFactor = useVerifyTwoFactor();

	const [challengeToken, setChallengeToken] = useState<string | null>(null);
	const [code, setCode] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

	const onSubmit = (values: LoginFormValues) => {
		mutate(
			{
				identifier: values.email,
				password: values.password,
			},
			{
				onSuccess: result => {
					if (isTwoFactorChallenge(result)) {
						setChallengeToken(result.challengeToken);
						return;
					}
					router.replace(`/${result.user.organization?.handle ?? ""}/dashboard`);
				},
			},
		);
	};

	const onVerify = () => {
		if (!challengeToken) return;
		verifyTwoFactor.mutate(
			{ challengeToken, code },
			{ onSuccess: result => router.replace(`/${result.user.organization?.handle ?? ""}/dashboard`) },
		);
	};

	if (challengeToken) {
		return (
			<div className="w-full max-w-sm">
				<h1 className="text-2xl font-semibold text-slate-900">Enter your code</h1>
				<p className="mt-1 text-sm text-slate-500">
					Open your authenticator app and enter the 6-digit code, or use one of your recovery
					codes.
				</p>

				<div className="mt-8 space-y-4">
					<FormField label="Authentication code" required>
						<Input
							autoFocus
							inputMode="numeric"
							placeholder="123456 or XXXXX-XXXXX"
							value={code}
							onChange={e => setCode(e.target.value)}
							onKeyDown={e => e.key === "Enter" && onVerify()}
						/>
					</FormField>
					<Button
						type="button"
						className="w-full"
						isLoading={verifyTwoFactor.isPending}
						disabled={!code}
						onClick={onVerify}
					>
						Verify & sign in
					</Button>
					<button
						type="button"
						className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline"
						onClick={() => {
							setChallengeToken(null);
							setCode("");
						}}
					>
						Back to login
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
			<p className="mt-1 text-sm text-slate-500">
				Welcome back, enter your details to continue.
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
				<FormField label="Email" error={errors.email?.message} required>
					<Input
						type="email"
						placeholder="you@company.com"
						{...register("email")}
					/>
				</FormField>
				<FormField label="Password" error={errors.password?.message} required>
					<Input
						type="password"
						placeholder="••••••••"
						{...register("password")}
					/>
				</FormField>
				<div className="flex justify-end">
					<Link
						href="/forgot-password"
						className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline">
						Forgot password?
					</Link>
				</div>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Sign in
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-500">
				Don&apos;t have an account?{" "}
				<Link
					href="/register"
					className="font-medium text-slate-900 hover:underline">
					Create one
				</Link>
			</p>
		</div>
	);
}
