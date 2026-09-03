"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
	question: string;
	answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<div className="divide-y divide-[var(--mk-line)] rounded-2xl border border-[var(--mk-line)] bg-[var(--mk-paper-raised)]">
			{items.map((item, i) => {
				const isOpen = openIndex === i;
				return (
					<div key={item.question}>
						<button
							onClick={() => setOpenIndex(isOpen ? null : i)}
							className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
							aria-expanded={isOpen}
						>
							<span className="text-sm font-medium text-[var(--mk-ink)] sm:text-base">{item.question}</span>
							<ChevronDown
								className={cn(
									"h-4 w-4 shrink-0 text-[var(--mk-ink-soft)] transition-transform duration-200",
									isOpen && "rotate-180",
								)}
							/>
						</button>
						<div
							className={cn(
								"grid transition-all duration-200 ease-out",
								isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
							)}
						>
							<div className="overflow-hidden">
								<p className="px-6 pb-5 text-sm text-[var(--mk-ink-soft)]">{item.answer}</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
