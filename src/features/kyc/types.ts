export type KycDocumentType = "NID" | "PASSPORT" | "TRADE_LICENSE";
export type KycReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
export type OrganizationVerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

export interface KycDocument {
	id: string;
	type: KycDocumentType;
	fileUrl: string;
	status: KycReviewStatus;
	rejectionReason?: string | null;
	createdAt: string;
}

export interface KycDocumentsResponse {
	verificationStatus: OrganizationVerificationStatus;
	documents: KycDocument[];
}

export interface SubmitKycDocumentPayload {
	type: KycDocumentType;
	fileUrl: string;
}
