import { CheckCircle2, XCircle } from "lucide-react";
import { env } from "@/config/env";

export const metadata = { title: "Verify Receipt" };

interface VerifyItem {
	productName: string;
	sku?: string;
	quantity: number;
	unitPrice?: number;
	totalAmount?: number;
}

interface VerifyResult {
	valid: boolean;
	message?: string;
	invoiceNo?: string;
	date?: string;
	status?: string;
	totalAmount?: number;
	paidAmount?: number;
	dueAmount?: number;
	shopName?: string;
	branchName?: string;
	products?: VerifyItem[];
}

async function getResult(id: string, sig: string | undefined): Promise<VerifyResult> {
	try {
		const qs = sig ? `?sig=${encodeURIComponent(sig)}` : "";
		const res = await fetch(`${env.apiUrl}/sales/verify/${id}${qs}`, { cache: "no-store" });
		const json = await res.json().catch(() => null);
		if (!res.ok) return { valid: false, message: "This receipt could not be found." };
		return json?.data ?? json;
	} catch {
		return { valid: false, message: "Could not reach the verification service. Please try again." };
	}
}

export default async function VerifyReceiptPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ sig?: string }>;
}) {
	const { id } = await params;
	const { sig } = await searchParams;
	const result = await getResult(id, sig);

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4">
			{/* Background watermark */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center"
			>
				<span
					className="whitespace-nowrap text-[18vw] font-extrabold tracking-widest text-slate-900/[0.04]"
					style={{ transform: "rotate(-30deg)" }}
				>
					POSVORA
				</span>
			</div>

			<div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
				{result.valid ? (
					<>
						<CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-emerald-500" />
						<h1 className="text-lg font-semibold text-slate-900">Genuine receipt</h1>
						<p className="mt-1 text-sm text-slate-500">{result.shopName}</p>

						<div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-sm">
							<Row label="Invoice No." value={result.invoiceNo} />
							<Row label="Branch" value={result.branchName} />
							<Row label="Date" value={result.date ? new Date(result.date).toLocaleString("en-GB") : undefined} />
							<Row label="Status" value={result.status} />
							<Row label="Total" value={result.totalAmount !== undefined ? formatBDT(result.totalAmount) : undefined} />
							<Row label="Paid" value={result.paidAmount !== undefined ? formatBDT(result.paidAmount) : undefined} />
							{Number(result.dueAmount ?? 0) > 0 && (
								<Row label="Due" value={formatBDT(result.dueAmount!)} highlight />
							)}
						</div>

						{!!result.products?.length && (
							<div className="mt-4 rounded-xl border border-slate-200 p-4 text-left text-sm">
								<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Items</p>
								<div className="space-y-2">
									{result.products.map((item, idx) => (
										<div key={idx} className="flex items-start justify-between gap-2">
											<span className="text-slate-700">
												{item.productName}
												<span className="ml-1 text-xs text-slate-400">× {item.quantity}</span>
											</span>
											{item.totalAmount !== undefined && (
												<span className="shrink-0 font-medium text-slate-900">{formatBDT(item.totalAmount)}</span>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</>
				) : (
					<>
						<XCircle className="mx-auto mb-3 h-14 w-14 text-red-500" />
						<h1 className="text-lg font-semibold text-slate-900">Could not verify this receipt</h1>
						<p className="mt-2 text-sm text-slate-500">
							{result.message ?? "This receipt's signature doesn't match — it may have been altered or is not genuine."}
						</p>
					</>
				)}
			</div>
		</div>
	);
}

function Row({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
	if (!value) return null;
	return (
		<div className="flex items-center justify-between">
			<span className="text-slate-500">{label}</span>
			<span className={highlight ? "font-semibold text-amber-600" : "font-medium text-slate-900"}>{value}</span>
		</div>
	);
}

function formatBDT(amount: number) {
	return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(Number(amount) || 0);
}
