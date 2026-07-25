"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function ContactPage() {
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		// Wire this up to a real endpoint (e.g. POST /support/contact) when available.
		setTimeout(() => {
			setSubmitting(false);
			toast.success("Thanks! We'll get back to you within one business day.");
			(e.target as HTMLFormElement).reset();
		}, 800);
	};

	return (
		<div className="mx-auto max-w-5xl px-4 py-20 lg:px-8">
			<span className="text-sm font-medium text-slate-400">Contact</span>
			<h1 className="mt-2 text-4xl font-semibold text-slate-900">Let&apos;s talk</h1>
			<p className="mt-4 max-w-xl text-lg text-slate-500">
				Have a question about pricing, a feature, or setting up your business? Send us a message.
			</p>

			<div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5">
				<div className="lg:col-span-2 lg:border-r lg:border-slate-100 lg:pr-8">
					<div className="space-y-6">
						<div className="flex items-start gap-3">
							<Mail className="mt-0.5 h-5 w-5 text-slate-400" />
							<div>
								<p className="text-sm font-medium text-slate-900">Email</p>
								<p className="text-sm text-slate-500">support@posvora.com</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Phone className="mt-0.5 h-5 w-5 text-slate-400" />
							<div>
								<p className="text-sm font-medium text-slate-900">Phone</p>
								<p className="text-sm text-slate-500">+880 1XXX-XXXXXX</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<MapPin className="mt-0.5 h-5 w-5 text-slate-400" />
							<div>
								<p className="text-sm font-medium text-slate-900">Office</p>
								<p className="text-sm text-slate-500">Dhaka, Bangladesh</p>
							</div>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4 lg:col-span-3">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField label="Your name" required>
							<Input required placeholder="Jane Doe" />
						</FormField>
						<FormField label="Email" required>
							<Input type="email" required placeholder="you@company.com" />
						</FormField>
					</div>
					<FormField label="Business name">
						<Input placeholder="Your business (optional)" />
					</FormField>
					<FormField label="Message" required>
						<Textarea rows={5} required placeholder="Tell us what you need..." />
					</FormField>
					<Button type="submit" isLoading={submitting}>
						<Send className="h-4 w-4" /> Send message
					</Button>
				</form>
			</div>
		</div>
	);
}
