"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, KeyRound } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useResetPassword } from "@/features/auth/hooks/usePasswordReset";
import { toast } from "sonner";

function ResetPasswordContent() {
	const router = useRouter();
	const params = useSearchParams();
	const token = params.get("token");
	const { mutate, isPending } = useResetPassword();

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [done, setDone] = useState(false);

	if (!token) {
		return (
			<div className="w-full max-w-sm text-center">
				<h1 className="text-xl font-semibold text-slate-900">Invalid reset link</h1>
				<p className="mt-2 text-sm text-slate-500">
					This link is missing its token. Request a new one from the forgot password page.
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
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
					<CheckCircle2 className="h-6 w-6 text-emerald-600" />
				</div>
				<h1 className="mt-4 text-xl font-semibold text-slate-900">Password reset</h1>
				<p className="mt-2 text-sm text-slate-500">You can now sign in with your new password.</p>
				<Link href="/login" className="mt-6 inline-block">
					<Button>Go to sign in</Button>
				</Link>
			</div>
		);
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (password !== confirm) {
			toast.error("Passwords don't match");
			return;
		}
		mutate(
			{ token, newPassword: password },
			{ onSuccess: () => setDone(true) },
		);
	};

	return (
		<div className="w-full max-w-sm">
			<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
				<KeyRound className="h-5 w-5 text-slate-600" />
			</div>
			<h1 className="mt-4 text-2xl font-semibold text-slate-900">Set a new password</h1>
			<p className="mt-1 text-sm text-slate-500">Choose something you haven&apos;t used before.</p>

			<form onSubmit={handleSubmit} className="mt-8 space-y-4">
				<FormField label="New password" required>
					<Input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="••••••••"
						required
						minLength={8}
					/>
				</FormField>
				<FormField label="Confirm new password" required>
					<Input
						type="password"
						value={confirm}
						onChange={e => setConfirm(e.target.value)}
						placeholder="••••••••"
						required
						minLength={8}
					/>
				</FormField>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Reset password
				</Button>
			</form>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<Spinner />}>
			<ResetPasswordContent />
		</Suspense>
	);
}
