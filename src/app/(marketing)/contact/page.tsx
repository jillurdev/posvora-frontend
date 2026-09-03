"use client";

import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { TextField, TextareaField } from "@/components/ui/Field";
import { toast } from "sonner";
import { supportApi } from "@/features/support/api";
import { Reveal } from "@/components/marketing/Reveal";
import { FaqAccordion, type FaqItem } from "@/components/marketing/FaqAccordion";

const CONTACT_FAQS: FaqItem[] = [
	{
		question: "How fast will I hear back?",
		answer: "We reply to every message within one business day. You'll also get a tracking link so you can follow the conversation without waiting on email.",
	},
	{
		question: "I have a question about pricing, not support",
		answer: "That's fine — send it here too. If you just want to compare plans first, the Pricing page lists every plan's price and features publicly, no sales call needed.",
	},
	{
		question: "I'm an existing customer with an issue",
		answer: "You'll get a faster response by logging in and opening a ticket from Support inside your dashboard — it's tied to your account, so our team already has your organization's context.",
	},
];

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
			<span className="inline-flex items-center gap-2 rounded-sm border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] px-3 py-1 font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">
				<span className="h-1.5 w-1.5 rounded-full bg-[var(--mk-till)]" />
				Contact
			</span>
			<h1 className="mt-4 font-[var(--font-mk-display)] text-4xl font-semibold tracking-tight text-[var(--mk-ink)]">
				Let&apos;s talk
			</h1>
			<p className="mt-4 max-w-xl text-lg text-[var(--mk-ink-soft)]">
				Have a question about pricing, a feature, or setting up your business? Send us a message.
			</p>

			<div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5">
				<Reveal className="lg:col-span-2 lg:border-r lg:border-[var(--mk-line)] lg:pr-8">
					<div className="space-y-6">
						<div className="flex items-start gap-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
								<Mail className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium text-[var(--mk-ink)]">Email</p>
								<p className="text-sm text-[var(--mk-ink-soft)]">support@posvora.com</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
								<MapPin className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium text-[var(--mk-ink)]">Office</p>
								<p className="text-sm text-[var(--mk-ink-soft)]">Dhaka, Bangladesh</p>
							</div>
						</div>
					</div>
				</Reveal>

				<Reveal className="lg:col-span-3" delayMs={100}>
					{submitted ? (
						<div className="rounded-xl border border-[var(--mk-till)]/30 bg-[var(--mk-till-soft)] p-6">
							<CheckCircle2 className="h-8 w-8 text-[var(--mk-till-deep)]" />
							<p className="mt-3 text-sm font-medium text-[var(--mk-till-deep)]">
								Message sent — reference #{submitted.id.slice(0, 8)}
							</p>
							<p className="mt-1 text-sm text-[var(--mk-ink-soft)]">
								You can{" "}
								<a
									href={`/support/track?id=${submitted.id}&token=${submitted.token}`}
									className="font-medium text-[var(--mk-till-deep)] underline underline-offset-2"
								>
									track this ticket
								</a>{" "}
								anytime — save this link, it&apos;s the only way back in.
							</p>
							<button
								onClick={() => setSubmitted(null)}
								className="mt-4 inline-flex h-9 items-center rounded-md border border-[var(--mk-till)]/30 px-4 text-sm font-medium text-[var(--mk-till-deep)] hover:bg-white/50"
							>
								Send another message
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<TextField id="contact-name" label="Your name" name="name" required placeholder="Jane Doe" />
								<TextField id="contact-email" label="Email" name="email" type="email" required placeholder="you@company.com" />
							</div>
							<TextField id="contact-business" label="Business name" name="business" placeholder="Your business (optional)" />
							<TextareaField
								id="contact-message"
								label="Message"
								name="message"
								rows={5}
								required
								placeholder="Tell us what you need..."
							/>
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--mk-till)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--mk-till-deep)] disabled:opacity-50"
							>
								<Send className="h-4 w-4" /> {submitting ? "Sending…" : "Send message"}
							</button>
						</form>
					)}
				</Reveal>
			</div>

			<Reveal className="mt-20 max-w-2xl" delayMs={100}>
				<h2 className="font-[var(--font-mk-display)] text-xl font-semibold tracking-tight text-[var(--mk-ink)]">
					Before you write in
				</h2>
				<div className="mt-6">
					<FaqAccordion items={CONTACT_FAQS} />
				</div>
			</Reveal>
		</div>
	);
}
