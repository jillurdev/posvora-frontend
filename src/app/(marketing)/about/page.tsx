import Link from "next/link";
import { Target, Heart, Users2 } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

const PILLARS = [
	{
		icon: Target,
		title: "Our mission",
		description:
			"Give every shop, restaurant and distributor the same operational tools that large chains take for granted — without the cost or complexity.",
	},
	{
		icon: Heart,
		title: "How we work",
		description:
			"We build with owners and cashiers in the room, not just spreadsheets. If a feature slows down the counter on a busy Friday, we redesign it.",
	},
	{
		icon: Users2,
		title: "Who we serve",
		description:
			"Retail stores, restaurants, pharmacies, wholesalers and service businesses running one counter or fifty branches.",
	},
];

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
			<span className="inline-flex items-center gap-2 rounded-sm border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] px-3 py-1 font-[var(--font-mk-mono)] text-xs text-[var(--mk-ink-soft)]">
				<span className="h-1.5 w-1.5 rounded-full bg-[var(--mk-till)]" />
				About us
			</span>
			<h1 className="mt-4 font-[var(--font-mk-display)] text-4xl font-semibold tracking-tight text-[var(--mk-ink)]">
				Built for businesses that run on the ground
			</h1>
			<p className="mt-6 text-lg text-[var(--mk-ink-soft)]">
				Posvora started from a simple observation: most small and mid-sized businesses juggle separate tools
				for selling, tracking stock, managing staff and doing the books — and none of them talk to each other.
				We set out to build a single, affordable platform that handles all of it, in one place, for teams that
				don&apos;t have time to babysit software.
			</p>

			<div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
				{PILLARS.map((p, i) => (
					<Reveal key={p.title} delayMs={i * 80}>
						<div className="h-full rounded-xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)] p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--mk-till-soft)] text-[var(--mk-till-deep)]">
								<p.icon className="h-5 w-5" />
							</div>
							<h3 className="mt-4 text-base font-semibold text-[var(--mk-ink)]">{p.title}</h3>
							<p className="mt-2 text-sm text-[var(--mk-ink-soft)]">{p.description}</p>
						</div>
					</Reveal>
				))}
			</div>

			<Reveal>
				<div className="mt-16 overflow-hidden rounded-2xl bg-[var(--mk-till-deep)] p-8">
					<h3 className="font-[var(--font-mk-display)] text-lg font-semibold text-white">Questions about Posvora?</h3>
					<p className="mt-2 text-sm text-[var(--mk-till-soft)]">
						We&apos;d love to hear from you — reach out on the{" "}
						<Link href="/contact" className="font-medium text-[var(--mk-gold-soft)] underline underline-offset-2">
							contact page
						</Link>{" "}
						and our team will get back to you.
					</p>
				</div>
			</Reveal>
		</div>
	);
}
