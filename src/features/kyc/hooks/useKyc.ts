"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { kycApi } from "../api";
import type { KycDocumentType } from "../types";

export function useKycDocuments() {
	return useQuery({ queryKey: ["kyc", "documents"], queryFn: kycApi.listMine });
}

export function useSubmitKycDocument() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ type, file }: { type: KycDocumentType; file: File }) => kycApi.submit(type, file),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["kyc", "documents"] });
			toast.success("Document submitted — we'll review it shortly");
		},
		onError: (err: Error) => toast.error(err.message || "Could not submit document"),
	});
}
