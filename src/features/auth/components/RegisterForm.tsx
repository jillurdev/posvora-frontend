"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "../schema";
import { useRegister } from "../hooks/useRegister";
import { FormField } from "@/components/ui/FormField";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const BUSINESS_TYPES = ["RETAIL", "RESTAURANT", "PHARMACY", "GROCERY", "WHOLESALE", "SERVICE", "OTHER"];

export function RegisterForm() {
	const router = useRouter();
	const { mutate, isPending } = useRegister();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

	const onSubmit = (values: RegisterFormValues) => {
		mutate(values, {
			onSuccess: result =>
				router.replace(`/verify-email?email=${encodeURIComponent(result.email)}`),
		});
	};

	return (
		<div className="w-full max-w-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Create your business account</h1>
			<p className="mt-1 text-sm text-slate-500">Set up your organization on Posvora in a minute.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
				<FormField label="Your name" error={errors.name?.message} required>
					<Input placeholder="Jane Doe" {...register("name")} />
				</FormField>
				<FormField label="Business name" error={errors.organizationName?.message} required>
					<Input placeholder="Jane's Retail Store" {...register("organizationName")} />
				</FormField>
				<FormField label="Business type" error={errors.businessType?.message} required>
					<Select {...register("businessType")} defaultValue="">
						<option value="" disabled>
							Select business type
						</option>
						{BUSINESS_TYPES.map(t => (
							<option key={t} value={t}>
								{t.charAt(0) + t.slice(1).toLowerCase()}
							</option>
						))}
					</Select>
				</FormField>
				<FormField label="Email" error={errors.email?.message} required>
					<Input type="email" placeholder="you@company.com" {...register("email")} />
				</FormField>
				<FormField label="Phone" error={errors.phone?.message}>
					<Input placeholder="+1 555 123 4567" {...register("phone")} />
				</FormField>
				<FormField label="Password" error={errors.password?.message} required>
					<Input type="password" placeholder="••••••••" {...register("password")} />
				</FormField>
				<Button type="submit" className="w-full" isLoading={isPending}>
					Create account
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-500">
				Already have an account?{" "}
				<Link href="/login" className="font-medium text-slate-900 hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	);
}
