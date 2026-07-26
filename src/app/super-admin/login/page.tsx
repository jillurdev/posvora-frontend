"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminLogin } from "@/features/admin-auth/hooks/useAdminAuth";

export default function SuperAdminLoginPage() {
	const router = useRouter();
	const { admin, isLoading } = useAdminAuth();
	const { mutate, isPending } = useAdminLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (!isLoading && admin) router.replace("/super-admin");
	}, [isLoading, admin, router]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate(
			{ email, password },
			{ onSuccess: () => router.replace("/super-admin") },
		);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
			<div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-8">
				<div className="flex flex-col items-center text-center">
					<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800">
						<ShieldCheck className="h-5 w-5 text-slate-300" />
					</div>
					<h1 className="mt-4 text-lg font-semibold text-white">
						Platform Admin
					</h1>
					<p className="mt-1 text-sm text-slate-400">
						This is a separate, staff-only login — not your Posvora business
						account.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-4">
					<TextField
						id="admin-login-email"
						label="Email"
						required
						wrapperClassName="[&_label]:text-slate-300"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="Enter your email"
						autoComplete="username"
						className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
					/>
					<TextField
						id="admin-login-password"
						label="Password"
						required
						wrapperClassName="[&_label]:text-slate-300"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="xxxxxx"
						autoComplete="current-password"
						className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
					/>
					<div className="flex justify-end">
						<Link
							href="/super-admin/forgot-password"
							className="text-sm font-medium text-slate-400 hover:text-slate-200 hover:underline">
							Forgot password?
						</Link>
					</div>
					<Button type="submit" className="w-full" isLoading={isPending}>
						Sign in
					</Button>
				</form>
			</div>
		</div>
	);
}
