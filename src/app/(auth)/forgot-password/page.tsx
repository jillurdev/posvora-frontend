"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForgotPassword } from "@/features/auth/hooks/usePasswordReset";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const { mutate, isPending } = useForgotPassword();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate(email, { onSuccess: () => setSent(true) });
	};

	if (sent) {
		return (
			<div className="w-full max-w-sm text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
					<MailCheck className="h-6 w-6 text-emerald-600" />
				</div>
				<h1 className="mt-4 text-xl font-semibold text-slate-900">Check your email</h1>
				<p className="mt-2 text-sm text-slate-500">
					If an account exists for <span className="font-medium text-slate-700">{email}</span>, we&apos;ve sent a
					link to reset your password. It expires in 30 minutes.
				</p>
				<Link href="/login" className="mt-6 inline-block text-sm font-medium text-slate-900 hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full max-w-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
			<p className="mt-1 text-sm text-slate-500">
				Enter your account email and we&apos;ll send you a reset link.
			</p>

			<form onSubmit={handleSubmit} className="mt-8 space-y-4">
				<FormField label="Email" required>
					<Input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="you@company.com"
						required
					/>
				</FormField>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Send reset link
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-500">
				Remembered it?{" "}
				<Link href="/login" className="font-medium text-slate-900 hover:underline">
					Back to sign in
				</Link>
			</p>
		</div>
	);
}
