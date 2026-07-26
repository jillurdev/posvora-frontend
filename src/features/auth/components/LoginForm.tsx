"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schema";
import { useLogin } from "../hooks/useLogin";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
	const router = useRouter();
	const { mutate, isPending } = useLogin();
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
				onSuccess: result => router.replace(`/${result.user.organization?.handle ?? ""}/dashboard`),
			},
		);
	};

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
