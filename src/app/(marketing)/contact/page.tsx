"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { supportApi } from "@/features/support/api";

export default function ContactPage() {
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState<{ id: string; token: string } | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const name = String(formData.get("name") || "");
		const email = String(formData.get("email") || "");
		const business = String(formData.get("business") || "");
		const message = String(formData.get("message") || "");

		setSubmitting(true);
		try {
			const ticket = await supportApi.createGuest({
				guestName: name,
				guestEmail: email,
				subject: business ? `Website inquiry — ${business}` : "Website inquiry",
				description: message,
			});
			setSubmitted({ id: ticket.id, token: ticket.guestAccessToken! });
			toast.success("Thanks! We'll get back to you within one business day.");
			form.reset();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not send your message. Please try again.");
		} finally {
			setSubmitting(false);
		}
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

				<div className="lg:col-span-3">
					{submitted ? (
						<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
							<CheckCircle2 className="h-8 w-8 text-emerald-600" />
							<p className="mt-3 text-sm font-medium text-emerald-900">
								Message sent — reference #{submitted.id.slice(0, 8)}
							</p>
							<p className="mt-1 text-sm text-emerald-700">
								You can{" "}
								<a
									href={`/support/track?id=${submitted.id}&token=${submitted.token}`}
									className="font-medium underline"
								>
									track this ticket
								</a>{" "}
								anytime — save this link, it&apos;s the only way back in.
							</p>
							<Button variant="outline" size="sm" className="mt-4" onClick={() => setSubmitted(null)}>
								Send another message
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<FormField label="Your name" required>
									<Input name="name" required placeholder="Jane Doe" />
								</FormField>
								<FormField label="Email" required>
									<Input name="email" type="email" required placeholder="you@company.com" />
								</FormField>
							</div>
							<FormField label="Business name">
								<Input name="business" placeholder="Your business (optional)" />
							</FormField>
							<FormField label="Message" required>
								<Textarea name="message" rows={5} required placeholder="Tell us what you need..." />
							</FormField>
							<Button type="submit" isLoading={submitting}>
								<Send className="h-4 w-4" /> Send message
							</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
