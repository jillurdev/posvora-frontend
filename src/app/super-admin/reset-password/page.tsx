"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminResetPassword } from "@/features/admin-auth/hooks/useAdminForgotPassword";

function AdminResetPasswordInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";
	const { mutate, isPending } = useAdminResetPassword();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [done, setDone] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (newPassword.length < 6) return setError("Password must be at least 6 characters");
		if (newPassword !== confirmPassword) return setError("Passwords do not match");
		mutate({ token, newPassword }, { onSuccess: () => setDone(true) });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
			<div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-8">
				{!token ? (
					<div className="text-center">
						<h1 className="text-lg font-semibold text-white">Invalid link</h1>
						<p className="mt-2 text-sm text-slate-400">
							This reset link is missing its token. Please request a new one.
						</p>
						<Link
							href="/super-admin/forgot-password"
							className="mt-6 inline-block text-sm font-medium text-slate-200 hover:underline">
							Request a new link
						</Link>
					</div>
				) : done ? (
					<div className="text-center">
						<div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800">
							<CheckCircle2 className="h-5 w-5 text-slate-300" />
						</div>
						<h1 className="mt-4 text-lg font-semibold text-white">Password reset</h1>
						<p className="mt-2 text-sm text-slate-400">Your admin password has been changed. Please sign in again.</p>
						<Button className="mt-6 w-full" onClick={() => router.replace("/super-admin/login")}>
							Sign in
						</Button>
					</div>
				) : (
					<>
						<div className="flex flex-col items-center text-center">
							<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800">
								<ShieldCheck className="h-5 w-5 text-slate-300" />
							</div>
							<h1 className="mt-4 text-lg font-semibold text-white">Set a new password</h1>
						</div>
						<form onSubmit={handleSubmit} className="mt-8 space-y-4">
							<TextField
								id="admin-new-password"
								label="New password"
								required
								wrapperClassName="[&_label]:text-slate-300"
								type="password"
								value={newPassword}
								onChange={e => setNewPassword(e.target.value)}
								className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
							/>
							<TextField
								id="admin-confirm-password"
								label="Confirm new password"
								required
								error={error}
								wrapperClassName="[&_label]:text-slate-300"
								type="password"
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
							/>
							<Button type="submit" className="w-full" isLoading={isPending}>
								Reset password
							</Button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default function AdminResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-slate-950">
					<Spinner />
				</div>
			}>
			<AdminResetPasswordInner />
		</Suspense>
	);
}
