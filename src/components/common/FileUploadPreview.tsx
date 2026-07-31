"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FileUploadPreviewProps {
	label: string;
	hint?: string;
	currentUrl?: string | null;
	shape?: "circle" | "square";
	onConfirm: (file: File) => Promise<unknown>;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;

export function FileUploadPreview({
	label,
	hint,
	currentUrl,
	shape = "square",
	onConfirm,
}: FileUploadPreviewProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Local object URL only — nothing is sent anywhere until "Confirm & upload".
	useEffect(() => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		const picked = e.target.files?.[0];
		if (!picked) return;

		if (picked.size > MAX_BYTES) {
			setError("File is too large (max 5MB).");
			return;
		}
		setFile(picked);
	};

	const onCancel = () => {
		setFile(null);
		setPreviewUrl(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	const onUpload = async () => {
		if (!file) return;
		setIsUploading(true);
		setError(null);
		try {
			await onConfirm(file);
			onCancel();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const displayUrl = previewUrl ?? currentUrl ?? null;

	return (
		<div className="flex items-start gap-4">
			<div
				className={cn(
					"flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-50",
					shape === "circle" ? "rounded-full" : "rounded-lg",
				)}
			>
				{displayUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={displayUrl} alt={label} className="h-full w-full object-cover" />
				) : (
					<ImageUp className="h-6 w-6 text-slate-300" />
				)}
			</div>

			<div className="flex-1">
				<p className="text-sm font-medium text-slate-700">{label}</p>
				{hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}

				<input
					ref={inputRef}
					type="file"
					accept={ACCEPTED_TYPES}
					className="hidden"
					onChange={onPick}
				/>

				<div className="mt-2 flex items-center gap-2">
					{!file ? (
						<Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
							Choose file
						</Button>
					) : (
						<>
							<Button type="button" size="sm" onClick={onUpload} disabled={isUploading}>
								{isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & upload"}
							</Button>
							<Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={isUploading}>
								Cancel
							</Button>
						</>
					)}
				</div>

				{error && <p className="mt-1 text-xs text-red-600">{error}</p>}
			</div>
		</div>
	);
}
