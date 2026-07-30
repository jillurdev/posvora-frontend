import { httpClient } from "@/services/httpClient";
import type { KycDocumentsResponse, SubmitKycDocumentPayload, KycDocument } from "./types";

export const kycApi = {
	listMine: () => httpClient.get<KycDocumentsResponse>("/kyc/documents"),
	submit: (payload: SubmitKycDocumentPayload) =>
		httpClient.post<KycDocument>("/kyc/documents", payload),
};
