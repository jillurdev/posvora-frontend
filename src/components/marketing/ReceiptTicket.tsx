"use client";

import { useEffect, useState } from "react";

/**
 * The signature element for the landing page: a POS receipt that "prints"
 * itself line by line on load, mirroring an actual Posvora sales receipt
 * (item rows, subtotal/discount/VAT, paid vs due, barcode). It's the most
 * characteristic artifact in this product's world, so it earns the hero spot.
 */
const ITEMS = [
	{ name: "Samsung Galaxy A54", qty: "1", price: "৳42,000" },
	{ name: "Tempered glass", qty: "2", price: "৳500" },
	{ name: "Silicone case", qty: "1", price: "৳350" },
];

const LINES = [
	{ label: "Subtotal", value: "৳43,350", delay: 900 },
	{ label: "Discount", value: "− ৳1,350", delay: 1000 },
	{ label: "VAT (5%)", value: "৳2,100", delay: 1100 },
];

export function ReceiptTicket() {
	// Print-in only starts once mounted, so the browser has an actual
	// "before" state to transition from (a class present at first paint
	// never animates in on its own).
	const [printed, setPrinted] = useState(false);
	useEffect(() => {
		const t = requestAnimationFrame(() => setPrinted(true));
		return () => cancelAnimationFrame(t);
	}, []);
	const cls = (base: string) => `mk-reveal ${printed ? "mk-in" : ""} ${base}`;

	return (
		<div className="relative mx-auto w-full max-w-[300px] select-none sm:max-w-[320px]">
			{/* soft till-green glow behind the ticket */}
			<div
				aria-hidden
				className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
				style={{ background: "radial-gradient(closest-side, var(--mk-till-soft), transparent)" }}
			/>

			<div
				className={cls("relative rotate-[-3deg] rounded-sm bg-white px-5 pb-6 pt-5 shadow-[0_20px_45px_-15px_rgba(14,107,79,0.35)]")}
				style={{
					transitionDelay: "0ms",
					clipPath:
						"polygon(0% 1%,4% 0%,8% 1.5%,12% 0%,16% 1.5%,20% 0%,24% 1.5%,28% 0%,32% 1.5%,36% 0%,40% 1.5%,44% 0%,48% 1.5%,52% 0%,56% 1.5%,60% 0%,64% 1.5%,68% 0%,72% 1.5%,76% 0%,80% 1.5%,84% 0%,88% 1.5%,92% 0%,96% 1.5%,100% 0%,100% 100%,0% 100%)",
				}}
			>
				<div className="flex items-center justify-between">
					<span className="font-[var(--font-mk-display)] text-sm font-semibold tracking-tight text-[var(--mk-ink)]">
						POSVORA
					</span>
					<span className="font-[var(--font-mk-mono)] text-[10px] text-[var(--mk-ink-soft)]">SALE RECEIPT</span>
				</div>
				<p className="mt-0.5 font-[var(--font-mk-mono)] text-[10px] text-[var(--mk-ink-soft)]">
					INV-2026-000217 · Main Branch
				</p>

				<div className="mt-3 border-t border-dashed border-[var(--mk-line)] pt-3">
					<div className="space-y-2">
						{ITEMS.map((item, i) => (
							<div
								key={item.name}
								className={cls("flex items-baseline justify-between gap-2 font-[var(--font-mk-mono)] text-[11px] text-[var(--mk-ink)]")}
								style={{ transitionDelay: `${300 + i * 220}ms` }}
							>
								<span className="truncate text-[var(--mk-ink-soft)]">
									{item.qty}× {item.name}
								</span>
								<span className="shrink-0 font-medium">{item.price}</span>
							</div>
						))}
					</div>

					<div className="mt-3 space-y-1 border-t border-dashed border-[var(--mk-line)] pt-3">
						{LINES.map(line => (
							<div
								key={line.label}
								className={cls("flex items-center justify-between font-[var(--font-mk-mono)] text-[10px] text-[var(--mk-ink-soft)]")}
								style={{ transitionDelay: `${line.delay}ms` }}
							>
								<span>{line.label}</span>
								<span>{line.value}</span>
							</div>
						))}
					</div>

					<div
						className={cls("mt-2 flex items-center justify-between border-t border-[var(--mk-ink)] pt-2 font-[var(--font-mk-mono)] text-sm font-semibold text-[var(--mk-ink)]")}
						style={{ transitionDelay: "1250ms" }}
					>
						<span>Total</span>
						<span>৳44,100</span>
					</div>

					<div
						className={cls("mt-3 flex items-center justify-between rounded-sm bg-[var(--mk-till-soft)] px-2 py-1.5 font-[var(--font-mk-mono)] text-[10px] font-medium text-[var(--mk-till-deep)]")}
						style={{ transitionDelay: "1400ms" }}
					>
						<span className="tracking-wide">PAID · CASH</span>
						<span
							className="inline-block h-3 w-[6px] bg-[var(--mk-till-deep)] align-middle"
							style={{ animation: "mk-blink 1s step-end infinite" }}
							aria-hidden
						/>
					</div>
				</div>

				{/* barcode flourish */}
				<div
					className={cls("mt-4 flex h-6 items-end gap-[2px]")}
					style={{ transitionDelay: "1550ms" }}
					aria-hidden
				>
					{Array.from({ length: 28 }).map((_, i) => (
						<span
							key={i}
							className="bg-[var(--mk-ink)]"
							style={{ width: 2, height: [4, 10, 16, 22, 12, 20][i % 6] }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
