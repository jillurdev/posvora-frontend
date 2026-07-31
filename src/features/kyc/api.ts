import { httpClient } from "@/services/httpClient";
import type { KycDocumentsResponse, KycDocumentType, KycDocument } from "./types";

export const kycApi = {
	listMine: () => httpClient.get<KycDocumentsResponse>("/kyc/documents"),
	submit: (type: KycDocumentType, file: File) => {
		const formData = new FormData();
		formData.append("type", type);
		formData.append("file", file);
		return httpClient.upload<KycDocument>("/kyc/documents", formData);
	},
};
