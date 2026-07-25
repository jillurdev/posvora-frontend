import { Target, Heart, Users2 } from "lucide-react";

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
			<span className="text-sm font-medium text-slate-400">About us</span>
			<h1 className="mt-2 text-4xl font-semibold text-slate-900">Built for businesses that run on the ground</h1>
			<p className="mt-6 text-lg text-slate-500">
				Posvora started from a simple observation: most small and mid-sized businesses juggle separate tools
				for selling, tracking stock, managing staff and doing the books — and none of them talk to each other.
				We set out to build a single, affordable platform that handles all of it, in one place, for teams that
				don&apos;t have time to babysit software.
			</p>

			<div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
				<div>
					<Target className="h-6 w-6 text-slate-900" />
					<h3 className="mt-4 text-base font-semibold text-slate-900">Our mission</h3>
					<p className="mt-2 text-sm text-slate-500">
						Give every shop, restaurant and distributor the same operational tools that large chains take
						for granted — without the cost or complexity.
					</p>
				</div>
				<div>
					<Heart className="h-6 w-6 text-slate-900" />
					<h3 className="mt-4 text-base font-semibold text-slate-900">How we work</h3>
					<p className="mt-2 text-sm text-slate-500">
						We build with owners and cashiers in the room, not just spreadsheets. If a feature slows down
						the counter on a busy Friday, we redesign it.
					</p>
				</div>
				<div>
					<Users2 className="h-6 w-6 text-slate-900" />
					<h3 className="mt-4 text-base font-semibold text-slate-900">Who we serve</h3>
					<p className="mt-2 text-sm text-slate-500">
						Retail stores, restaurants, pharmacies, wholesalers and service businesses running one counter
						or fifty branches.
					</p>
				</div>
			</div>

			<div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-8">
				<h3 className="text-lg font-semibold text-slate-900">Questions about Posvora?</h3>
				<p className="mt-2 text-sm text-slate-500">
					We&apos;d love to hear from you — reach out on the{" "}
					<a href="/contact" className="font-medium text-slate-900 underline">
						contact page
					</a>{" "}
					and our team will get back to you.
				</p>
			</div>
		</div>
	);
}
