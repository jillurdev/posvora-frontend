"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, MailCheck } from "lucide-react";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAdminForgotPassword } from "@/features/admin-auth/hooks/useAdminForgotPassword";

export default function AdminForgotPasswordPage() {
	const { mutate, isPending } = useAdminForgotPassword();
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate({ email }, { onSuccess: () => setSubmitted(true) });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
			<div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-8">
				<div className="flex flex-col items-center text-center">
					<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800">
						{submitted ? (
							<MailCheck className="h-5 w-5 text-slate-300" />
						) : (
							<ShieldCheck className="h-5 w-5 text-slate-300" />
						)}
					</div>
					<h1 className="mt-4 text-lg font-semibold text-white">
						{submitted ? "Check your email" : "Reset admin password"}
					</h1>
					<p className="mt-1 text-sm text-slate-400">
						{submitted
							? "If a platform admin account exists with that email, we've sent a reset link. It expires in 15 minutes."
							: "Enter your platform staff email and we'll send you a link to reset your password."}
					</p>
				</div>

				{!submitted && (
					<form onSubmit={handleSubmit} className="mt-8 space-y-4">
						<TextField
							id="admin-email"
							label="Email"
							required
							wrapperClassName="[&_label]:text-slate-300"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							autoComplete="username"
							className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
						/>
						<Button type="submit" className="w-full" isLoading={isPending}>
							Send reset link
						</Button>
					</form>
				)}

				<p className="mt-6 text-center text-sm text-slate-400">
					<Link href="/super-admin/login" className="font-medium text-slate-200 hover:underline">
						Back to sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
