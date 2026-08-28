"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades + slides children into place the first time they scroll into view.
 * Plain IntersectionObserver — no animation library needed for something
 * this simple, and it respects prefers-reduced-motion via the CSS in
 * globals.css rather than JS branching.
 */
export function Reveal({
	children,
	className,
	delayMs = 0,
}: {
	children: ReactNode;
	className?: string;
	delayMs?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={cn("mk-reveal", inView && "mk-in", className)}
			style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
		>
			{children}
		</div>
	);
}
