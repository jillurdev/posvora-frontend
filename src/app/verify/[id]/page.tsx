import { CheckCircle2, XCircle } from "lucide-react";
import { env } from "@/config/env";

export const metadata = { title: "Verify Receipt" };

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
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
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
